#!/usr/bin/env python3
"""
Test if the endpoint exists
"""

import requests

# Configuration
API_BASE_URL = "http://127.0.0.1:8000"
API_KEY = "tg_live_dE-0H6PWRNC4Y8yP6XP9hA"

def test_endpoints():
    """Test various endpoints to see what works"""
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    endpoints_to_test = [
        "/api/v1/org/me",
        "/api/v1/org/log", 
        "/api/v1/request-status/test123",
        "/docs"
    ]
    
    for endpoint in endpoints_to_test:
        try:
            response = requests.get(f"{API_BASE_URL}{endpoint}", headers=headers)
            print(f"{endpoint}: {response.status_code} - {response.reason}")
        except Exception as e:
            print(f"{endpoint}: ERROR - {e}")

def main():
    print("🔍 Testing Endpoints")
    print("=" * 30)
    
    test_endpoints()

if __name__ == "__main__":
    main()