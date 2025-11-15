#!/usr/bin/env python3
"""
Test status check for specific request
"""

import requests
import json

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def test_status_check():
    """Test status check for the known request"""
    
    request_id = "6918dc48fc1fa20befb6a653"  # The approved request
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    print(f"🔍 Checking status for request: {request_id}")
    
    response = requests.get(
        f"{API_BASE_URL}/api/v1/request-status/{request_id}",
        headers=headers
    )
    
    print(f"📡 Response Status: {response.status_code}")
    
    if response.ok:
        status_data = response.json()
        print(f"✅ SUCCESS! Got data:")
        print(json.dumps(status_data, indent=2))
        
        if status_data.get('data'):
            print(f"\n🎉 EMAIL RETRIEVED: {status_data.get('data')}")
    else:
        print(f"❌ FAILED: {response.text}")

def main():
    print("🧪 Specific Status Test")
    print("=" * 30)
    
    test_status_check()

if __name__ == "__main__":
    main()