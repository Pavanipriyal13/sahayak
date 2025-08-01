# test_backend.py - Simple test to check if backend works
import requests
import json

def test_backend():
    base_url = "http://localhost:8000"
    
    print("Testing Sahayak Backend...")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=5)
        print("✅ Health Check:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("❌ Health Check Failed:", str(e))
        print("-> Backend is not running or not accessible")
        return False
    
    # Test 2: Simple chat endpoint
    try:
        test_data = {
            "prompt": "Hello, testing connection",
            "user_id": "test_user",
            "language": "english"
        }
        response = requests.post(f"{base_url}/run", json=test_data, timeout=10)
        print("✅ Chat Endpoint:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("❌ Chat Endpoint Failed:", str(e))
    
    # Test 3: Database health
    try:
        response = requests.get(f"{base_url}/api/database/health", timeout=5)
        print("✅ Database Health:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("❌ Database Health Failed:", str(e))
    
    print("=" * 50)
    print("If you see ✅ for Health Check, your backend is working!")
    print("If you see ❌, check if your backend is running on port 8000")
    
    return True

if __name__ == "__main__":
    test_backend()