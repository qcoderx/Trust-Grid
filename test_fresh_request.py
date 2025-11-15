#!/usr/bin/env python3
"""
Test fresh request and immediate status check
"""

import requests
import json
import time

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def make_fresh_request():
    """Make a fresh request and check status immediately"""
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    # Step 1: Make request
    print("🔄 Making fresh request...")
    response = requests.post(
        f"{API_BASE_URL}/api/v1/request-data",
        headers=headers,
        json={
            "user_id": "plato",
            "data_type": "email",
            "purpose": "sending business updates"
        }
    )
    
    if response.status_code != 202:
        print(f"❌ Request failed: {response.text}")
        return
    
    result = response.json()
    request_id = result.get("request_id")
    status = result.get("status")
    
    print(f"✅ Request created: {request_id}")
    print(f"📊 Initial status: {status}")
    
    if status == "auto_approved":
        print(f"⚡ Auto-approved! Data: {result.get('data')}")
        return
    
    # Step 2: Check status immediately
    print(f"\n🔍 Checking status immediately...")
    time.sleep(1)
    
    status_response = requests.get(
        f"{API_BASE_URL}/api/v1/request-status/{request_id}",
        headers=headers
    )
    
    if status_response.ok:
        status_data = status_response.json()
        print(f"✅ Status check successful:")
        print(json.dumps(status_data, indent=2))
    else:
        print(f"❌ Status check failed: {status_response.text}")

def main():
    print("🧪 Fresh Request Test")
    print("=" * 30)
    
    make_fresh_request()

if __name__ == "__main__":
    main()