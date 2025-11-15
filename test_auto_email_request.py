#!/usr/bin/env python3
"""
TrustGrid SDK - Auto Email Request Test
Tests automatic email data retrieval when AI compliance passes.
"""

import requests
import json

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def get_email_automatically(user_id: str):
    """
    Request and automatically get email data if AI compliance passes.
    """
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    payload = {
        "user_id": user_id,
        "data_type": "email",
        "purpose": "customer communication and service updates"
    }
    
    try:
        print(f"🔄 Requesting email for: {user_id}")
        
        response = requests.post(
            f"{API_BASE_URL}/api/v1/request-data",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 202:
            result = response.json()
            
            if result.get('status') == 'auto_approved':
                email = result.get('data')
                print(f"✅ SUCCESS: Got email automatically!")
                print(f"📧 Email: {email}")
                print(f"🤖 AI Reason: {result.get('ai_reason')}")
                return email
            else:
                print(f"⏳ Manual approval required - Status: {result.get('status')}")
                return None
                
        else:
            error = response.json().get('detail', 'Unknown error')
            print(f"❌ Failed: {error}")
            return None
            
    except Exception as e:
        print(f"🔌 Error: {e}")
        return None

def main():
    print("🛡️  TrustGrid Auto Email Test")
    print("=" * 40)
    
    # Test user (make sure this user has auto-approval enabled)
    test_user = "plato"
    
    email = get_email_automatically(test_user)
    
    if email:
        print(f"\n🎉 Retrieved email: {email}")
    else:
        print(f"\n❌ Could not auto-retrieve email for {test_user}")
        print("💡 Make sure user has auto-approval enabled in settings")

if __name__ == "__main__":
    main()