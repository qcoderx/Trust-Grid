#!/usr/bin/env python3
"""
Debug Production Organization Creation
"""

import requests
import json

def test_org_creation():
    """Test organization creation on production"""
    
    url = "https://trust-grid.onrender.com/api/v1/organizations/register"
    
    data = {
        "name": "Test Org Debug",
        "email": "debug@test.com", 
        "industry": "fintech",
        "website": "https://test.com",
        "privacy_policy_url": "https://test.com/privacy",
        "data_collection_practices": "We collect minimal data"
    }
    
    print(f"🔗 Testing: {url}")
    print(f"📤 Data: {json.dumps(data, indent=2)}")
    
    try:
        response = requests.post(url, json=data, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 201:
            result = response.json()
            print(f"✅ SUCCESS!")
            print(f"🔑 API Key: {result.get('api_key')}")
        else:
            print(f"❌ FAILED!")
            
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    test_org_creation()