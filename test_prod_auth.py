#!/usr/bin/env python3
"""
Test Production Authentication
"""

import requests
import hashlib

def test_production_auth():
    """Test if production backend has the SHA256 fix"""
    
    api_key = "tg_live_cGJzuIepMcK73Bn9A9s9PA"
    
    # Test with correct header format
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    # Test the /api/v1/org/me endpoint (should work if auth is fixed)
    url = "https://trust-grid.onrender.com/api/v1/org/me"
    
    print(f"🔑 Testing API Key: {api_key}")
    print(f"🔗 URL: {url}")
    print(f"📤 Headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Authentication working!")
            return True
        else:
            print("❌ Authentication failed")
            return False
            
    except Exception as e:
        print(f"💥 Error: {e}")
        return False

def test_data_request():
    """Test data request with correct headers"""
    
    api_key = "tg_live_cGJzuIepMcK73Bn9A9s9PA"
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    data = {
        "user_id": "plato",
        "data_type": "email", 
        "purpose": "testing"
    }
    
    url = "https://trust-grid.onrender.com/api/v1/request-data"
    
    print(f"\n📧 Testing data request...")
    print(f"🔗 URL: {url}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code in [200, 202]:
            print("✅ Data request working!")
            return True
        else:
            print("❌ Data request failed")
            return False
            
    except Exception as e:
        print(f"💥 Error: {e}")
        return False

if __name__ == "__main__":
    auth_works = test_production_auth()
    if auth_works:
        test_data_request()
    else:
        print("\n🚨 Production backend needs the SHA256 security fix!")
        print("The backend is still using bcrypt for API keys which fails for long keys.")