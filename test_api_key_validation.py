#!/usr/bin/env python3
"""
Test API key validation
"""

import requests

def test_api_key():
    """Test if the API key works"""
    
    api_key = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"
    base_url = "https://trust-grid.onrender.com"
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    print("🔑 Testing API Key Authentication")
    print("=" * 35)
    
    # Test 1: Check organization details
    try:
        response = requests.get(f"{base_url}/api/v1/org/me", headers=headers)
        print(f"📊 /org/me Status: {response.status_code}")
        
        if response.ok:
            org_data = response.json()
            print(f"✅ Organization: {org_data.get('org_name')}")
            print(f"📋 Status: {org_data.get('verification_status')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")
    
    # Test 2: Try data request
    try:
        data = {
            "user_id": "plato",
            "data_type": "email",
            "purpose": "API key validation test"
        }
        
        response = requests.post(f"{base_url}/api/v1/request-data", headers=headers, json=data)
        print(f"\n📊 /request-data Status: {response.status_code}")
        
        if response.ok:
            result = response.json()
            print(f"✅ Request successful: {result.get('status')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_api_key()