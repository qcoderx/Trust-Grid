#!/usr/bin/env python3
"""
Test what's actually deployed on production
"""

import requests

def test_production_backend():
    """Test production backend endpoints"""
    
    base_url = "https://trust-grid.onrender.com"
    
    print("🔍 Testing Production Backend")
    print("=" * 30)
    
    # Test 1: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"📊 Root (/) Status: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"✅ Message: {data.get('message', 'No message')}")
            print(f"📋 Version: {data.get('version', 'Unknown')}")
        else:
            print(f"❌ Root error: {response.text}")
    except Exception as e:
        print(f"❌ Root failed: {e}")
    
    # Test 2: Health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        print(f"\n📊 Health Status: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"✅ Status: {data.get('status')}")
            print(f"🗄️ Database: {data.get('database')}")
        else:
            print(f"❌ Health error: {response.text}")
    except Exception as e:
        print(f"❌ Health failed: {e}")
    
    # Test 3: Docs endpoint
    try:
        response = requests.get(f"{base_url}/docs")
        print(f"\n📊 Docs Status: {response.status_code}")
        if response.ok:
            print(f"✅ API docs are available")
        else:
            print(f"❌ Docs error: {response.status_code}")
    except Exception as e:
        print(f"❌ Docs failed: {e}")
    
    # Test 4: Try to register a new org
    try:
        data = {"org_name": "Test Production Org"}
        response = requests.post(f"{base_url}/api/v1/org/register", json=data)
        print(f"\n📊 Org Register Status: {response.status_code}")
        if response.ok:
            result = response.json()
            print(f"✅ Organization registered!")
            print(f"🏢 Name: {result.get('organization', {}).get('org_name')}")
            print(f"🔑 API Key: {result.get('api_key', 'No key')[:20]}...")
        else:
            print(f"❌ Register error: {response.text}")
    except Exception as e:
        print(f"❌ Register failed: {e}")

if __name__ == "__main__":
    test_production_backend()