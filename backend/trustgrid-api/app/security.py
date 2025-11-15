# app/security.py
import secrets
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__) # Use the logger

# Ensure logger level is set appropriately (DEBUG is very verbose)
# If your main app sets logging level, this might inherit it
# logging.basicConfig(level=logging.DEBUG) # Uncomment for maximum detail if needed

# Use the same password context as in your main.py
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# bcrypt's maximum input length (in bytes)
BCRYPT_MAX_BYTES = 72

def generate_api_key(prefix: str = "tg_live", length: int = 48) -> str:
    """
    Generates a new, secure API key.
    """
    random_part = secrets.token_urlsafe(length)
    key = f"{prefix}_{random_part}"
    # Use logger.debug for less critical info
    logger.debug(f"Generated API Key (length {len(key)}): {key[:10]}...")
    return key

def get_api_key_hash(api_key: str) -> str:
    """
    Hashes the API key using passlib (bcrypt).
    Truncates the input key *bytes* if necessary to meet bcrypt's 72-byte limit.
    """
    try:
        api_key_bytes = api_key.encode('utf-8')
        original_length = len(api_key_bytes)
        logger.debug(f"Hashing key. Original string: '{api_key[:10]}...', Original bytes length: {original_length}")

        if original_length > BCRYPT_MAX_BYTES:
            truncated_key_bytes = api_key_bytes[:BCRYPT_MAX_BYTES]
            truncated_length = len(truncated_key_bytes)
            logger.warning(f"API key bytes truncated from {original_length} to {truncated_length} for bcrypt hashing.")
        else:
            truncated_key_bytes = api_key_bytes
            truncated_length = len(truncated_key_bytes)
            logger.debug(f"API key bytes length ({truncated_length}) within bcrypt limit.")

        # --- VERY EXPLICIT LOGGING BEFORE HASHING ---
        logger.info(f"Attempting pwd_context.hash() with input:")
        logger.info(f"  - Type: {type(truncated_key_bytes)}")
        logger.info(f"  - Length (bytes): {len(truncated_key_bytes)}")
        # Log the representation to see if it's really bytes
        logger.info(f"  - Value (repr): {repr(truncated_key_bytes)}")
        # --- END OF EXPLICIT LOGGING ---

        hashed_value = pwd_context.hash(truncated_key_bytes) # Hash the potentially truncated bytes
        logger.debug("Hashing successful.")
        return hashed_value

    except ValueError as ve: # Catch the specific error
        logger.error(f"ValueError during hashing: {ve}", exc_info=True)
        # Add context about the input that caused the error
        logger.error(f"Hashing failed for input (bytes, length {len(truncated_key_bytes)}): {repr(truncated_key_bytes)}")
        raise ValueError(f"Failed to hash API key: {ve}") # Re-raise the original error
    except Exception as e:
        logger.error(f"Unexpected error during API key hashing: {e}", exc_info=True)
        raise ValueError(f"Unexpected error hashing API key: {e}")


def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """
    Verifies a plain-text key against a stored hash.
    Truncates the plain key *bytes* the same way before verification.
    """
    try:
        plain_key_bytes = plain_key.encode('utf-8')
        original_length = len(plain_key_bytes)
        logger.debug(f"Verifying key. Plain bytes length: {original_length}")

        if original_length > BCRYPT_MAX_BYTES:
            truncated_plain_key_bytes = plain_key_bytes[:BCRYPT_MAX_BYTES]
            truncated_length = len(truncated_plain_key_bytes)
            logger.debug(f"Plain key bytes truncated to {truncated_length} for verification.")
        else:
            truncated_plain_key_bytes = plain_key_bytes
            truncated_length = len(truncated_plain_key_bytes) # Get length even if not truncated
            logger.debug(f"Plain key bytes length ({truncated_length}) within limit.")

        # --- EXPLICIT LOGGING BEFORE VERIFYING ---
        logger.info(f"Attempting pwd_context.verify() with input:")
        logger.info(f"  - Plain Key Type: {type(truncated_plain_key_bytes)}")
        logger.info(f"  - Plain Key Length (bytes): {len(truncated_plain_key_bytes)}")
        logger.info(f"  - Plain Key Value (repr): {repr(truncated_plain_key_bytes)}")
        logger.info(f"  - Hashed Key Type: {type(hashed_key)}")
        # --- END OF EXPLICIT LOGGING ---

        is_valid = pwd_context.verify(truncated_plain_key_bytes, hashed_key) # Verify the potentially truncated bytes
        logger.debug(f"Verification result: {is_valid}")
        return is_valid
    except Exception as e:
        logger.error(f"Error during API key verification: {e}", exc_info=True)
        return False