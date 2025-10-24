from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from .database import (
    users_collection, 
    organizations_collection, 
    consent_log_collection,
    db as check_db_connection
)
from .models import (
    User, UserCreate, Organization, OrgPolicyUpdate, 
    DataRequestBody, ConsentLog, ConsentResponseBody, PyObjectId
)
from .auth import get_current_org
from .ai_compliance import check_policy_compliance
from passlib.context import CryptContext
from datetime import datetime
from bson import ObjectId
import uvicorn
import logging

# --- App Setup ---
app = FastAPI(
    title="Trust-Grid API",
    description="GenAI-powered compliance protocol (v2.0).",
    version="2.0.0"
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# CORS middleware: Allow all for the hackathon
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing (good practice, though simplified for demo)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Health Check ---
@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    if check_db_connection is None:
        raise HTTPException(status_code=503, detail="Database not connected")
    try:
        check_db_connection.client.admin.command('ping')
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {e}")

# --- Component 1: Citizen App Endpoints (Ayo's App) ---

@app.post("/api/v1/citizen/register", response_model=User, status_code=status.HTTP_201_CREATED, tags=["Citizen (Ayo)"])
async def create_user(user: UserCreate):
    """
    Feature 1.1: Creates Ayo (The Citizen).
    This is a helper to set up the demo.
    """
    existing_user = users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # In a real app: hashed_password = pwd_context.hash(user.password)
    user_doc = {"username": user.username} # Simplified for demo
    
    result = users_collection.insert_one(user_doc)
    created_user = users_collection.find_one({"_id": result.inserted_id})
    return User(**created_user)

@app.get("/api/v1/citizen/{user_id}/requests", response_model=list[ConsentLog], tags=["Citizen (Ayo)"])
async def get_pending_requests(user_id: str):
    """
    Feature 1.2: Ayo's app polls this to show the "Consent Handshake" UI.
    """
    requests = consent_log_collection.find({
        "user_id": user_id,
        "status": "pending"
    }).sort("timestamp", -1)
    return list(requests)

@app.post("/api/v1/citizen/respond", status_code=status.HTTP_200_OK, tags=["Citizen (Ayo)"])
async def respond_to_request(body: ConsentResponseBody):
    """
    Feature 1.2: Ayo clicks "Approve" or "Deny" on his modal.
    """
    try:
        request_oid = ObjectId(body.request_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid request_id format.")

    result = consent_log_collection.update_one(
        {"_id": request_oid, "status": "pending"},
        {"$set": {"status": body.decision, "timestamp": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Request not found or already actioned.")
        
    return {"message": f"Consent status updated to '{body.decision}'."}

@app.get("/api/v1/citizen/{user_id}/log", response_model=list[ConsentLog], tags=["Citizen (Ayo)"])
async def get_citizen_transparency_log(user_id: str):
    """
    Feature 1.3: Ayo's "Transparency Log" dashboard.
    """
    logs = consent_log_collection.find({"user_id": user_id}).sort("timestamp", -1)
    return list(logs)


# --- Component 2 & 3: Org API Endpoints (SME-Femi's Backend) ---

@app.post("/api/v1/request-data", status_code=status.HTTP_202_ACCEPTED, tags=["Organization (SME-Femi)"])
async def request_data_access(
    body: DataRequestBody,
    org: Organization = Depends(get_current_org)
):
    """
    Feature 2.2 & 3.2: The "Brain" API Endpoint.
    This is THE WINNING FEATURE.
    The SDK/frontend just calls this.
    """
    # 1. Check if user "Ayo" exists
    user = users_collection.find_one({"username": body.user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{body.user_id}' not found.")
    
    # 2. Fetch Org Policy
    if not org.policy_text:
        raise HTTPException(
            status_code=400, 
            detail="COMPLIANCE VIOLATION: No privacy policy found. Please upload one."
        )

    # 3. Call "Gemini Mismatch" Logic
    logger.info(f"Checking compliance for {org.org_name}...")
    is_compliant = await check_policy_compliance(
        policy_text=org.policy_text,
        data_type=body.data_type,
        purpose=body.purpose
    )

    # 4. Enforce Decision
    if not is_compliant:
        # THE WOW MOMENT
        logger.warning(f"🔥 VIOLATION DETECTED for {org.org_name}!")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"COMPLIANCE VIOLATION: Your app request for '{body.data_type}' with purpose '{body.purpose}' contradicts your saved privacy policy."
        )
    
    # 5. If APPROVED, create the 'pending' request for Ayo
    logger.info(f"✅ AI Approved. Logging pending request for user {body.user_id}.")
    consent_request = {
        "user_id": body.user_id,
        "org_id": org.id,
        "data_type": body.data_type,
        "purpose": body.purpose,
        "status": "pending",
        "timestamp": datetime.utcnow()
    }
    
    result = consent_log_collection.insert_one(consent_request)
    
    return {
        "message": "AI analysis passed. Consent request sent to user.",
        "status": "pending",
        "request_id": str(result.inserted_id)
    }

@app.post("/api/v1/org/policy", response_model=Organization, tags=["Organization (SME-Femi)"])
async def update_org_policy(
    policy_body: OrgPolicyUpdate, 
    org: Organization = Depends(get_current_org)
):
    """
    Feature 3.1: SME-Femi updates his policy text.
    """
    updated_org = organizations_collection.find_one_and_update(
        {"_id": org.id},
        {"$set": {"policy_text": policy_body.policy_text}},
        return_document=pymongo.ReturnDocument.AFTER
    )
    if not updated_org:
        raise HTTPException(status_code=404, detail="Organization not found")
    return Organization(**updated_org)

@app.get("/api/v1/org/log", response_model=list[ConsentLog], tags=["Organization (SME-Femi)"])
async def get_org_compliance_log(org: Organization = Depends(get_current_org)):
    """
    Feature 2.3: SME-Femi's "Compliance Log" on his dashboard.
    """
    logs = consent_log_collection.find({"org_id": org.id}).sort("timestamp", -1)
    return list(logs)

@app.get("/api/v1/org/me", response_model=Organization, tags=["Organization (SME-Femi)"])
async def get_org_details(org: Organization = Depends(get_current_org)):
    """
    Helper endpoint for Femi's dashboard to pull his current details.
    """
    return org

# --- Main execution ---
if __name__ == "__main__":
    print("Starting Trust-Grid API server at http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)