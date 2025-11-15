#!/usr/bin/env python3
"""
Debug user data to see current settings
"""

import requests
import json

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"

def check_user_data(user_id: str):
    """Check current user data"""
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/v1/citizen/{user_id}/profile")
        
        if response.ok:
            user_data = response.json()
            print(f"📊 User data for {user_id}:")
            print(f"manual_approval_required: {user_data.get('manual_approval_required')}")
            print(f"email: {user_data.get('email')}")
            return user_data
        else:
            print(f"❌ Failed to get user data: {response.text}")
            return None
            
    except Exception as e:
        print(f"🔌 Error: {e}")
        return None

def main():
    print("🔍 Debugging user data")
    print("=" * 30)
    
    user_data = check_user_data("plato")
    
    if user_data:
        print(f"\n📋 Full user data:")
        print(json.dumps(user_data, indent=2))

if __name__ == "__main__":
    main()