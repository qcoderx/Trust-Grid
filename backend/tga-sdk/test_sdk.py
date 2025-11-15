#!/usr/bin/env python3
"""
Test script for TGA SDK
"""

from tga import TrustGridClient

def test_sdk():
    # Test with a sample API key (replace with actual key from dev-page)
    api_key = "tg_live_QQC0-fit3J-JAPWg8hwmnw"  # This is from the .env file
    
    try:
        # Initialize client
        client = TrustGridClient(api_key=api_key)
        print("✅ TrustGrid client initialized successfully")
        
        # Test getting API keys (this requires authentication)
        try:
            api_keys = client.get_api_keys()
            print(f"✅ Successfully retrieved {len(api_keys)} API keys")
            for key in api_keys:
                print(f"   - {key.name} (Status: {key.status})")
        except Exception as e:
            print(f"❌ Failed to get API keys: {e}")
        
        # Test creating a new API key
        try:
            new_key = client.create_api_key("Test SDK Key")
            print(f"✅ Successfully created new API key: {new_key.get('key_details', {}).get('name', 'Unknown')}")
        except Exception as e:
            print(f"❌ Failed to create API key: {e}")
            
        # Test data access request
        try:
            response = client.request_data_access(
                user_id="test_user",
                data_type="email",
                purpose="testing SDK functionality"
            )
            print(f"✅ Successfully requested data access: {response.get('status', 'Unknown')}")
        except Exception as e:
            print(f"❌ Failed to request data access: {e}")
            
    except Exception as e:
        print(f"❌ Failed to initialize TrustGrid client: {e}")

if __name__ == "__main__":
    print("Testing TGA SDK...")
    test_sdk()
    print("Test completed!")