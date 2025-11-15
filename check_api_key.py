#!/usr/bin/env python3
"""
Check what organization the API key belongs to
"""

import requests
import json

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def check_api_key():
    """Check what organization this API key belongs to"""
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/org/me", headers=headers)
        
        if response.ok:
            org_data = response.json()
            print(f"✅ API Key belongs to:")
            print(f"Organization: {org_data.get('org_name')}")
            print(f"ID: {org_data.get('_id')}")
            print(f"Status: {org_data.get('verification_status')}")
            return org_data
        else:
            print(f"❌ API Key check failed: {response.text}")
            return None
            
    except Exception as e:
        print(f"🔌 Error: {e}")
        return None

def main():
    print("🔑 Checking API Key Organization")
    print("=" * 40)
    
    org_data = check_api_key()
    
    if org_data:
        print(f"\n📋 Full organization data:")
        print(json.dumps(org_data, indent=2))

if __name__ == "__main__":
    main()