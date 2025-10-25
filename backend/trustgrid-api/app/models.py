from __future__ import annotations # Good practice for modern type hints
from pydantic import (
    BaseModel, Field, ConfigDict, BeforeValidator
)
# Import the new tools for serialization and schema
from pydantic.functional_serializers import PlainSerializer
from pydantic.json_schema import WithJsonSchema
from typing import Optional, Literal, Any, Annotated
from bson import ObjectId
from datetime import datetime, timezone

# --- Pydantic v2 ObjectId Handling ---
# This is the modern, official way. It's simpler and avoids the custom class.
# We define a validator function that Pydantic will use.

def validate_object_id(v: Any) -> ObjectId:
    """Validate a BSON ObjectId."""
    if isinstance(v, ObjectId):
        return v
    if ObjectId.is_valid(v):
        return ObjectId(v)
    raise ValueError("Invalid ObjectId")

# We enhance PyObjectId to handle validation, serialization, and JSON schema
# This makes it a complete, self-contained type.
PyObjectId = Annotated[
    ObjectId,
    # 1. Validation (Input): Use the validator function
    BeforeValidator(validate_object_id),
    
    # 2. Serialization (Output): Tell Pydantic to just call str() on it
    PlainSerializer(lambda x: str(x)),
    
    # 3. JSON Schema (OpenAPI): Describe it as a string with "objectid" format
    WithJsonSchema({'type': 'string', 'format': 'objectid'}),
]

# --- User (Ayo) ----
class User(BaseModel):
    # We can now use PyObjectId just like a normal type
    id: PyObjectId = Field(default_factory=lambda: ObjectId(), alias="_id")
    username: str
    
    # We can remove arbitrary_types_allowed and json_encoders
    # because PyObjectId now handles all of it.
    model_config = ConfigDict(
        populate_by_name=True,
    )
        
class UserCreate(BaseModel):
    username: str
    password: str

# ---- Organization (SME-Femi) ----
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: ObjectId(), alias="_id")
    org_name: str
    policy_text: Optional[str] = ""
    api_key: str

    # Removed redundant config
    model_config = ConfigDict(
        populate_by_name=True,
    )

class OrgPolicyUpdate(BaseModel):
    policy_text: str

# ---- Consent Log (The Ledger) ----
class ConsentLog(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: ObjectId(), alias="_id")
    user_id: str
    org_id: PyObjectId  # This will also use the validation
    data_type: str
    purpose: str
    status: Literal["pending", "approved", "denied"]
    
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    # Pydantic v2 automatically serializes datetime to ISO format,
    # and our PyObjectId type handles ObjectId serialization.
    model_config = ConfigDict(
        populate_by_name=True,
    )

# ---- API Request/Response Bodies ----
# (These were already correct as they don't use ObjectId)

class DataRequestBody(BaseModel):
    user_id: str
    data_type: str
    purpose: str

class ConsentResponseBody(BaseModel):
    request_id: str
    decision: Literal["approved", "denied"]

