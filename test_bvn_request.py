#!/usr/bin/env python3
"""
TrustGrid SDK Test Script - Email Data Request
This script demonstrates how to request email data from a citizen using TrustGrid's compliance API.
"""

import requests
import json

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def request_email_data(user_id: str, purpose: str = "newsletter subscription"):
    """
    Request email data from a citizen through TrustGrid's compliance system.
    
    Args:
        user_id: The citizen's username
        purpose: The business purpose for requesting email data
    
    Returns:
        dict: API response containing request status and details
    """
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    payload = {
        "user_id": user_id,
        "data_type": "email",
        "purpose": purpose
    }
    
    try:
        print(f"🔄 Requesting email data for user: {user_id}")
        print(f"📋 Purpose: {purpose}")
        print(f"🔑 Using API Key: {API_KEY[:20]}...")
        
        response = requests.post(
            f"{API_BASE_URL}/api/v1/request-data",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"\n📡 Response Status: {response.status_code}")
        
        if response.status_code == 202:
            result = response.json()
            status = result.get('status')
            
            if status == 'auto_approved':
                print("🚀 Request auto-approved!")
                print(f"📝 Request ID: {result.get('request_id')}")
                print(f"🤖 AI Decision: {result.get('ai_reason')}")
                print(f"📊 Data Retrieved: {result.get('data', 'N/A')}")
                print("\n💡 This request was automatically approved because it passed AI compliance checks and the citizen allows auto-approval.")
            else:
                print("✅ Request submitted successfully!")
                print(f"📝 Request ID: {result.get('request_id')}")
                print(f"🤖 AI Decision: {result.get('ai_reason')}")
                print(f"⏳ Status: {status}")
                print("\n💡 The citizen will receive a notification to approve/deny this request.")
            
            return result
            
        elif response.status_code == 403:
            error_detail = response.json().get('detail', 'Compliance violation')
            print(f"🚫 COMPLIANCE VIOLATION: {error_detail}")
            return {"error": "compliance_violation", "detail": error_detail}
            
        else:
            error_detail = response.json().get('detail', 'Unknown error')
            print(f"❌ Request failed: {error_detail}")
            return {"error": "request_failed", "detail": error_detail}
            
    except requests.exceptions.RequestException as e:
        print(f"🔌 Network error: {e}")
        return {"error": "network_error", "detail": str(e)}
    except json.JSONDecodeError as e:
        print(f"📄 Invalid JSON response: {e}")
        return {"error": "json_error", "detail": str(e)}

def main():
    """Main function to test email data request"""
    
    print("🛡️  TrustGrid SDK - Email Data Request Test")
    print("=" * 50)
    
    # Test with a citizen user
    test_user = "qcoderx"  # Replace with actual citizen username
    
    # Request email for newsletter
    result = request_email_data(
        user_id=test_user,
        purpose="newsletter and marketing communications"
    )
    
    print("\n" + "=" * 50)
    print("📊 Final Result:")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()