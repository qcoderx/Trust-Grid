# app/models.py
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from bson import ObjectId
from datetime import datetime, timezone

# --- Your Teammate's Working Code (UNCHANGED) ---
class PyObjectId(str):
    @classmethod
    def __get_pydantic_validator__(cls, _core_config, _handler):
        def validate(v):
            if isinstance(v, ObjectId):
                return cls(str(v))
            if isinstance(v, str):
                return cls(v)
            raise ValueError("Invalid objectid")
        return validate

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

    def __new__(cls, value):
        if isinstance(value, ObjectId):
            return str.__new__(cls, str(value))
        return str.__new__(cls, value)

    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_plain_validator_function(cls.__validate__)

    @classmethod
    def __validate__(cls, v):
        if isinstance(v, ObjectId):
            return cls(str(v))
        if isinstance(v, str):
            return cls(v)
        raise ValueError("Invalid objectid")

def validate_object_id(v):
    if not ObjectId.is_valid(v):
        raise ValueError("Invalid ObjectId")
    return ObjectId(v)
# --- End of Teammate's Code ---

# --- NEW: Model for Org Registration (Input) ---
class OrgCreate(BaseModel):
    org_name: str
    password: str

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    username: str
    password: str # This was in your main.py but missing here

class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    org_name: str
    password_hash: Optional[str] = None
    policy_text: Optional[str] = None
    # --- api_key REMOVED ---
    
    # Verification fields
    company_description: Optional[str] = None
    company_category: Optional[Literal[
        "Fintech", "E-commerce", "Social Media", "Dating", "Healthcare", "Gaming", "Other"
    ]] = "Other"
    website_url: Optional[str] = None
    business_registration_number: Optional[str] = None
    cac_certificate_url: Optional[str] = None # Path to the saved file
    verification_status: Literal["unverified", "pending", "verified", "rejected"] = "unverified"

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# --- NEW: Model for Org Registration (Response) ---
class OrgRegistrationResponse(BaseModel):
    organization: Organization
    api_key: str # The new, unhashed key (shown once)

class OrgPolicyUpdate(BaseModel):
    policy_text: str

class DataRequestBody(BaseModel):
    user_id: str
    data_type: str
    purpose: str

class ConsentLog(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    org_id: PyObjectId
    data_type: str
    purpose: str
    status: Literal["pending", "approved", "denied"] 
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) # Modernized

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ConsentResponseBody(BaseModel):
    request_id: str
    decision: Literal["approved", "denied"]

# --- UPDATED ApiKey Model ---
class ApiKey(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    key_hash: str # <-- Store the hash, not the key
    status: Literal["active", "revoked"] # Use Literal for status
    created_date: datetime
    org_id: PyObjectId

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ApiKeyCreate(BaseModel):
    name: str

# --- NEW: Model for API Key Response (shows key once) ---
class ApiKeyResponse(BaseModel):
    key_details: ApiKey # Contains the ID, hash, etc.
    api_key: str       # The plain text key (shown once)

class OrgLogin(BaseModel):
    org_name: str
    password: str