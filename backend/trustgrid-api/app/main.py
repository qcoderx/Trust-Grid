# app/main.py
import sys
sys.path.append('..')
from fastapi import (
    FastAPI, HTTPException, Depends, status, 
    UploadFile, File, Form  # <-- NEW: For file uploads
)
from fastapi.middleware.cors import CORSMiddleware
import pymongo
from app.database import (
    users_collection,
    organizations_collection,
    consent_log_collection,
    api_keys_collection,
    db as check_db_connection,
)
from app.models import (
    User,
    UserCreate,
    Organization,
    OrgPolicyUpdate,      # We will deprecate this
    DataRequestBody,
    ConsentLog,
    ConsentResponseBody,
    ApiKey,
    ApiKeyCreate,
    PyObjectId,
    validate_object_id,
)
from app.auth import get_current_org
from app.ai_compliance import (
    check_policy_compliance,
    verify_organization_identity # <-- NEW
)
from passlib.context import CryptContext
from datetime import datetime, timezone
from bson import ObjectId
import uvicorn
import logging
from typing import Literal, Annotated # <-- NEW
import google.generativeai as genai # <-- NEW: For uploading the file
import os     # <-- NEW: For saving files
import shutil # <-- NEW: For saving files
import secrets # <-- NEW: For generating API keys

