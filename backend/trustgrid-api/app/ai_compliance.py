import google.generativeai as genai
from .database import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the Gemini client
try:
    genai.configure(api_key=settings.GEMINI_API_KEY)
    # Using gemini-1.5-flash: it's fast, cheap, and perfect for this task.
    model = genai.GenerativeModel('gemini-1.5-flash')
    logger.info("✅ Gemini AI Model configured successfully.")
except Exception as e:
    logger.error(f"🔥 Failed to configure Gemini AI: {e}. Check GEMINI_API_KEY.")
    model = None

async def check_policy_compliance(policy_text: str, data_type: str, purpose: str) -> bool:
    """
    Calls the Gemini API to check if a data request complies with a policy.
    Returns True for 'APPROVED', False for 'VIOLATION'.
    """
    if not model:
        logger.error("Gemini model is not initialized. Failing closed.")
        # Fail closed: If AI fails, block the request.
        return False

    prompt = f"""
    You are a strict Nigerian Data Protection Regulation (NDPR) compliance bot.
    Analyze the following Privacy Policy and the Data Request.

    PRIVACY POLICY:
    "{policy_text}"

    DATA REQUEST:
    - Data: "{data_type}"
    - Stated Purpose: "{purpose}"

    Respond with a single word: 'APPROVED' or 'VIOLATION'.

    Return 'VIOLATION' if:
    1. The policy does NOT clearly state that "{data_type}" is collected.
    2. The stated purpose "{purpose}" is NOT consistent with the purposes described in the policy.
    3. The policy is empty or nonsensical.

    Otherwise, return 'APPROVED'.
    """

    try:
        # Using async generation for FastAPI
        response = await model.generate_content_async(prompt)
        decision = response.text.strip().upper()

        logger.info(f"Gemini Decision: {decision} for Data: '{data_type}', Purpose: '{purpose}'")
        
        if decision == "APPROVED":
            return True
        else:
            return False # Covers "VIOLATION" and any other unexpected response
            
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        # Fail closed: If AI call fails, block the request.
        return False