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
class OrganizationRegistration(BaseModel):
    org_name: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

# Keep OrgCreate for backward compatibility
class OrgCreate(BaseModel):
    org_name: str
    
    class Config:
        extra = "forbid"  # Reject extra fields

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str
    # Personal Information
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    # Address Information
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = "Nigeria"
    postal_code: Optional[str] = None
    # Identity Documents
    bvn: Optional[str] = None
    nin: Optional[str] = None
    passport_number: Optional[str] = None
    drivers_license: Optional[str] = None
    voters_card: Optional[str] = None
    # Financial Information
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    # Employment Information
    occupation: Optional[str] = None
    employer: Optional[str] = None
    monthly_income: Optional[str] = None
    # Health Information
    blood_type: Optional[str] = None
    medical_conditions: Optional[str] = None
    emergency_contact: Optional[str] = None
    # Social Information
    marital_status: Optional[Literal["Single", "Married", "Divorced", "Widowed"]] = None
    education_level: Optional[str] = None
    social_media_handles: Optional[str] = None
    # Biometric Data
    fingerprint_data: Optional[str] = None
    facial_recognition_data: Optional[str] = None
    # Digital Footprint
    ip_address: Optional[str] = None
    device_id: Optional[str] = None
    browser_fingerprint: Optional[str] = None
    location_data: Optional[str] = None
    # Preferences
    language_preference: Optional[str] = "English"
    communication_preferences: Optional[str] = None
    manual_approval_required: Optional[bool] = False  # Auto-approve if False

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    username: str
    password: str

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[Literal["Male", "Female", "Other"]] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    bvn: Optional[str] = None
    nin: Optional[str] = None
    passport_number: Optional[str] = None
    drivers_license: Optional[str] = None
    voters_card: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    monthly_income: Optional[str] = None
    blood_type: Optional[str] = None
    medical_conditions: Optional[str] = None
    emergency_contact: Optional[str] = None
    marital_status: Optional[Literal["Single", "Married", "Divorced", "Widowed"]] = None
    education_level: Optional[str] = None
    social_media_handles: Optional[str] = None
    manual_approval_required: Optional[bool] = None

class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    org_name: str
    policy_text: Optional[str] = None
    data_types_collected: Optional[str] = None
    
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
    org_name: Optional[str] = None  # Store org name for display
    data_type: str
    purpose: str
    status: Literal["pending", "approved", "denied", "auto_approved"] 
    approval_method: Optional[Literal["manual", "auto"]] = None
    ai_reason: Optional[str] = None  # Store AI compliance reason
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

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