import json
import os
from datetime import datetime

# Path to the activity log file
# Using a relative path that resolves to backend/user_activity.json or similar
# Adjust based on where this file is imported. 
# Assuming src/activity_logger.py, and we want to store in backend/user_activity.json
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACTIVITY_FILE = os.path.join(BASE_DIR, 'backend', 'user_activity.json')

def load_activity_log():
    if not os.path.exists(ACTIVITY_FILE):
        return {}
    try:
        with open(ACTIVITY_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_activity_log(data):
    try:
        with open(ACTIVITY_FILE, 'w') as f:
            json.dump(data, f, indent=4)
    except Exception as e:
        print(f"Error saving activity log: {e}")

def log_activity(user_email: str, activity_type: str, details: dict):
    """
    Logs a user activity.
    
    Args:
        user_email (str): Email of the user (or 'guest').
        activity_type (str): Type of activity (e.g., 'resume_scan', 'prep_plan').
        details (dict): specific details about the activity (e.g., score, company).
    """
    if not user_email:
        user_email = "guest"
        
    data = load_activity_log()
    
    if user_email not in data:
        data[user_email] = []
        
    entry = {
        "timestamp": datetime.now().isoformat(),
        "type": activity_type,
        "details": details
    }
    
    data[user_email].append(entry)
    save_activity_log(data)
    print(f"📝 Activity logged for {user_email}: {activity_type}")

def get_user_activity(user_email: str):
    """
    Retrieves the activity history for a user.
    """
    if not user_email:
        user_email = "guest"
        
    data = load_activity_log()
    return data.get(user_email, [])
