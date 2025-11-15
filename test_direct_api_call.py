#!/usr/bin/env python3
"""
Direct API call test to compare with SDK
"""

import requests

def test_direct_api():
    """Test direct API call"""
    
    api_key = "tg_live_hXQr_Pv-UnVpMirn4hGm5g"
    base_url = "https://trust-grid.onrender.com"
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    data = {
        "user_id": "plato",
        "data_type": "email",
        "purpose": "Direct API test"
    }
    
    print("🔗 Direct API Call Test")
    print("=" * 25)
    print(f"🎯 URL: {base_url}/api/v1/request-data")
    print(f"🔑 API Key: {api_key[:20]}...")
    print(f"📦 Data: {data}")
    
    try:
        response = requests.post(
            f"{base_url}/api/v1/request-data",
            headers=headers,
            json=data
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.ok:
            result = response.json()
            print(f"✅ SUCCESS!")
            print(f"Status: {result.get('status')}")
            print(f"Request ID: {result.get('request_id')}")
            if result.get('data'):
                print(f"Email: {result.get('data')}")
        else:
            print(f"❌ Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Exception: {e}")

if __name__ == "__main__":
    test_direct_api()