# app/ai_compliance.py
import google.generativeai as genai
from app.database import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure the Gemini client
model = None
try:
    if not getattr(settings, "GEMINI_API_KEY", None):
        raise ValueError("GEMINI_API_KEY is missing from settings")

    genai.configure(api_key=settings.GEMINI_API_KEY)
    # Using gemini-1.5-flash (example); change if your environment requires a different model
    model = genai.GenerativeModel("gemini-1.5-flash")
    logger.info("✅ Gemini AI Model configured successfully.")
except Exception as e:
    logger.error(f"🔥 Failed to configure Gemini AI: {e}. Check GEMINI_API_KEY.")
    model = None


async def check_policy_compliance(policy_text: str, data_type: str, purpose: str) -> bool:
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
    """

    try:
        # If your genai version has different async API, update this line accordingly.
        response = await model.generate_content_async(prompt)
        decision = response.text.strip().upper()
        logger.info(f"Gemini Decision: {decision} for Data: '{data_type}', Purpose: '{purpose}'")

        return decision == "APPROVED"
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return False
