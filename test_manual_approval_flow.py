#!/usr/bin/env python3
"""
Test manual approval flow - organization requests data and polls for approval
"""

import requests
import json
import time

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def enable_manual_approval(user_id: str):
    """Enable manual approval for user"""
    response = requests.put(
        f"{API_BASE_URL}/api/v1/citizen/{user_id}/profile",
        headers={"Content-Type": "application/json"},
        json={"manual_approval_required": True}
    )
    return response.ok

def request_data_with_polling(user_id: str, data_type: str, purpose: str):
    """Request data and poll for approval"""
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    # Step 1: Submit request
    print(f"🔄 Requesting {data_type} from {user_id}...")
    response = requests.post(
        f"{API_BASE_URL}/api/v1/request-data",
        headers=headers,
        json={
            "user_id": user_id,
            "data_type": data_type,
            "purpose": purpose
        }
    )
    
    if response.status_code != 202:
        print(f"❌ Request failed: {response.text}")
        return None
    
    result = response.json()
    request_id = result.get("request_id")
    
    if result.get("status") == "auto_approved":
        print(f"⚡ Auto-approved! Data: {result.get('data')}")
        return result.get('data')
    
    print(f"⏳ Request submitted (ID: {request_id})")
    print(f"📱 User will receive notification to approve/deny")
    print(f"🔄 Polling for approval...")
    
    # Step 2: Poll for approval
    for i in range(60):  # Poll for 60 seconds
        time.sleep(1)
        
        try:
            status_response = requests.get(
                f"{API_BASE_URL}/api/v1/request-status/{request_id}",
                headers=headers
            )
            
            if status_response.ok:
                status_data = status_response.json()
                status = status_data.get("status")
                
                if status == "approved":
                    print(f"✅ APPROVED! Data: {status_data.get('data')}")
                    return status_data.get('data')
                elif status == "denied":
                    print(f"❌ DENIED! {status_data.get('message')}")
                    return None
                elif status == "pending":
                    if i % 5 == 0:  # Only print every 5 seconds
                        print(f"⏳ Still pending... ({i+1}s)")
                else:
                    print(f"🔄 Status changed to: {status}")
            
        except Exception as e:
            if i % 10 == 0:  # Only print errors every 10 seconds
                print(f"🔌 Polling error: {e}")
    
    print(f"⏰ Timeout - no response after 60 seconds")
    return None

def main():
    print("🛡️  TrustGrid Manual Approval Flow Test")
    print("=" * 50)
    
    user_id = "plato"
    
    # Enable manual approval for user
    print(f"🔧 Enabling manual approval for {user_id}...")
    if enable_manual_approval(user_id):
        print(f"✅ Manual approval enabled")
    else:
        print(f"❌ Failed to enable manual approval")
        return
    
    # Request data with polling
    data = request_data_with_polling(
        user_id=user_id,
        data_type="email", 
        purpose="customer support communication"
    )
    
    if data:
        print(f"\n🎉 SUCCESS: Retrieved {data}")
    else:
        print(f"\n❌ FAILED: Could not retrieve data")
    
    print(f"\n💡 To test: Open citizen app and approve/deny the request")

if __name__ == "__main__":
    main()