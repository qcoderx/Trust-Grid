#!/usr/bin/env python3
"""
Test script for TGA SDK
"""
import sys
import os

# Add the SDK to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'tga-sdk'))

from tga import TrustGridClient

def test_sdk():
    print("Testing TGA SDK...")
    
    # Test with a dummy API key first
    client = TrustGridClient(api_key="test-key", base_url="http://localhost:8000")
    
    try:
        # Test organization registration (this should work without auth)
        print("Testing organization registration...")
        org = client.register_organization("Test Organization")
        print(f"✅ Organization registered: {org.org_name}")
        print(f"   ID: {org.id}")
        print(f"   Status: {org.verification_status}")
        
    except Exception as e:
        print(f"❌ Organization registration failed: {e}")
    
    # If we have a real API key, test other endpoints
    api_key = input("\nEnter a real API key to test authenticated endpoints (or press Enter to skip): ").strip()
    
    if api_key:
        client = TrustGridClient(api_key=api_key, base_url="http://localhost:8000")
        
        try:
            print("Testing API key listing...")
            keys = client.get_api_keys()
            print(f"✅ Found {len(keys)} API keys")
            for key in keys:
                print(f"   - {key.name} ({key.status})")
                
        except Exception as e:
            print(f"❌ API key listing failed: {e}")
        
        try:
            print("Testing API key creation...")
            new_key = client.create_api_key("Test SDK Key")
            print(f"✅ Created new API key: {new_key}")
            
        except Exception as e:
            print(f"❌ API key creation failed: {e}")

if __name__ == "__main__":
    test_sdk()