# app/main.py
import sys
# Ensure the parent directory is in the path if running directly
# This might not be needed depending on how you run uvicorn
sys.path.append('..')
from fastapi import (
    FastAPI, HTTPException, Depends, status,
    UploadFile, File, Form
)
from fastapi.middleware.cors import CORSMiddleware
import pymongo
from app.database import (
    users_collection,
    organizations_collection,
    consent_log_collection,
    api_keys_collection, # <-- Make sure this is imported
    db as check_db_connection,
)
from app.models import (
    User, UserCreate, UserProfileUpdate,
    Organization, OrgPolicyUpdate,
    DataRequestBody, ConsentLog, ConsentResponseBody,
    ApiKey, ApiKeyCreate, ApiKeyResponse, # <-- Updated/New models
    PyObjectId, validate_object_id,
    OrgCreate, OrganizationRegistration, OrgRegistrationResponse # <-- New models for registration
)
from app.auth import get_current_org
from app.ai_compliance import (
    check_policy_compliance,
    verify_organization_identity
)
# --- NEW SECURITY IMPORTS ---
from app.security import (
    generate_api_key,
    get_api_key_hash,
    verify_api_key # Import verify_api_key (though auth.py uses it mainly)
)
from passlib.context import CryptContext
from datetime import datetime, timezone
from bson import ObjectId
import uvicorn
import logging
from typing import Literal, List
import google.generativeai as genai
import os
import shutil
# Removed secrets import as it's now in security.py

# --- App Setup ---
app = FastAPI(
    title="TrustGrid API",
    description="🛡️ Nigeria's AI-powered privacy compliance platform. Automated NDPR compliance for businesses and transparency for citizens.",
    version="5.0.0",
    contact={
        "name": "TrustGrid Technologies",
        "url": "https://trustgrid.ng",
        "email": "developers@trustgrid.ng"
    },
    license_info={
        "name": "TrustGrid Developer License",
        "url": "https://trustgrid.ng/license"
    }
)

# --- Logging, CORS, pwd_context, UPLOAD_DIRECTORY Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development/hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Use the same pwd_context as your security.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
UPLOAD_DIRECTORY = "uploads"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)


# --- Root Endpoint ---
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "🛡️ TrustGrid API - Nigeria's Privacy-First Compliance Platform",
        "version": "5.0.0",
        "status": "active",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "citizen_api": "/api/v1/citizen/*",
            "organization_api": "/api/v1/org/*",
            "data_requests": "/api/v1/request-data"
        },
        "description": "AI-powered NDPR compliance for Nigerian businesses and citizens"
    }

# --- Health Check ---
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    if check_db_connection is None:
        raise HTTPException(status_code=503, detail="Database not connected")
    try:
        # The ismaster command is cheap and does not require auth.
        check_db_connection.client.admin.command('ping')
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {e}")

# --- Component 0: NEW Org Registration ---
@app.post("/api/v1/org/register", response_model=OrgRegistrationResponse, tags=["Organization (SME-Femi)"])
async def register_organization(org_create: OrganizationRegistration):
    """
    Register a new organization and generate its first API key.
    The API key is returned ONCE upon registration. Store it securely.
    """
    logger.info(f"Registration request received for org: {org_create.org_name}")
    
    # Check if organization name already exists to avoid duplicates
    existing_org = organizations_collection.find_one({"org_name": org_create.org_name})
    if existing_org:
        logger.warning(f"Organization name '{org_create.org_name}' already exists - deleting for re-registration")
        # For development: delete existing org and its API keys
        organizations_collection.delete_one({"_id": existing_org["_id"]})
        api_keys_collection.delete_many({"org_id": existing_org["_id"]})
        logger.info(f"Deleted existing organization '{org_create.org_name}' for re-registration")

    # --- Create the Organization Document ---
    new_org_data = {
        "org_name": org_create.org_name,
        "verification_status": "unverified", # Start as unverified
        # Initialize other fields required by the Organization model
        "policy_text": None,
        "data_types_collected": None,
        "company_description": None,
        "company_category": "Other",
        "website_url": None,
        "business_registration_number": None,
        "cac_certificate_url": None,
    }
    org_result = organizations_collection.insert_one(new_org_data)
    created_org_doc = organizations_collection.find_one({"_id": org_result.inserted_id})

    # Error handling in case DB insertion fails unexpectedly
    if not created_org_doc:
         raise HTTPException(status_code=500, detail="Failed to create organization record after insertion.")
    org_id = created_org_doc["_id"] # Get the new org's MongoDB ObjectId

    # --- Generate and Store the First API Key ---
    new_api_key = generate_api_key() # Generate the plain text key
    api_key_hash = get_api_key_hash(new_api_key) # Hash the key for storage

    key_doc = {
        "name": "Default Key", # Give the first key a default name
        "key_hash": api_key_hash, # Store the HASH, not the plain key
        "status": "active", # Start as active
        "created_date": datetime.now(timezone.utc),
        "org_id": org_id, # Link the key to the newly created organization
    }
    api_keys_collection.insert_one(key_doc)

    # --- Return Org details AND the plain-text key ---
    # The response includes the full organization details and the plain API key
    return OrgRegistrationResponse(
        organization=Organization(**created_org_doc),
        api_key=new_api_key # This is the only time the plain key is sent
    )

