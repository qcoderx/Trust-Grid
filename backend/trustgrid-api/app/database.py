# app/database.py
import pymongo
from pydantic_settings import BaseSettings
from pydantic import BaseModel
from typing import Optional
import os

# Use Pydantic's BaseSettings to load from .env
class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str
    GEMINI_API_KEY: str

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
        env_file_encoding = 'utf-8'

try:
    settings = Settings()
except Exception as e:
    print(f"🔥 Error loading settings. Make sure .env file exists in trustgrid-api/ root. Error: {e}")
    exit(1)

# Setup MongoDB connection
try:
    # Make sure dnspython is installed: pip install dnspython
    client = pymongo.MongoClient(settings.MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ MongoDB connection successful.")
    
    db = client[settings.DB_NAME]
    
    users_collection = db["users"]
    organizations_collection = db["organizations"]
    consent_log_collection = db["consent_log"]
    # koded added this collection, dope shii
    api_keys_collection = db["api_keys"] 

except Exception as e:
    print(f"🔥 MongoDB connection failed. Check MONGO_URI or network. Error: {e}")
    exit(1) # Fail fast if DB connection fails