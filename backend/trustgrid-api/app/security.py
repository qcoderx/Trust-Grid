# app/security.py
import secrets
import hashlib
from passlib.context import CryptContext

# Use the same password context as in your main.py
# If you changed it in main.py, change it here too
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_api_key(prefix: str = "tg_live", length: int = 16) -> str:
    """
    Generates a new, secure API key.
    Example: tg_live_aBcDeF123456...
    """
    random_part = secrets.token_urlsafe(length)
    # Keep it short to avoid bcrypt 72 byte limit
    full_key = f"{prefix}_{random_part}"
    # Ensure it's under 72 bytes
    if len(full_key.encode('utf-8')) > 72:
        full_key = full_key[:50]  # Conservative truncation
    return full_key

def get_api_key_hash(api_key: str) -> str:
    """
    Hashes the API key using SHA256 for now (bcrypt having issues).
    """
    return hashlib.sha256(api_key.encode()).hexdigest()

def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verifies a plain-text key against a stored hash using SHA256.
    Returns True if valid, False otherwise.
    """
    return hashlib.sha256(plain_key.encode()).hexdigest() == hashed_key