# --- Component 1: Citizen App Endpoints (Ayo's App) ---
# (No changes needed for citizen endpoints based on dynamic keys)
@app.post("/api/v1/citizen/register", response_model=User, status_code=status.HTTP_201_CREATED, tags=["Citizen (Ayo)"])
async def create_user(user: UserCreate):
    logger.info(f"Citizen registration request for username: {user.username}")
    
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user: 
        logger.warning(f"Username '{user.username}' already exists - deleting for re-registration")
        # For development: delete existing user for re-registration
        users_collection.delete_one({"_id": existing_user["_id"]})
        logger.info(f"Deleted existing user '{user.username}' for re-registration")
    
    # Hash user password on creation (truncate to 72 bytes for bcrypt)
    password_truncated = user.password[:72] if len(user.password.encode()) > 72 else user.password
    user_doc = {"username": user.username, "password": pwd_context.hash(password_truncated)}
    result = users_collection.insert_one(user_doc)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    if not created_user: raise HTTPException(status_code=500, detail="Failed to retrieve created user.")
    return User(**created_user)

@app.post("/api/v1/citizen/login", tags=["Citizen (Ayo)"])
async def login_user(user: UserCreate):
    """
    Login endpoint for citizens.
    Returns user details if credentials are valid.
    """
    existing_user = users_collection.find_one({"username": user.username})
    if not existing_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Verify password using bcrypt (consistent with registration, truncate to 72 bytes)
    password_truncated = user.password[:72] if len(user.password.encode()) > 72 else user.password
    if not pwd_context.verify(password_truncated, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Return user details (excluding password)
    return User(**existing_user)

@app.get("/api/v1/citizen/{user_id}/requests", response_model=List[ConsentLog], tags=["Citizen (Ayo)"])
async def get_pending_requests(user_id: str):
    requests = consent_log_collection.find({"user_id": user_id, "status": "pending"}).sort("timestamp", -1)
    return list(requests)

@app.post("/api/v1/citizen/respond", status_code=status.HTTP_200_OK, tags=["Citizen (Ayo)"])
async def respond_to_request(body: ConsentResponseBody):
    try: request_oid = validate_object_id(body.request_id)
    except Exception: raise HTTPException(status_code=400, detail="Invalid request_id format.")
    
    # Get the request details before updating
    request_doc = consent_log_collection.find_one({"_id": request_oid, "status": "pending"})
    if not request_doc:
        raise HTTPException(status_code=404, detail="Request not found or already actioned.")
    
    # Update the request status
    result = consent_log_collection.update_one(
        {"_id": request_oid, "status": "pending"},
        {"$set": {"status": body.decision, "approval_method": "manual", "timestamp": datetime.now(timezone.utc)}},
    )
    
    response_data = {"message": f"Consent status updated to '{body.decision}'."}
    
    # If approved, include the requested data
    if body.decision == "approved":
        user = users_collection.find_one({"username": request_doc["user_id"]})
        if user:
            requested_data = user.get(request_doc["data_type"])
            response_data["data"] = requested_data
            logger.info(f"✅ Manual approval granted - returning {request_doc['data_type']} data for {request_doc['user_id']}")
    
    return response_data

@app.get("/api/v1/citizen/{user_id}/log", response_model=List[ConsentLog], tags=["Citizen (Ayo)"])
async def get_citizen_transparency_log(user_id: str):
    logs = consent_log_collection.find({"user_id": user_id}).sort("timestamp", -1)
    return list(logs)

@app.put("/api/v1/citizen/{user_id}/profile", response_model=User, tags=["Citizen (Ayo)"])
async def update_citizen_profile(user_id: str, profile_data: UserProfileUpdate):
    """Update citizen profile with comprehensive data"""
    logger.info(f"Profile update request for user: {user_id}")
    
    # Find user by username (user_id)
    existing_user = users_collection.find_one({"username": user_id})
    if not existing_user:
        logger.error(f"User '{user_id}' not found in database")
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found")
    
    # Update only provided fields
    update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
    logger.info(f"Updating user '{user_id}' with {len(update_data)} fields")
    
    if update_data:
        updated_user = users_collection.find_one_and_update(
            {"username": user_id},
            {"$set": update_data},
            return_document=pymongo.ReturnDocument.AFTER
        )
        logger.info(f"Successfully updated profile for user '{user_id}'")
        return User(**updated_user)
    
    logger.info(f"No updates needed for user '{user_id}'")
    return User(**existing_user)

@app.get("/api/v1/citizen/{user_id}/profile", response_model=User, tags=["Citizen (Ayo)"])
async def get_citizen_profile(user_id: str):
    """Get citizen profile data"""
    user = users_collection.find_one({"username": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# --- Component 2 & 3: Org API Endpoints (SME-Femi's Backend) ---
# (The authentication `Depends(get_current_org)` now works dynamically using app/auth.py)

@app.post("/api/v1/org/submit-for-verification", tags=["Organization (SME-Femi)"])
async def submit_for_verification(
    org_name: str = Form(...), 
    company_description: str = Form(...),
    company_category: Literal["Fintech", "E-commerce", "Social Media", "Dating", "Healthcare", "Gaming", "Other"] = Form(...),
    website_url: str = Form(...), 
    business_registration_number: str = Form(...),
    policy_text: str = Form(...),
    data_types_collected: str = Form(...),
    cac_certificate: UploadFile = File(...),
    org: Organization = Depends(get_current_org)
):
    """
    Submit organization details and CAC certificate for AI verification.
    """
    # Prevent re-verification
    if org.verification_status == "verified": raise HTTPException(status_code=400, detail="This organization is already verified.")

    # --- File Handling ---
    file_path = os.path.join(UPLOAD_DIRECTORY, f"{org.id}_{cac_certificate.filename}")
    uploaded_file = None # Initialize variable for Gemini file handle
    try:
        # Save the file locally first
        with open(file_path, "wb+") as file_object: shutil.copyfileobj(cac_certificate.file, file_object)
    except Exception as e:
        logger.error(f"Failed to save certificate file locally: {e}")
        raise HTTPException(status_code=500, detail="Failed to save certificate file.")
    finally:
        await cac_certificate.close() # Ensure file is closed

    try:
        # --- Upload file to Google AI for analysis ---
        logger.info(f"Uploading {file_path} to Gemini for verification...")
        uploaded_file = genai.upload_file(path=file_path, display_name=f"{org_name} CAC Cert")
        logger.info(f"File uploaded successfully to Gemini: {uploaded_file.name}")

        # --- Call the AI Verifier ---
        logger.info(f"Submitting {org_name} details for AI verification...")
        ai_result = await verify_organization_identity(
            org_name=org_name,
            business_registration_number=business_registration_number,
            cac_certificate_file=uploaded_file # Pass the Gemini file object
        )
    except Exception as e:
         # Broad exception catch during AI processing
         logger.error(f"Error during AI verification process: {e}")
         ai_result = {"decision": "REJECTED", "reason": f"Internal error during AI verification: {e}"}
    finally:
        # --- Clean up the uploaded file from Google AI ---
        if uploaded_file:
            try:
                genai.delete_file(uploaded_file.name)
                logger.info(f"Cleaned up Gemini file: {uploaded_file.name}")
            except Exception as e:
                # Log error but don't fail the request if cleanup fails
                logger.error(f"Failed to delete Gemini file {uploaded_file.name}: {e}")

    # --- Update Org in DB based on AI decision ---
    update_data = {
        "org_name": org_name, # Allow org name update during verification
        "company_description": company_description,
        "company_category": company_category,
        "website_url": website_url,
        "business_registration_number": business_registration_number,
        "policy_text": policy_text, # Store the privacy policy
        "data_types_collected": data_types_collected, # Store data collection info
        "cac_certificate_url": file_path, # Store the local path
        "verification_status": ai_result["decision"].lower() # "verified" or "rejected"
    }
    updated_org_doc = organizations_collection.find_one_and_update(
        {"_id": validate_object_id(org.id)}, # Use teammate's validator
        {"$set": update_data},
        return_document=pymongo.ReturnDocument.AFTER
    )

    # Handle verification failure
    if ai_result["decision"] == "REJECTED":
        logger.warning(f"🔥 VERIFICATION REJECTED for {org_name}: {ai_result['reason']}")
        # Don't delete the local file on rejection, they might need to see it/retry
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"VERIFICATION REJECTED: {ai_result['reason']}"
        )

    # Handle success
    logger.info(f"✅ VERIFICATION SUCCESSFUL for {org_name}.")
    if not updated_org_doc: # Should not happen after successful update
         raise HTTPException(status_code=500, detail="Failed to retrieve updated organization details.")
    return {"status": "verified", "reason": ai_result["reason"], "organization": Organization(**updated_org_doc)}


@app.post("/api/v1/request-data", status_code=status.HTTP_202_ACCEPTED, tags=["Organization (SME-Femi)"])
async def request_data_access(body: DataRequestBody, org: Organization = Depends(get_current_org)):
    if org.verification_status != "verified": 
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="COMPLIANCE VIOLATION: Your organization is not verified.")
    
    user = users_collection.find_one({"username": body.user_id})
    if not user: 
        raise HTTPException(status_code=404, detail=f"User '{body.user_id}' not found.")
    
    if not org.policy_text: 
        raise HTTPException(status_code=400, detail="COMPLIANCE VIOLATION: No privacy policy found.")
    
    logger.info(f"Checking data minimization for verified org {org.org_name}...")
    ai_result = await check_policy_compliance(
        policy_text=org.policy_text, 
        data_type=body.data_type, 
        purpose=body.purpose, 
        company_category=org.company_category
    )
    
    if ai_result["decision"] == "VIOLATION":
        logger.warning(f"🔥 VIOLATION DETECTED: {ai_result['reason']}")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"COMPLIANCE VIOLATION: {ai_result['reason']}")
    
    # Check if user requires manual approval (default is auto-approval)
    requires_manual_approval = user.get('manual_approval_required', False)
    logger.info(f"🔍 DEBUG: User {body.user_id} manual_approval_required = {user.get('manual_approval_required')} (type: {type(user.get('manual_approval_required'))})")
    logger.info(f"🔍 DEBUG: requires_manual_approval = {requires_manual_approval}")
    
    if requires_manual_approval:
        # Create pending request for manual approval
        logger.info(f"✅ AI Approved but user requires manual approval. Creating pending request.")
        consent_request = {
            "user_id": body.user_id, 
            "org_id": validate_object_id(org.id),
            "org_name": org.org_name,
            "data_type": body.data_type, 
            "purpose": body.purpose, 
            "status": "pending",
            "approval_method": "manual",
            "ai_reason": ai_result["reason"],
            "timestamp": datetime.now(timezone.utc)
        }
        result = consent_log_collection.insert_one(consent_request)
        return {
            "message": "AI analysis passed. Awaiting user approval.", 
            "status": "pending", 
            "request_id": str(result.inserted_id), 
            "ai_reason": ai_result["reason"]
        }
    else:
        # Auto-approve since AI passed and user allows it
        logger.info(f"✅ AI Approved and auto-approving for user {body.user_id}")
        consent_request = {
            "user_id": body.user_id, 
            "org_id": validate_object_id(org.id),
            "org_name": org.org_name,
            "data_type": body.data_type, 
            "purpose": body.purpose, 
            "status": "auto_approved",
            "approval_method": "auto",
            "ai_reason": ai_result["reason"],
            "timestamp": datetime.now(timezone.utc)
        }
        result = consent_log_collection.insert_one(consent_request)
        
        # Return the actual data if available
        requested_data = user.get(body.data_type)
        return {
            "message": "Request auto-approved.", 
            "status": "auto_approved", 
            "request_id": str(result.inserted_id),
            "ai_reason": ai_result["reason"],
            "data": requested_data
        }

