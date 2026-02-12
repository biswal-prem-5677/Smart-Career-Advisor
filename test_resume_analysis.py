import requests

url = "http://localhost:8000/api/chat-analyze"
file_path = "dummy_resume.txt"

try:
    with open(file_path, "rb") as f:
        files = {"file": (file_path, f, "text/plain")}
        print("Uploading resume...")
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            data = response.json()
            print("Response received:")
            print(f"Message: {data.get('response')}")
            roles = data.get("roles", [])
            if roles:
                print(f"Found {len(roles)} recommended roles:")
                for role in roles:
                    print(f"- {role.get('job_title')}")
                    print(f"  Target: {role.get('company')}")
                    print(f"  Link: {role.get('apply_link')}")
            else:
                print("No roles found.")
        else:
            print(f"Error: {response.status_code} - {response.text}")

except Exception as e:
    print(f"Test failed: {e}")
