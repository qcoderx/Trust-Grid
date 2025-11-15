#!/usr/bin/env python3
"""
Check what API keys exist in production
"""

import requests
import hashlib

def check_api_key_in_db():
    """Check if our API key hash exists in production"""
    
    api_key = "tg_live_cGJzuIepMcK73Bn9A9s9PA"
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    
    print(f"🔑 API Key: {api_key}")
    print(f"🔐 SHA256 Hash: {key_hash}")
    
    # Try to create a new organization to get a fresh API key
    url = "https://trust-grid.onrender.com/api/v1/org/register"
    
    data = {
        "org_name": "Fresh Test Org"
    }
    
    print(f"\n🏢 Creating fresh organization...")
    print(f"🔗 URL: {url}")
    
    try:
        response = requests.post(url, json=data, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 201:
            result = response.json()
            new_api_key = result.get('api_key')
            print(f"✅ SUCCESS! New API Key: {new_api_key}")
            
            # Test the new key immediately
            test_new_key(new_api_key)
            
        else:
            print(f"❌ Failed to create organization")
            
    except Exception as e:
        print(f"💥 Error: {e}")

def test_new_key(api_key):
    """Test a fresh API key"""
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    url = "https://trust-grid.onrender.com/api/v1/org/me"
    
    print(f"\n🧪 Testing fresh API key...")
    print(f"🔑 Key: {api_key}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Fresh API key works!")
        else:
            print("❌ Fresh API key failed too!")
            
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    check_api_key_in_db()