@app.post("/api/v1/org/policy", response_model=Organization, tags=["Organization (SME-Femi)"])
async def update_org_policy(policy_body: OrgPolicyUpdate, org: Organization = Depends(get_current_org)):
    # (No logic changes needed inside this function)
    if org.verification_status != "verified": raise HTTPException(status_code=403, detail="You must verify your organization before uploading a policy.")
    updated_org = organizations_collection.find_one_and_update({"_id": validate_object_id(org.id)}, {"$set": {"policy_text": policy_body.policy_text}}, return_document=pymongo.ReturnDocument.AFTER,)
    if not updated_org: raise HTTPException(status_code=404, detail="Organization not found")
    return Organization(**updated_org)

@app.get("/api/v1/org/log", response_model=List[ConsentLog], tags=["Organization (SME-Femi)"])
async def get_org_compliance_log(org: Organization = Depends(get_current_org)):
    logs = consent_log_collection.find({"org_id": validate_object_id(org.id)}).sort("timestamp", -1)
    return list(logs)

@app.get("/api/v1/request-status/{request_id}", tags=["Organization (SME-Femi)"])
async def check_request_status(request_id: str, org: Organization = Depends(get_current_org)):
    """Check status of a data request and get data if approved"""
    logger.info(f"🔍 Checking status for request {request_id} by org {org.org_name} (ID: {org.id})")
    
    try:
        request_oid = validate_object_id(request_id)
        logger.info(f"✅ Valid ObjectId: {request_oid}")
    except Exception as e:
        logger.error(f"❌ Invalid request_id format: {e}")
        raise HTTPException(status_code=400, detail="Invalid request_id format.")
    
    # First try to find by request ID only for debugging
    request_doc = consent_log_collection.find_one({"_id": request_oid})
    
    if not request_doc:
        logger.error(f"❌ Request {request_id} not found in database at all")
        raise HTTPException(status_code=404, detail="Request not found.")
    
    logger.info(f"📋 Found request: org_id={request_doc.get('org_id')}, status={request_doc.get('status')}")
    
    # Check if request belongs to this organization
    expected_org_id = validate_object_id(org.id)
    actual_org_id = request_doc.get('org_id')
    
    if actual_org_id != expected_org_id:
        logger.warning(f"🚫 Request belongs to different org. Expected: {expected_org_id}, Found: {actual_org_id}")
        raise HTTPException(status_code=403, detail="Request belongs to different organization.")
    
    response = {
        "request_id": request_id,
        "status": request_doc["status"],
        "user_id": request_doc["user_id"],
        "data_type": request_doc["data_type"],
        "purpose": request_doc["purpose"],
        "timestamp": request_doc["timestamp"]
    }
    
    # If approved, include the data
    if request_doc["status"] in ["approved", "auto_approved"]:
        user = users_collection.find_one({"username": request_doc["user_id"]})
        if user:
            response["data"] = user.get(request_doc["data_type"])
            response["message"] = "Data access granted"
            logger.info(f"✅ Returning data for approved request")
    elif request_doc["status"] == "denied":
        response["message"] = "Access denied by user"
    else:
        response["message"] = "Awaiting user approval"
    
    return response

