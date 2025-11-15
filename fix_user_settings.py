#!/usr/bin/env python3
"""
Fix user settings to enable auto-approval
"""

import requests
import json

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"

def fix_user_auto_approval(user_id: str):
    """Set user to allow auto-approval"""
    
    try:
        # Update user profile to enable auto-approval
        response = requests.put(
            f"{API_BASE_URL}/api/v1/citizen/{user_id}/profile",
            headers={"Content-Type": "application/json"},
            json={"manual_approval_required": False}
        )
        
        if response.ok:
            print(f"✅ Fixed {user_id} - auto-approval enabled")
            return True
        else:
            print(f"❌ Failed to fix {user_id}: {response.text}")
            return False
            
    except Exception as e:
        print(f"🔌 Error: {e}")
        return False

def main():
    print("🔧 Fixing user settings for auto-approval")
    print("=" * 40)
    
    # Fix the user
    user_id = "plato"
    
    if fix_user_auto_approval(user_id):
        print(f"\n🎉 {user_id} is now ready for auto-approval!")
        print("Run the email test script again.")
    else:
        print(f"\n❌ Could not fix {user_id}")

if __name__ == "__main__":
    main()