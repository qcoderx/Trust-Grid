# app/security.py
import secrets
from passlib.context import CryptContext

# Use the same password context as in your main.py
# If you changed it in main.py, change it here too
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def generate_api_key(prefix: str = "tg_live", length: int = 32) -> str:
    """
    Generates a new, secure API key.
    Example: tg_live_aBcDeF123456...
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