@app.post("/api/v1/org/login", response_model=Organization, tags=["Organization (SME-Femi)"])
async def login_org(api_key: str = Form(...)):
    """
    Login endpoint for organizations using their API key.
    Returns organization details if the API key is valid.
    """
    # Manually verify the API key (similar to get_current_org dependency)
    if not api_key:
        raise HTTPException(status_code=401, detail="API Key is missing")

    # Check against active keys
    all_api_keys = api_keys_collection.find({"status": "active"})
    matched_key_doc = None
    for key_doc in all_api_keys:
        hashed_key = key_doc.get("key_hash")
        if hashed_key and verify_api_key(api_key, hashed_key):
            matched_key_doc = key_doc
            break

    if not matched_key_doc:
        raise HTTPException(status_code=401, detail="Invalid or expired API Key")

    # Get the associated organization
    org_id = matched_key_doc.get("org_id")
    if not org_id:
        raise HTTPException(status_code=500, detail="Internal server error: API key not linked to organization")

    org_data = organizations_collection.find_one({"_id": org_id})
    if not org_data:
        raise HTTPException(status_code=500, detail="Internal server error: Organization not found")

    return Organization(**org_data)

@app.get("/api/v1/org/me", response_model=Organization, tags=["Organization (SME-Femi)"])
async def get_org_details(org: Organization = Depends(get_current_org)):
    return org

