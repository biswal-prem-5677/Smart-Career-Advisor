import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env from backend/.env
current_file_path = os.path.abspath(__file__)
src_dir = os.path.dirname(current_file_path)
project_root = src_dir # Since we run from root
backend_env_path = os.path.join(project_root, 'backend', '.env')

if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)
else:
    load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
    try:
        print("Listing models...")
        with open("models.txt", "w") as f:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    print(m.name)
                    f.write(m.name + "\n")
    except Exception as e:
        print(f"Error listing models: {e}")
else:
    print("API Key not found")
