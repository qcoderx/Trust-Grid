#!/usr/bin/env python3
"""
Debug request status to see what's happening
"""

import requests
import json

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def check_all_requests(user_id: str):
    """Check all requests for a user"""
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/citizen/{user_id}/log")
        if response.ok:
            requests_data = response.json()
            print(f"📊 All requests for {user_id}:")
            for req in requests_data:
                print(f"  ID: {req.get('_id')}")
                print(f"  Status: {req.get('status')}")
                print(f"  Org: {req.get('org_name', req.get('org_id'))}")
                print(f"  Data: {req.get('data_type')}")
                print(f"  Purpose: {req.get('purpose')}")
                print(f"  Timestamp: {req.get('timestamp')}")
                print("  ---")
            return requests_data
        else:
            print(f"❌ Failed to get requests: {response.text}")
            return []
    except Exception as e:
        print(f"🔌 Error: {e}")
        return []

def check_request_status(request_id: str):
    """Check specific request status"""
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/api/v1/request-status/{request_id}",
            headers=headers
        )
        
        if response.ok:
            status_data = response.json()
            print(f"🔍 Request {request_id} status:")
            print(json.dumps(status_data, indent=2))
            return status_data
        else:
            print(f"❌ Failed to get status: {response.text}")
            return None
    except Exception as e:
        print(f"🔌 Error: {e}")
        return None

def main():
    print("🔍 Debugging request status")
    print("=" * 40)
    
    user_id = "plato"
    
    # Check all requests
    all_requests = check_all_requests(user_id)
    
    if all_requests:
        print(f"\n🎯 Latest request details:")
        latest = all_requests[0]  # Most recent
        request_id = latest.get('_id')
        
        print(f"Request ID: {request_id}")
        print(f"Current Status: {latest.get('status')}")
        
        # Check status via org endpoint
        print(f"\n🏢 Checking via organization endpoint:")
        check_request_status(request_id)

if __name__ == "__main__":
    main()