from pydantic import BaseModel, Field
from typing import Optional, Literal, Any
from bson import ObjectId
from datetime import datetime, timezone
from pydantic_core import core_schema

# --- NEW PyObjectId Class (Official Pydantic v2 Spec) ---
# This is the officially documented way to handle bson.ObjectId
# This replaces all previous attempts and will resolve the startup errors.

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        """
        Defines the Pydantic v2 core schema for this type.
        """
        
        # This is the function that will be used to validate strings
        def validate_from_str(v: str) -> ObjectId:
            if ObjectId.is_valid(v):
                return ObjectId(v)
            raise ValueError("Invalid ObjectId")

        # This schema defines how to validate from Python
        # It allows an instance of ObjectId OR a string that passes validation
        python_schema = core_schema.union_schema(
            [
                # Schema 1: Allow instances of ObjectId directly
                core_schema.is_instance_schema(ObjectId),
                
                # Schema 2: Allow strings, and run them through our validator
                core_schema.chain_schema(
                    [
                        core_schema.string_schema(),
                        core_schema.no_info_plain_validator_function(validate_from_str),
                    ]
                ),
            ]
        )

        # This schema defines how to validate from JSON (which is always a string)
        json_schema = core_schema.chain_schema(
            [
                core_schema.string_schema(),
                core_schema.no_info_plain_validator_function(validate_from_str),
            ]
        )

        return core_schema.json_or_python_schema(
            json_schema=json_schema,
            python_schema=python_schema,
            # This defines how to serialize the type (to a string)
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def __get_pydantic_json_schema__(
        cls, core_schema: core_schema.CoreSchema, handler: Any
    ) -> dict[str, Any]:
        """
        Defines the JSON schema (for OpenAPI docs).
        We just tell OpenAPI it's a string.
        """
        # Use the handler to get the default schema for a simple string
        return handler(core_schema.string_schema())


# ---- User (Ayo) ----
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        
class UserCreate(BaseModel):
    username: str
    password: str

# ---- Organization (SME-Femi) ----
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    org_name: str
    policy_text: Optional[str] = ""
    api_key: str

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class OrgPolicyUpdate(BaseModel):
    policy_text: str

# ---- Consent Log (The Ledger) ----
class ConsentLog(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    org_id: PyObjectId
    data_type: str
    purpose: str
    status: Literal["pending", "approved", "denied"]
    
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str, datetime: lambda v: v.isoformat()}

# ---- API Request/Response Bodies ----
class DataRequestBody(BaseModel):
    user_id: str
    data_type: str
    purpose: str

class ConsentResponseBody(BaseModel):
    request_id: str
    decision: Literal["approved", "denied"]