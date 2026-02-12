import requests
import json

url = "http://localhost:8000/api/chat-query"
headers = {"Content-Type": "application/json"}

scenarios = [
    {"name": "General Advice (what can i do)", "query": "what can i do"},
    {"name": "Keyword Search (nlp jobs)", "query": "nlp jobs"},
    {"name": "Irrelevant Query (sax)", "query": "sax"},
    {"name": "Greeting", "query": "hello"}
]

for s in scenarios:
    print(f"\n--- Testing: {s['name']} ---")
    try:
        response = requests.post(url, json={"query": s["query"]}, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data.get('response')}")
            roles = data.get('roles', [])
            if roles:
                print(f"Found {len(roles)} roles.")
                for r in roles[:1]:
                    print(f"Sample Role: {r.get('job_title')} at {r.get('company')}")
            if data.get('suggestions'):
                print(f"Suggestions: {data.get('suggestions')}")
        else:
            print(f"Error {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")
