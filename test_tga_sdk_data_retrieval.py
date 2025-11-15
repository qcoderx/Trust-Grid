#!/usr/bin/env python3
"""
TGA SDK Test - Data Retrieval
Simple test to retrieve citizen data using the TrustGrid SDK
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend', 'tga-sdk'))

from tga import TrustGridClient

def test_data_retrieval():
    """Test data retrieval using TGA SDK"""
    
    # Use the working API key
    api_key = "tg_live_hXQr_Pv-UnVpMirn4hGm5g"
    
    print("🛡️  TrustGrid SDK Data Retrieval Test")
    print("=" * 45)
    
    try:
        # Initialize TrustGrid client with explicit production URL
        client = TrustGridClient(
            api_key=api_key,
            base_url="https://trust-grid.onrender.com"
        )
        print(f"✅ TrustGrid SDK initialized")
        print(f"🔗 Base URL: {client.base_url}")
        print(f"🔑 API Key: {api_key[:20]}...")
        
        # Request email data from citizen
        print("\n📧 Requesting email data...")
        print(f"🎯 Target URL: {client.base_url}/api/v1/request-data")
        response = client.request_data_access(
            user_id="plato",
            data_type="email", 
            purpose="SDK testing and validation"
        )
        
        print(f"📊 Response Status: {response.get('status')}")
        print(f"🔍 Request ID: {response.get('request_id')}")
        print(f"🤖 AI Analysis: {response.get('ai_reason')}")
        
        # Check if data was returned (auto-approved)
        if response.get('status') == 'auto_approved':
            email = response.get('data')
            print(f"🎉 SUCCESS: Email retrieved automatically!")
            print(f"📧 Email: {email}")
        elif response.get('status') == 'pending':
            print(f"⏳ Request pending manual approval")
            print(f"💡 Check the citizen app to approve this request")
        else:
            print(f"❓ Unexpected status: {response.get('status')}")
            
        return response
        
    except Exception as e:
        print(f"❌ SDK Error: {e}")
        return None

def main():
    result = test_data_retrieval()
    
    if result:
        print(f"\n📋 Full Response:")
        for key, value in result.items():
            print(f"  {key}: {value}")
    else:
        print(f"\n❌ Test failed")

if __name__ == "__main__":
    main()