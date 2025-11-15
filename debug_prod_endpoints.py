#!/usr/bin/env python3
"""
Debug Production Endpoints
"""

import requests

def check_endpoints():
    """Check what endpoints exist on production"""
    
    base_url = "https://trust-grid.onrender.com"
    
    # Check root endpoint
    print("🔍 Checking root endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
    except Exception as e:
        print(f"💥 Error: {e}")
    
    # Check docs endpoint
    print("\n🔍 Checking docs endpoint...")
    try:
        response = requests.get(f"{base_url}/docs", timeout=10)
        print(f"📊 Status: {response.status_code}")
    except Exception as e:
        print(f"💥 Error: {e}")
    
    # Test fresh API key with /org/me endpoint
    api_key = "tg_live_TNsJ20cdIsKUfH5RNoXIxQ"
    headers = {"X-API-Key": api_key}
    
    print(f"\n🔍 Testing /api/v1/org/me with fresh key...")
    try:
        response = requests.get(f"{base_url}/api/v1/org/me", headers=headers, timeout=10)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    check_endpoints()