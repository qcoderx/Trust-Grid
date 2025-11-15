#!/usr/bin/env python3
"""
Check the latest request in the database
"""

import requests
import json

# Configuration
API_BASE_URL = "https://trust-grid.onrender.com"

def check_latest_request():
    """Check the latest request for plato"""
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/citizen/plato/log")
        
        if response.ok:
            requests_data = response.json()
            if requests_data:
                latest = requests_data[0]  # Most recent
                print(f"📊 Latest request:")
                print(f"  ID: {latest.get('_id')}")
                print(f"  Status: {latest.get('status')}")
                print(f"  Org ID: {latest.get('org_id')}")
                print(f"  Org Name: {latest.get('org_name')}")
                print(f"  Data: {latest.get('data_type')}")
                print(f"  Purpose: {latest.get('purpose')}")
                print(f"  Timestamp: {latest.get('timestamp')}")
                return latest
            else:
                print("No requests found")
                return None
        else:
            print(f"❌ Failed to get requests: {response.text}")
            return None
            
    except Exception as e:
        print(f"🔌 Error: {e}")
        return None

def main():
    print("🔍 Checking Latest Request")
    print("=" * 30)
    
    latest = check_latest_request()
    
    if latest:
        print(f"\n📋 Full request data:")
        print(json.dumps(latest, indent=2))

if __name__ == "__main__":
    main()