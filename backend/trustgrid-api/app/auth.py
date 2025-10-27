from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
import pymongo
from .database import organizations_collection, settings
from .models import Organization
from bson import ObjectId
import logging

# Define the API key header we expect
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_current_org(api_key: str = Security(api_key_header)) -> Organization:
    """
    Dependency to validate API key and return the organization.
    This is what protects SME-Femi's endpoints.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API Key is missing"
        )
    
    if api_key == settings.FEMI_STATIC_API_KEY:
        # Find or create SME-Femi's demo org
        org_data = organizations_collection.find_one_and_update(
            {"api_key": settings.FEMI_STATIC_API_KEY},
            {
                # --- UPDATED TO CREATE AS UNVERIFIED ---
                "$setOnInsert": {
                    "org_name": "SME-Femi's Site (Unverified)",
                    "policy_text": None,
                    "api_key": settings.FEMI_STATIC_API_KEY,
                    "company_description": None,
                    "company_category": "Other",
                    "website_url": None,
                    "business_registration_number": None,
                    "cac_certificate_url": None,
                    "verification_status": "unverified" # <-- This is the key
                }
            },
            upsert=True,
            return_document=pymongo.ReturnDocument.AFTER
        )
        return Organization(**org_data)

    logging.warning(f"Invalid API key attempt: {api_key}")
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired API Key"
    )