# --- UPDATED API Key Management Endpoints ---
@app.get("/api/v1/org/api-keys", response_model=List[ApiKey], tags=["Organization (SME-Femi)"])
async def get_api_keys(org: Organization = Depends(get_current_org)):
    """Retrieve all API keys associated with the authenticated organization."""
    keys = api_keys_collection.find({"org_id": validate_object_id(org.id)}).sort("created_date", -1)
    return list(keys)

@app.post("/api/v1/org/api-keys", response_model=ApiKeyResponse, status_code=status.HTTP_201_CREATED, tags=["Organization (SME-Femi)"])
async def create_api_key(body: ApiKeyCreate, org: Organization = Depends(get_current_org)):
    """
    Creates a new API key for the authenticated organization.
    The plain text key is returned ONCE. Store it securely.
    """
    new_api_key = generate_api_key() # Generate plain text key
    api_key_hash = get_api_key_hash(new_api_key) # Hash it for storage

    key_doc = {
        "name": body.name,
        "key_hash": api_key_hash, # <-- Store the HASH
        "status": "active",
        "created_date": datetime.now(timezone.utc),
        "org_id": validate_object_id(org.id), # Link to current org
    }
    result = api_keys_collection.insert_one(key_doc)
    created_key_doc = api_keys_collection.find_one({"_id": result.inserted_id})
    if not created_key_doc:
        raise HTTPException(status_code=500, detail="Failed to create and retrieve API key.")

    # Return the key details (including hash) AND the plain text key
    return ApiKeyResponse(
        key_details=ApiKey(**created_key_doc),
        api_key=new_api_key # <-- Return plain key ONCE
    )

@app.post("/api/v1/org/api-keys/{key_id}/revoke", status_code=status.HTTP_200_OK, tags=["Organization (SME-Femi)"])
async def revoke_api_key(key_id: str, org: Organization = Depends(get_current_org)):
    """Revoke an existing API key by its ID."""
    try: key_oid = validate_object_id(key_id) # Use teammate's validator
    except Exception: raise HTTPException(status_code=400, detail="Invalid key_id format.")
    
    result = api_keys_collection.update_one(
        {"_id": key_oid, "org_id": validate_object_id(org.id)}, # Ensure key belongs to this org
        {"$set": {"status": "revoked"}}
    )
    # Check if the key was found and belonged to the org before updating
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="API key not found or does not belong to this organization.")
    
    # Check if the document was actually modified (it might already be revoked)
    if result.modified_count == 0:
        # Optionally return a different message or status if already revoked
        return {"message": "API key was already revoked."}
        
    return {"message": "API key revoked successfully."}

# --- Main execution ---
if __name__ == "__main__":
    print("Starting Trust-Grid API server at http://localhost:8000")
    # Run from the directory containing the 'app' folder
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)