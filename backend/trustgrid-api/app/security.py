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
    Truncates to 72 bytes to avoid bcrypt limitations.
    """
    # Bcrypt has a 72-byte limit, truncate if necessary
    truncated_key = api_key.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(truncated_key)

def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verifies a plain-text key against a stored hash.
    Returns True if valid, False otherwise.
    """
<<<<<<< HEAD
    return hashlib.sha256(plain_key.encode()).hexdigest() == hashed_key

def hash_password(password: str) -> str:
    """
    Hash password using SHA256 with salt to avoid bcrypt issues.
    """
    # Use a simple salt + hash approach
    salt = "trustgrid_salt_2024"  # In production, use random salts per password
    return hashlib.sha256((salt + password).encode()).hexdigest()

def verify_password(password: str, hashed_password: str) -> bool:
    """
    Verify password against hash.
    """
    return hash_password(password) == hashed_password
=======
    try:
        # Truncate the key the same way as during hashing
        truncated_key = plain_key.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.verify(truncated_key, hashed_key)
    except Exception:
        # Catches errors like mismatch or invalid hash format
        return False
>>>>>>> a13335c1ff7bd5e88e8564a35b95894779beaa44
