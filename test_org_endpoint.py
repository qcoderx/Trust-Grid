#!/usr/bin/env python3
"""
Test organization endpoint to verify API key
"""

import requests

def test_org_endpoint():
    """Test if API key works with org endpoint"""
    
    api_key = "tg_live_hXQr_Pv-UnVpMirn4hGm5g"
    base_url = "https://trust-grid.onrender.com"
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    print("🏢 Testing Organization Endpoint")
    print("=" * 32)
    print(f"🔑 API Key: {api_key[:20]}...")
    
    try:
        # Test /org/me endpoint
        response = requests.get(f"{base_url}/api/v1/org/me", headers=headers)
        
        print(f"📊 Status: {response.status_code}")
        
        if response.ok:
            org_data = response.json()
            print(f"✅ SUCCESS!")
            print(f"Organization: {org_data.get('org_name')}")
            print(f"ID: {org_data.get('_id')}")
            print(f"Status: {org_data.get('verification_status')}")
        else:
            print(f"❌ Error: {response.text}")
            print("\n💡 This API key doesn't exist in the production database.")
            print("🔧 You need to:")
            print("   1. Register a new organization on production")
            print("   2. Or use an existing production API key")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_org_endpoint()