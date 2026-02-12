import requests
import json

url = "http://localhost:8000/api/chat-query"
headers = {"Content-Type": "application/json"}
payload = {"query": "Senior Cloud Infrastructure Engineer"}

try:
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print("Response received.")
        roles = data.get("roles", [])
        if roles:
            print(f"Found {len(roles)} roles.")
            for role in roles:
                print(f"Role: {role.get('job_title')}")
                print(f"Link: {role.get('apply_link')}")
                if "google.com/search" in role.get('apply_link', ''):
                    print("✅ Valid Google Search Link")
                else:
                    print("❌ Invalid Link")
        else:
            print("No roles found (Fallback might have failed).")
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Request failed: {e}")
