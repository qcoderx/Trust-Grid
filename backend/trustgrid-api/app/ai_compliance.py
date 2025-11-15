# app/ai_compliance.py
import google.generativeai as genai
from app.database import settings
import logging
import json
from typing import Literal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- Configure AI Models ---
regulator_model = None
verifier_model = None
try:
    if not getattr(settings, "GEMINI_API_KEY", None):
        raise ValueError("GEMINI_API_KEY is missing from settings")

    genai.configure(api_key=settings.GEMINI_API_KEY)

    # --- AI 1: The "Regulator" (Checks Data Minimization) ---
    regulator_system_instruction = """
    You are a strict Nigerian Data Protection Regulation (NDPR) Compliance Officer.
    Your duty is to enforce 'Data Minimization'. You must block any data request that is not
    absolutely necessary and proportionate for the company's *verified* business category.
    - 'BVN' or 'NIN' is ONLY for 'Fintech' or 'Healthcare'.
    - 'Dating', 'Social Media', or 'E-commerce' MUST NOT collect BVN or NIN.
    You will respond with a JSON object: {"decision": "APPROVED" or "VIOLATION", "reason": "Your one-sentence explanation."}
    """
    regulator_model = genai.GenerativeModel(
        "gemini-2.5-flash",  # Or "gemini-pro" if 1.5 is not supported by your version
        system_instruction=regulator_system_instruction
    )

    # --- AI 2: The "Verifier" (Checks Identity) ---
    verifier_system_instruction = """
    You are a meticulous business verifier for a compliance agency.
    Your job is to detect impostors. You will compare a company's submitted info
    against their uploaded CAC (Corporate Affairs Commission) certificate.
    - Your PRIMARY task is to read the company name and RC number from the image.
    - If the name on the certificate *does not match* the 'org_name' submitted, REJECT it.
    - If the RC number on the certificate *does not match* the 'business_registration_number' submitted, REJECT it.
    - If the image is blurry, fake, or not a real certificate, REJECT it.
    - If they match, VERIFY it.
    You will respond with a JSON object: {"decision": "VERIFIED" or "REJECTED", "reason": "Your one-sentence explanation."}
    """
    # This model MUST be multi-modal (1.5-flash or 1.5-pro)
    verifier_model = genai.GenerativeModel(
        "gemini-2.5-flash", 
        system_instruction=verifier_system_instruction
    )
    
    logger.info("✅ Gemini AI Models (Verifier and Regulator) configured successfully.")
except Exception as e:
    logger.error(f"🔥 Failed to configure Gemini AI: {e}. Check GEMINI_API_KEY and library version.")
    # Set to None so the app can still run, but endpoints will fail gracefully
    regulator_model = None
    verifier_model = None


# --- NEW FUNCTION: The "Gatekeeper" ---
async def verify_organization_identity(
    org_name: str,
    business_registration_number: str,
    cac_certificate_file: dict # This will be the dict from genai.upload_file
) -> dict:
    
    if not verifier_model:
        logger.error("Verifier AI model is not initialized. Failing closed.")
        return {"decision": "REJECTED", "reason": "Internal AI system error. Check model configuration."}

    # --- The Multi-Modal Prompt ---
    prompt_parts = [
        "Please verify this company's identity.",
        "COMPANY SUBMITTED INFO:",
        f"- Organization Name: \"{org_name}\"",
        f"- Registration Number: \"{business_registration_number}\"",
        "\n",
        "ATTACHED CERTIFICATE:",
        cac_certificate_file, # <-- Pass the file handle here
        "\n",
        "TASK:",
        "Look at the image. Does the company name on the certificate match the submitted 'Organization Name'?",
        "Does the RC number on the certificate match the 'Registration Number'?",
        "Return your JSON decision ('VERIFIED' or 'REJECTED')."
    ]

    try:
        response = await verifier_model.generate_content_async(prompt_parts)
        json_response_text = response.text.strip().replace("```json", "").replace("```", "")
        ai_response = json.loads(json_response_text)
        
        decision = ai_response.get("decision", "REJECTED").upper()
        reason = ai_response.get("reason", "AI analysis was inconclusive.")
        
        logger.info(f"Verification Decision: {decision}. Reason: {reason}")
        return {"decision": decision, "reason": reason}

    except Exception as e:
        logger.error(f"Error calling Verifier AI: {e}")
        return {"decision": "REJECTED", "reason": f"Internal error during AI verification: {e}"}


# --- UPGRADED FUNCTION: The "Regulator" ---
async def check_policy_compliance(
    policy_text: str, 
    data_type: str, 
    purpose: str,
    company_category: str # This category is now TRUSTED
) -> dict:
    
    if not regulator_model:
        logger.error("Regulator AI model is not initialized. Failing closed.")
        return {"decision": "VIOLATION", "reason": "Internal AI system error."}

    prompt = f"""
    Analyze the following request based on the company's *verified* profile and its policy.

    VERIFIED COMPANY PROFILE:
    - Category: "{company_category}"

    PRIVACY POLICY:
    "{policy_text}"

    DATA REQUEST:
    - Data: "{data_type}"
    - Stated Purpose: "{purpose}"

    Perform two checks:
    1.  **Policy Check:** Does the policy clearly state that "{data_type}" is collected for a purpose consistent with "{purpose}"?
    2.  **Necessity Check (Data Minimization):** Is it necessary for a "{company_category}" company to collect "{data_type}"? (Refer to your system instructions).

    Return 'VIOLATION' if EITHER check fails.
    Return 'APPROVED' only if BOTH checks pass.
    
    Provide your JSON response.
    """

    try:
        response = await regulator_model.generate_content_async(prompt)
        json_response_text = response.text.strip().replace("```json", "").replace("```", "")
        ai_response = json.loads(json_response_text)
        
        decision = ai_response.get("decision", "VIOLATION").upper()
        reason = ai_response.get("reason", "AI analysis was inconclusive.")

        logger.info(f"Compliance Decision: {decision}. Reason: {reason}")
        return {"decision": decision, "reason": reason}

    except Exception as e:
        logger.error(f"Error calling Regulator AI: {e}")
        return {"decision": "VIOLATION", "reason": f"Internal error during AI compliance check: {e}"}