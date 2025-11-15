#!/usr/bin/env python3
"""
Test script for the new organization password authentication endpoints.
Run this after starting the TrustGrid API server.
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_organization_registration():
    """Test organization registration with password"""
    print("Testing organization registration...")
    
    data = {
        "org_name": "TestOrg123",
        "password": "secure_password_123"
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/org/register", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Registration successful!")
        print(f"Organization: {result['organization']['org_name']}")
        print(f"API Key: {result['api_key'][:20]}...")
        return result
    else:
        print(f"❌ Registration failed: {response.status_code}")
        print(response.text)
        return None

def test_organization_login(org_name, password):
    """Test organization login with credentials"""
    print("Testing organization login with credentials...")
    
    data = {
        "org_name": org_name,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/api/v1/org/login", json=data)
    
    if response.status_code == 200:
        result = response.json()
        print("✅ Login successful!")
        print(f"Organization: {result['org_name']}")
        return result
    else:
        print(f"❌ Login failed: {response.status_code}")
        print(response.text)
        return None

def test_api_key_login(api_key):
    """Test organization login with API key"""
    print("Testing organization login with API key...")
    
    data = {"api_key": api_key}
    
    response = requests.post(
        f"{BASE_URL}/api/v1/org/login-api-key", 
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if response.status_code == 200:
        result = response.json()
        print("✅ API Key login successful!")
        print(f"Organization: {result['org_name']}")
        return result
    else:
        print(f"❌ API Key login failed: {response.status_code}")
        print(response.text)
        return None

def main():
    print("🚀 Testing TrustGrid Organization Authentication")
    print("=" * 50)
    
    # Test registration
    registration_result = test_organization_registration()
    if not registration_result:
        return
    
    org_name = registration_result['organization']['org_name']
    api_key = registration_result['api_key']
    
    print("\n" + "=" * 50)
    
    # Test credential login
    login_result = test_organization_login(org_name, "secure_password_123")
    
    print("\n" + "=" * 50)
    
    # Test API key login
    api_login_result = test_api_key_login(api_key)
    
    print("\n" + "=" * 50)
    print("🎉 All tests completed!")

if __name__ == "__main__":
    main()