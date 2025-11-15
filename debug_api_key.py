#!/usr/bin/env python3
"""
Debug API Key Authentication
"""

import requests
import hashlib

def test_api_key_auth():
    """Test API key authentication"""
    
    api_key = "tg_live_cGJzuIepMcK73Bn9A9s9PA"
    
    # Test the verify endpoint
    url = "https://trust-grid.onrender.com/api/v1/verify-key"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    print(f"🔑 Testing API Key: {api_key}")
    print(f"🔗 URL: {url}")
    print(f"📤 Headers: {headers}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        # Also test the hash
        key_hash_sha256 = hashlib.sha256(api_key.encode()).hexdigest()
        print(f"🔐 SHA256 Hash: {key_hash_sha256}")
        
    except Exception as e:
        print(f"💥 Error: {e}")

def test_data_request():
    """Test data request endpoint"""
    
    api_key = "tg_live_cGJzuIepMcK73Bn9A9s9PA"
    url = "https://trust-grid.onrender.com/api/v1/request-data"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    data = {
        "user_id": "plato",
        "data_type": "email",
        "purpose": "testing"
    }
    
    print(f"\n📧 Testing data request...")
    print(f"🔗 URL: {url}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    test_api_key_auth()
    test_data_request()