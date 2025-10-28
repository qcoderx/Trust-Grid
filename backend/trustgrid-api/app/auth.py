# app/auth.py
from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
import pymongo
from .database import api_keys_collection, organizations_collection # <-- Use api_keys_collection
from .models import Organization, ApiKey # Import ApiKey
from .security import verify_api_key # <-- Import our new function
from .models import validate_object_id # Import koded's validator
from bson import ObjectId
import logging

# Define the API key header we expect
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_current_org(api_key: str = Security(api_key_header)) -> Organization:
    """
    Dependency to validate a dynamic API key.
    Checks the provided key against hashed keys in the DB and returns the associated org.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key is missing"
        )
    
    # --- DYNAMIC KEY CHECK ---
    # 1. Iterate through all API keys in the database
    # Note: In a production system with many keys, you'd optimize this,
    # perhaps by storing a key prefix and only querying potential matches.
    all_api_keys = api_keys_collection.find({"status": "active"}) # Only check active keys
    
    matched_key_doc = None
    for key_doc in all_api_keys:
        hashed_key = key_doc.get("key_hash")
        if hashed_key and verify_api_key(api_key, hashed_key):
            # Found a valid, matching key!
            matched_key_doc = key_doc
            break # Stop searching
            
    # 2. If a matching key was found, get the associated organization
    if matched_key_doc:
        org_id = matched_key_doc.get("org_id")
        if org_id:
            org_data = organizations_collection.find_one({"_id": org_id})
            if org_data:
                # Return the Pydantic Organization model
                return Organization(**org_data)
            else:
                # This should not happen if data integrity is maintained
                logging.error(f"API Key {matched_key_doc['_id']} linked to non-existent org {org_id}")
                raise HTTPException(status_code=500, detail="Internal server error: Organization not found for valid key.")
        else:
             logging.error(f"API Key {matched_key_doc['_id']} has no associated org_id")
             raise HTTPException(status_code=500, detail="Internal server error: API key is not linked to an organization.")

    # 3. If no match is found after checking all active keys
    logging.warning(f"Invalid API key attempt (no match found or key inactive).")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired API Key"
    )