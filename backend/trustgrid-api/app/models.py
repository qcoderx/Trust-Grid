from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal, Any
from bson import ObjectId
from datetime import datetime, timezone
from pydantic_core import core_schema

# --- PyObjectId Class ---
# This version fixes the `__get_pydantic_json_schema__` to return a
# raw dictionary, which resolves the `KeyError: 'type'`.

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        
        def validate_from_str(v: str) -> ObjectId:
            if ObjectId.is_valid(v):
                return ObjectId(v)
            raise ValueError("Invalid ObjectId")

        # This combination of snake_case helpers + CamelCase StringSchema()
        # is what your environment expects.
        python_schema = core_schema.union_schema(
            [
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema(
                    [
                        core_schema.StringSchema(), 
                        core_schema.no_info_plain_validator_function(validate_from_str),
                    ]
                ),
            ]
        )

        json_schema = core_schema.chain_schema(
            [
                core_schema.StringSchema(),
                core_schema.no_info_plain_validator_function(validate_from_str),
            ]
        )

        return core_schema.json_or_python_schema(
            json_schema=json_schema,
            python_schema=python_schema,
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
        """
        # THE FIX: Return the raw JSON schema dictionary directly.
        # This resolves the `KeyError: 'type'`.
        return {'type': 'string'}


# ---- User (Ayo) ----
class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str

    # FIX: Use model_config (Pydantic v2)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
        
class UserCreate(BaseModel):
    username: str
    password: str

# ---- Organization (SME-Femi) ----
class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    org_name: str
    policy_text: Optional[str] = ""
    api_key: str

    # FIX: Use model_config (Pydantic v2)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

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

    # FIX: Use model_config (Pydantic v2)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

# ---- API Request/Response Bodies ----
class DataRequestBody(BaseModel):
    user_id: str
    data_type: str
    purpose: str

class ConsentResponseBody(BaseModel):
    request_id: str
    decision: Literal["approved", "denied"]