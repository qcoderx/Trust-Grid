# app/security.py
import secrets
import hashlib
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__) # Use the logger

# Ensure logger level is set appropriately (DEBUG is very verbose)
# If your main app sets logging level, this might inherit it
# logging.basicConfig(level=logging.DEBUG) # Uncomment for maximum detail if needed

# Use the same password context as in your main.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_api_key(prefix: str = "tg_live", length: int = 16) -> str:
    """
    Generates a new, secure API key.
    """
    random_part = secrets.token_urlsafe(length)
    return f"{prefix}_{random_part}"

def get_api_key_hash(api_key: str) -> str:
    """
    Hashes the API key using passlib.
    """
    return pwd_context.hash(api_key)

def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verifies a plain-text key against a stored hash.
    Returns True if valid, False otherwise.
    """
    try:
        return pwd_context.verify(plain_key, hashed_key)
    except Exception:
        # Catches errors like mismatch or invalid hash format
        return False