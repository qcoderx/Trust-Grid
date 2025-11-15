# app/ai_compliance.py
import google.genai as genai
from app.database import settings
import logging
import json
from typing import Literal

# --- New Imports for File Handling ---
from google.genai import types 
from google.genai import Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- System Instructions (Moved out of try/except block) ---

# AI 1: The "Regulator" (Checks Data Minimization)
regulator_system_instruction = """
You are a strict Nigerian Data Protection Regulation (NDPR) Compliance Officer.
Your duty is to enforce 'Data Minimization'. You must block any data request that is not
absolutely necessary and proportionate for the company's *verified* business category.
- 'BVN' or 'NIN' is ONLY for 'Fintech' or 'Healthcare'.
- 'Dating', 'Social Media', or 'E-commerce' MUST NOT collect BVN or NIN.
You will respond with a JSON object: {"decision": "APPROVED" or "VIOLATION", "reason": "Your one-sentence explanation."}
"""

# AI 2: The "Verifier" (Checks Identity)
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

# --- Configure AI Client ---
client: Client | None = None

try:
    if not getattr(settings, "GEMINI_API_KEY", None):
        raise ValueError("GEMINI_API_KEY is missing from settings")

    # Initialize the client for all API access (generation, files, etc.)
    client = Client(api_key=settings.GEMINI_API_KEY)
    
    logger.info("✅ Gemini AI Client configured successfully.")
except Exception as e:
    logger.error(f"🔥 Failed to configure Gemini AI: {e}. Check GEMINI_API_KEY and library version.")
    # Set to None so the app can still run, but endpoints will fail gracefully
    client = None


# --- NEW UTILITY FUNCTION: File Upload ---
def upload_file_for_verification(file_path: str) -> types.File:
    """
    Uploads a local file (e.g., CAC certificate) to the Gemini API service.
    NOTE: This is a synchronous blocking call.
    """
    if not client:
        raise RuntimeError("Gemini Client not initialized for file uploads. Cannot proceed.")
        
    logger.info(f"Uploading {file_path} to Gemini for verification...")
    
    try:
        # Use the client's file service
        uploaded_file = client.files.upload(file=file_path)
        logger.info(f"Successfully uploaded file: {uploaded_file.name}")
        return uploaded_file
    except Exception as e:
        logger.error(f"Error uploading file {file_path}: {e}")
        raise


def delete_uploaded_file(file_object: types.File):
    """
    Deletes the uploaded file from the Gemini API service. 
    This is critical for data retention and storage management.
    """
    if not client:
        logger.warning(f"Client not initialized, could not delete file: {file_object.name}")
        return
    
    try:
        client.files.delete(name=file_object.name)
        logger.info(f"Successfully deleted file: {file_object.name}")
    except Exception as e:
        logger.error(f"Error deleting file {file_object.name}: {e}")
        # Log the error but continue execution


# --- UPDATED FUNCTION: The "Gatekeeper" (Identity Verification) ---
async def verify_organization_identity(
    org_name: str,
    business_registration_number: str,
    # This must be the result of a successful client.files.upload() call
    cac_certificate_file: types.File 
) -> dict:
    
    if not client:
        logger.error("Gemini Client is not initialized. Failing closed.")
        return {"decision": "REJECTED", "reason": "Internal AI system error. Check client configuration."}

    # --- The Multi-Modal Prompt ---
    prompt_parts = [
        "Please verify this company's identity.",
        "COMPANY SUBMITTED INFO:",
        f"- Organization Name: \"{org_name}\"",
        f"- Registration Number: \"{business_registration_number}\"",
        "\n",
        "ATTACHED CERTIFICATE:",
        cac_certificate_file, # <-- Passes the correct genai.File object
        "\n",
        "TASK:",
        "Look at the image. Does the company name on the certificate match the submitted 'Organization Name'?",
        "Does the RC number on the certificate match the 'Registration Number'?",
        "Return your JSON decision ('VERIFIED' or 'REJECTED')."
    ]

    try:
        # Correctly pass system instruction via config object
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt_parts,
            config=types.GenerateContentConfig(
                system_instruction=verifier_system_instruction
            )
        )
        
        json_response_text = response.text.strip().replace("```json", "").replace("```", "")
        ai_response = json.loads(json_response_text)
        
        decision = ai_response.get("decision", "REJECTED").upper()
        reason = ai_response.get("reason", "AI analysis was inconclusive.")
        
        logger.info(f"Verification Decision: {decision}. Reason: {reason}")
        return {"decision": decision, "reason": reason}

    except Exception as e:
        logger.error(f"Error calling Verifier AI: {e}")
        return {"decision": "REJECTED", "reason": f"Internal error during AI verification: {e}"}


# --- UPGRADED FUNCTION: The "Regulator" (Policy Compliance Check) ---
async def check_policy_compliance(
    policy_text: str, 
    data_type: str, 
    purpose: str,
    company_category: str # This category is now TRUSTED
) -> dict:
    
    if not client:
        logger.error("Gemini Client is not initialized. Failing closed.")
        return {"decision": "VIOLATION", "reason": "Internal AI system error. Check client configuration."}

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
        # Correctly pass system instruction via config object
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[prompt],
            config=types.GenerateContentConfig(
                system_instruction=regulator_system_instruction
            )
        )
        
        json_response_text = response.text.strip().replace("```json", "").replace("```", "")
        ai_response = json.loads(json_response_text)
        
        decision = ai_response.get("decision", "VIOLATION").upper()
        reason = ai_response.get("reason", "AI analysis was inconclusive.")

        logger.info(f"Compliance Decision: {decision}. Reason: {reason}")
        return {"decision": decision, "reason": reason}

    except Exception as e:
        logger.error(f"Error calling Regulator AI: {e}")
        return {"decision": "VIOLATION", "reason": f"Internal error during AI compliance check: {e}"}