# --- App Setup ---
app = FastAPI(
    title="Trust-Grid API",
    description="GenAI-powered compliance regulator (v4.0).",
    version="4.0.0",
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Static File Directory (for uploaded certs) ---
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


# --- Health Check ---
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    # (No changes here)
    if check_db_connection is None:
        raise HTTPException(status_code=503, detail="Database not connected")
    try:
        check_db_connection.client.admin.command("ping")
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {e}")

# --- Component 1: Citizen App Endpoints (Ayo's App) ---
# (No changes to any Citizen endpoints)
@app.post("/api/v1/citizen/register", response_model=User, status_code=status.HTTP_201_CREATED, tags=["Citizen (Ayo)"])
async def create_user(user: UserCreate):
    # (No changes here)
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    user_doc = {"username": user.username, "password": user.password}
    result = users_collection.insert_one(user_doc)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    return User(**created_user)

@app.get("/api/v1/citizen/{user_id}/requests", response_model=list[ConsentLog], tags=["Citizen (Ayo)"])
async def get_pending_requests(user_id: str):
    # (No changes here)
    requests = consent_log_collection.find({"user_id": user_id, "status": "pending"}).sort("timestamp", -1)
    return list(requests)

@app.post("/api/v1/citizen/respond", status_code=status.HTTP_200_OK, tags=["Citizen (Ayo)"])
async def respond_to_request(body: ConsentResponseBody):
    # (No changes here, using your teammate's validation)
    try:
        request_oid = validate_object_id(body.request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request_id format.")
    result = consent_log_collection.update_one(
        {"_id": request_oid, "status": "pending"},
        {"$set": {"status": body.decision, "timestamp": datetime.now(timezone.utc)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found or already actioned.")
    return {"message": f"Consent status updated to '{body.decision}'."}

@app.get("/api/v1/citizen/{user_id}/log", response_model=list[ConsentLog], tags=["Citizen (Ayo)"])
async def get_citizen_transparency_log(user_id: str):
    # (No changes here)
    logs = consent_log_collection.find({"user_id": user_id}).sort("timestamp", -1)
    return list(logs)

# --- Component 2 & 3: Org API Endpoints (SME-Femi's Backend) ---

# --- NEW VERIFICATION ENDPOINT ---
@app.post("/api/v1/org/submit-for-verification", tags=["Organization (SME-Femi)"])
async def submit_for_verification(
    # We use Annotated[str, Form()] for multipart data
    org_name: Annotated[str, Form()],
    company_description: Annotated[str, Form()],
    company_category: Annotated[Literal[
        "Fintech", "E-commerce", "Social Media", "Dating", "Healthcare", "Gaming", "Other"
    ], Form()],
    website_url: Annotated[str, Form()],
    business_registration_number: Annotated[str, Form()],
    cac_certificate: Annotated[UploadFile, File()],
    org: Organization = Depends(get_current_org)
):
    """
    SME-Femi submits his company profile ONE TIME for AI verification.
    This endpoint accepts form-data, including a file.
    """
    if org.verification_status == "verified":
        raise HTTPException(status_code=400, detail="This organization is already verified.")

    # --- 1. Save the uploaded file locally ---
    file_path = os.path.join(UPLOAD_DIRECTORY, f"{org.id}_{cac_certificate.filename}")
    try:
        with open(file_path, "wb+") as file_object:
            shutil.copyfileobj(cac_certificate.file, file_object)
    except Exception as e:
        logger.error(f"Failed to save file: {e}")
        raise HTTPException(status_code=500, detail="Failed to save certificate file.")
    finally:
        cac_certificate.file.close() # Close the file stream

    # --- 2. Upload file to Google AI (for the model to see) ---
    uploaded_file = None
    try:
        logger.info(f"Uploading {file_path} to Gemini for analysis...")
        # Note: 'display_name' is just for your reference in the AI console
        uploaded_file = genai.upload_file(path=file_path, display_name=f"{org_name} CAC")
    except Exception as e:
        logger.error(f"Failed to upload file to Gemini: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload file to AI service: {e}")

    # --- 3. Call the AI Verifier ---
    logger.info(f"Submitting {org_name} for AI verification...")
    ai_result = await verify_organization_identity(
        org_name=org_name,
        business_registration_number=business_registration_number,
        cac_certificate_file=uploaded_file # Pass the file *handle*
    )

    # --- 4. Update Org in DB based on AI decision ---
    update_data = {
        "org_name": org_name,
        "company_description": company_description,
        "company_category": company_category,
        "website_url": website_url,
        "business_registration_number": business_registration_number,
        "cac_certificate_url": file_path, # Save the *local path*
        "verification_status": ai_result["decision"].lower() # "verified" or "rejected"
    }
    
    updated_org = organizations_collection.find_one_and_update(
        {"_id": validate_object_id(org.id)}, # Using your teammate's validator
        {"$set": update_data},
        return_document=pymongo.ReturnDocument.AFTER
    )

    # --- 5. Clean up the uploaded file from Google AI ---
    try:
        genai.delete_file(uploaded_file.name)
        logger.info(f"Cleaned up {uploaded_file.name} from AI service.")
    except Exception as e:
        logger.error(f"Failed to delete {uploaded_file.name} from AI service: {e}")
        # Non-critical error, just log it

    if ai_result["decision"] == "REJECTED":
        logger.warning(f"🔥 VERIFICATION REJECTED for {org_name}: {ai_result['reason']}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"VERIFICATION REJECTED: {ai_result['reason']}"
        )
    
    logger.info(f"✅ VERIFICATION SUCCESSFUL for {org_name}.")
    return {"status": "verified", "reason": ai_result["reason"], "organization": Organization(**updated_org)}


@app.post("/api/v1/request-data", status_code=status.HTTP_202_ACCEPTED, tags=["Organization (SME-Femi)"])
async def request_data_access(body: DataRequestBody, org: Organization = Depends(get_current_org)):
    """
    This endpoint now has two checks:
    1. Is the Organization verified?
    2. Does the request pass AI data minimization?
    """
    
    # --- NEW SECURITY CHECK ---
    if org.verification_status != "verified":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="COMPLIANCE VIOLATION: Your organization is not verified. Please submit your profile for verification."
        )

    # (The rest of the function is the same, but calls the "Regulator" AI)
    user = users_collection.find_one({"username": body.user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{body.user_id}' not found.")

    if not org.policy_text:
         raise HTTPException(
            status_code=400,
            detail="COMPLIANCE VIOLATION: No privacy policy found. Please upload one before making requests."
        )

    logger.info(f"Checking data minimization for verified org {org.org_name}...")
    ai_result = await check_policy_compliance(
        policy_text=org.policy_text,
        data_type=body.data_type,
        purpose=body.purpose,
        company_category=org.company_category
    )

    if ai_result["decision"] == "VIOLATION":
        logger.warning(f"🔥 VIOLATION DETECTED: {ai_result['reason']}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"COMPLIANCE VIOLATION: {ai_result['reason']}"
        )

    logger.info(f"✅ AI Approved. Reason: {ai_result['reason']}. Logging pending request.")
    consent_request = {
        "user_id": body.user_id,
        "org_id": validate_object_id(org.id), # Using your teammate's validator
        "data_type": body.data_type,
        "purpose": body.purpose,
        "status": "pending",
        "timestamp": datetime.now(timezone.utc),
    }
    result = consent_log_collection.insert_one(consent_request)

    return {
        "message": "AI analysis passed. Consent request sent to user.",
        "status": "pending",
        "request_id": str(result.inserted_id),
        "ai_reason": ai_result["reason"]
    }

# --- This endpoint is still useful for uploading a new policy ---
@app.post("/api/v1/org/policy", response_model=Organization, tags=["Organization (SME-Femi)"])
async def update_org_policy(policy_body: OrgPolicyUpdate, org: Organization = Depends(get_current_org)):
    
    if org.verification_status != "verified":
         raise HTTPException(status_code=403, detail="You must verify your organization before uploading a policy.")

    updated_org = organizations_collection.find_one_and_update(
        {"_id": validate_object_id(org.id)}, # Using your teammate's validator
        {"$set": {"policy_text": policy_body.policy_text}},
        return_document=pymongo.ReturnDocument.AFTER,
    )
    if not updated_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return Organization(**updated_org)

@app.get("/api/v1/org/log", response_model=list[ConsentLog], tags=["Organization (SME-Femi)"])
async def get_org_compliance_log(org: Organization = Depends(get_current_org)):
    # (Fix applied here)
    logs = consent_log_collection.find({"org_id": validate_object_id(org.id)}).sort("timestamp", -1)
    return list(logs)

@app.get("/api/v1/org/me", response_model=Organization, tags=["Organization (SME-Femi)"])
async def get_org_details(org: Organization = Depends(get_current_org)):
    return org

# --- API Key Management Endpoints ---
@app.get("/api/v1/org/api-keys", response_model=list[ApiKey], tags=["Organization (SME-Femi)"])
async def get_api_keys(org: Organization = Depends(get_current_org)):
    keys = api_keys_collection.find({"org_id": validate_object_id(org.id)}).sort("created_date", -1)
    return list(keys)

@app.post("/api/v1/org/api-keys", response_model=ApiKey, status_code=status.HTTP_201_CREATED, tags=["Organization (SME-Femi)"])
async def create_api_key(body: ApiKeyCreate, org: Organization = Depends(get_current_org)):
    # Generate a secure API key
    api_key_value = secrets.token_urlsafe(32)
    
    key_doc = {
        "name": body.name,
        "key": api_key_value,
        "status": "active",
        "created_date": datetime.now(timezone.utc),
        "org_id": validate_object_id(org.id),
    }
    result = api_keys_collection.insert_one(key_doc)
    created_key = api_keys_collection.find_one({"_id": result.inserted_id})
    return ApiKey(**created_key)

@app.post("/api/v1/org/api-keys/{key_id}/revoke", status_code=status.HTTP_200_OK, tags=["Organization (SME-Femi)"])
async def revoke_api_key(key_id: str, org: Organization = Depends(get_current_org)):
    try:
        key_oid = validate_object_id(key_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid key_id format.")
    
    result = api_keys_collection.update_one(
        {"_id": key_oid, "org_id": validate_object_id(org.id)},
        {"$set": {"status": "revoked"}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="API key not found or does not belong to this organization.")
    return {"message": "API key revoked successfully."}


# --- Main execution ---
if __name__ == "__main__":
    print("Starting Trust-Grid API server at http://localhost:8000")
    # This command is correct for running from the parent directory
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)