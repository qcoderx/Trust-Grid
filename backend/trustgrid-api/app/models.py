from pydantic import BaseModel, Field
from typing import Optional, List
from bson import ObjectId
from datetime import datetime

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

def validate_object_id(v):
    if not ObjectId.is_valid(v):
        raise ValueError("Invalid ObjectId")
    return ObjectId(v)

class User(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    username: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class UserCreate(BaseModel):
    username: str

class Organization(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    org_name: str
    policy_text: Optional[str] = None
    api_key: str

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

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
    status: str
    timestamp: datetime

    class Config:
        validate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ConsentResponseBody(BaseModel):
    request_id: str
    decision: str  # "approved" or "denied"
