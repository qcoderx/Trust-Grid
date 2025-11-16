#!/usr/bin/env python3
"""
Test data request endpoint directly
"""

import requests

def test_data_request():
    """Test data request endpoint directly"""
    
    api_key = "tg_live_9epPETRxQM60A6Klrac44Q"
    
    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }
    
    data = {
        "user_id": "plato",
        "data_type": "email",
        "purpose": "business updates"
    }
    
    url = "https://trust-grid.onrender.com/api/v1/request-data"
    
    print(f"🔑 API Key: {api_key}")
    print(f"🔗 URL: {url}")
    print(f"📤 Headers: {headers}")
    print(f"📦 Data: {data}")
    
    try:
        response = requests.post(url, json=data, headers=headers, timeout=30)
        print(f"📊 Status: {response.status_code}")
        print(f"📋 Response: {response.text}")
        
        if response.status_code == 403:
            print("✅ Expected 403 - organization needs verification")
        elif response.status_code == 401:
            print("❌ 401 - authentication issue")
        else:
            print(f"❓ Unexpected status: {response.status_code}")
            
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    test_data_request()