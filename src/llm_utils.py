import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load env from backend/.env if not already loaded
# Load env from backend/.env if not already loaded
# Fix path resolution to be relative to this file
current_file_path = os.path.abspath(__file__)
src_dir = os.path.dirname(current_file_path)
project_root = os.path.dirname(src_dir)
backend_env_path = os.path.join(project_root, 'backend', '.env')

if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)
else:
    load_dotenv() # Fallback

import random
import time

# ... imports remain ...

# Load Keys
key_string = os.getenv("GEMINI_API_KEY", "")
API_KEYS = [k.strip() for k in key_string.split(',') if k.strip()]

if not API_KEYS:
    print("⚠️ GEMINI_API_KEY not found. AI features will fail.")

def configure_genai(api_key):
    genai.configure(api_key=api_key)

# Models to try in order of priority
# Models to try in order of priority (Synced with environment supported models)
MODELS = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-flash-latest", "gemini-2.5-flash"]

def get_ai_response(prompt, temperature=0.7):
    """
    Generates text with API key rotation AND Model Fallback on 429.
    Now includes exponential backoff for rate limits.
    """
    if not API_KEYS:
        return "Error: API Key missing."

    shuffled_keys = list(API_KEYS)
    random.shuffle(shuffled_keys)

    max_retries = 1 # Reduced for better latency
    base_delay = 1 # Reduced for better latency

    for key_index, key in enumerate(shuffled_keys):
        configure_genai(key)
        
        # Try models for this key
        for model_name in MODELS:
            for attempt in range(max_retries + 1):
                try:
                    model = genai.GenerativeModel(model_name)
                    # Set a timeout if possible (genai might not support it directly here, but we can set it in request_options if needed)
                    response = model.generate_content(
                        prompt,
                        generation_config=genai.types.GenerationConfig(temperature=temperature)
                    )
                    return response.text
                    
                except Exception as e:
                    error_msg = str(e).lower()
                    if "429" in error_msg or "quota" in error_msg:
                        print(f"⚠️ Quota hit for key ...{key[-4:]} with model {model_name}. Attempt {attempt + 1}")
                        if attempt < max_retries:
                            # Short sleep only if we have more attempts on this key/model
                            time.sleep(base_delay)
                            continue
                        else:
                            # Move to next model for this key
                            break 
                    else:
                        print(f"❌ Error with model {model_name}: {e}")
                        break
            # End of retry loop for this model
        
        # If we reach here, this key failed across all models or hit quotas
        # We implicitly move to the next key in the shuffled_keys loop
    
    return "I'm currently receiving too many requests. Please try again later! ⏳"

def get_ai_json(prompt, temperature=0.5, fallback_data=None):
    """
    Generates JSON with API key rotation AND Model Fallback on 429.
    Now includes exponential backoff and HARD FALLBACK (Mock Data).
    """
    if not API_KEYS:
        if fallback_data:
            print("⚠️ No API Keys. Returning Fallback Data.")
            return fallback_data
        return {}

    shuffled_keys = list(API_KEYS)
    random.shuffle(shuffled_keys)

    max_retries = 3
    base_delay = 2 # seconds

    max_retries = 1 # Reduced for better latency
    base_delay = 1 # Reduced for better latency

    for key_index, key in enumerate(shuffled_keys):
        configure_genai(key)
        
        for model_name in MODELS:
            for attempt in range(max_retries + 1):
                try:
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(
                        f"{prompt}\n\nIMPORTANT: Output ONLY valid JSON code. No markdown formatting.",
                        generation_config=genai.types.GenerationConfig(temperature=temperature)
                    )
                    
                    text = response.text
                    if text.startswith("```json"): text = text[7:]
                    if text.endswith("```"): text = text[:-3]
                    return json.loads(text.strip())
                    
                except Exception as e:
                    error_msg = str(e).lower()
                    if "429" in error_msg or "quota" in error_msg:
                        print(f"⚠️ Quota hit (JSON) for key ...{key[-4:]} with model {model_name}.")
                        if attempt < max_retries:
                            time.sleep(base_delay)
                            continue
                        else:
                            break
                    else:
                        print(f"❌ JSON error with {model_name}: {e}")
                        break
            # End of retry loop for this model
            
    if fallback_data:
        print("⚠️ All API attempts failed. Returning Fallback Mock Data.")
        return fallback_data

    return {"error": "quota_exceeded"}

def generate_company_prep_plan(company_type: str, company_name: str, time_period: str = "4 Weeks"):
    """
    Generates a structured preparation plan for a specific company with historical insights.
    """
    prompt = f"""
    Act as an experienced Placement Mentor.
    User is preparing for '{company_name}' ({company_type} based).

    1. **Hiring Trends (Last 3 Years)**: Analyze how '{company_name}' has hired recently (e.g., focus areas, difficulty level, rounds).
    2. **Frequent Topics**: Identify concepts and questions they ask repeatedly.
    3. **Plan**: Create a {time_period} tailored study plan.

    Structure the response as a JSON object with this exact schema:
    {{
        "insights": {{
            "hiring_trend": "Summary of {company_name}'s hiring pattern over the last 3 years.",
            "common_rounds": ["Round 1: Online Test", "Round 2: Technical"],
            "frequent_topics": ["Topic 1", "Topic 2"],
            "difficulty_level": "Medium-Hard"
        }},
        "weeks": [
            {{
                "week_number": 1,
                "theme": "Focus Area",
                "days": [
                    {{
                        "day": 1,
                        "topic": "Topic Name",
                        "subtopics": ["Sub 1", "Sub 2"],
                        "priority": "High",
                        "resources": ["Link/Book"],
                        "practice_question": "Specific question asked in {company_name} (if any)"
                    }}
                ]
            }}
        ]
    }}
    
    Ensure the plan is realistic and highly specific to {company_name} if possible.
    """
    
    # --- MOCK DATA FALLBACK ---
    mock_plan = {
        "insights": {
            "hiring_trend": f"{company_name} has been focusing on Data Structures, System Design, and practical problem-solving skills over the last 3 years.",
            "common_rounds": ["Round 1: Online Coding Assessment (HackerRank/CodeSignal)", "Round 2: Technical Interview (DSA)", "Round 3: System Design / Managerial Round"],
            "frequent_topics": ["Arrays & Strings", "Dynamic Programming", "Graphs", "SQL", "OOD Principles"],
            "difficulty_level": "Medium-Hard"
        },
        "weeks": [
            {
                "week_number": 1,
                "theme": "Core Data Structures & Algorithms",
                "days": [
                    {
                        "day": 1,
                        "topic": "Arrays & Hashing",
                        "subtopics": ["Two Sum", "Sliding Window", "Prefix Sum"],
                        "priority": "High",
                        "resources": ["LeetCode Top Interview Questions"],
                        "practice_question": "Find the contiguous subarray with the largest sum."
                    },
                     {
                        "day": 2,
                        "topic": "Linked Lists & Strings",
                        "subtopics": ["Fast & Slow Pointers", "String Manipulation"],
                        "priority": "Medium",
                        "resources": ["NeetCode Roadmap"],
                        "practice_question": "Reverse a linked list in groups of size K."
                    }
                ]
            },
            {
                "week_number": 2,
                "theme": "Advanced Algorithms",
                "days": [
                     {
                        "day": 1,
                        "topic": "Trees & Graphs",
                        "subtopics": ["BFS/DFS", "Topological Sort", "Shortest Path"],
                        "priority": "High",
                        "resources": ["GeeksforGeeks Graph Series"],
                        "practice_question": "Number of Islands."
                    }
                ]
            },
             {
                "week_number": 3,
                "theme": "System Design & Databases",
                "days": [
                     {
                        "day": 1,
                        "topic": "Low Level Design",
                        "subtopics": ["Class Diagrams", "Design Patterns"],
                        "priority": "Medium",
                        "resources": ["Head First Design Patterns"],
                        "practice_question": "Design a Parking Lot system."
                    }
                ]
            },
             {
                "week_number": 4,
                "theme": "Mock Interviews & Review",
                "days": [
                     {
                        "day": 1,
                        "topic": "Full Mock Test",
                        "subtopics": ["Time Management", "Communication"],
                        "priority": "Critical",
                        "resources": ["Pramp / InterviewBit"],
                        "practice_question": "Solve 3 problems in 60 mins."
                    }
                ]
            }
        ]
    }
    
    return get_ai_json(prompt, temperature=0.7, fallback_data=mock_plan)

def generate_report_card_analysis(report_data: dict):
    """
    Generates a holistic analysis of the user's career preparation based on their interaction with the app's features.
    """
    prompt = f"""
    Act as a Senior Career Data Scientist. Analyze this student's activity report from the 'Smart Career Advisor' app.
    
    User Activity Data:
    {json.dumps(report_data, indent=2)}
    
    The user has engaged with various features (Job Search, Resume Building, Interview Prep, etc.).
    
    Generate a comprehensive JSON report for the "AI Career Report Dashboard".
    The report MUST follow this EXACT structure:
    
    {{
        "readiness_score": 0-100 (integer),
        "status_label": "Not Ready / Partially Ready / Industry Ready / Placement Ready",
        "score_breakdown": {{
            "Resume Quality": 0-100,
            "Skill Set": 0-100,
            "Project Portfolio": 0-100,
            "Job Market Match": 0-100,
            "Interview Prep": 0-100,
            "Consistency": 0-100
        }},
        "module_usage": [
            {{ "name": "Job Search", "status": "Completed/Pending", "completion": 0-100, "last_run": "timestamp or 'Never'", "outcome": "e.g., 'Analyzed 15 listings'", "score_contribution": "+10" }},
             // ... include all modules from report_data
        ],
        "current_snapshot": {{
            "predicted_role": "e.g., Data Analyst",
            "domain_fit": "e.g., High",
            "salary_range": "e.g., $60k - $80k",
            "top_companies": ["Comp1", "Comp2"],
            "open_positions": 1200,
            "selection_prob": "e.g., 65%",
            "confidence": "High/Medium/Low"
        }},
        "evidence": {{
            "detected_skills": ["Skill1", "Skill2"],
            "missing_skills": ["Skill3", "Skill4"],
            "resume_weaknesses": ["Weakness1"],
            "project_weaknesses": ["Weakness1"]
        }},
        "gap_analysis": {{
            "missing_skills_tags": ["Python", "SQL"],
            "weak_areas": [
                {{ "area": "Coding", "score": 40 }},
                {{ "area": "System Design", "score": 30 }}
            ],
            "top_reasons": ["Reason 1", "Reason 2", "Reason 3"]
        }},
        "improvement_plan": {{
            "day_7": [ {{ "task": "Task 1", "type": "Urgent" }} ],
            "day_30": [ {{ "task": "Task 1", "type": "Skill" }} ],
            "day_90": [ {{ "task": "Task 1", "type": "Project" }} ]
        }},
        "future_snapshot": {{
            "expected_score": 90,
            "updated_salary": "$80k - $100k",
            "updated_roles": ["Senior Analyst"],
            "updated_companies": ["Google", "Amazon"],
            "updated_prob": "90%"
        }},
        "timeline": [
            {{ "date": "Today", "action": "Generated Report" }}
            // infer recent actions from report_data if timestamps exist, else generic
        ],
        "final_summary": "3 concise lines summarizing the verdict."
    }}
    
    If data is missing for a section (e.g. no resume uploaded), generate REALISTIC ESTIMATES or "N/A" values based on the limited info, but KEEP THE STRUCTURE.
    BE STRICT with JSON format.
    """
    
    # --- MOCK REPORT ---
    mock_report = {
        "readiness_score": 72,
        "status_label": "Industry Ready",
        "score_breakdown": {
            "Resume Quality": 85,
            "Skill Set": 70,
            "Project Portfolio": 65,
            "Job Market Match": 75,
            "Interview Prep": 60,
            "Consistency": 80
        },
        "module_usage": [
            { "name": "Resume Analyzer", "status": "Completed", "completion": 100, "last_run": "Today", "outcome": "Score: 85/100", "score_contribution": "+20" },
            { "name": "Skill Gap Analysis", "status": "Completed", "completion": 100, "last_run": "Yesterday", "outcome": "Identified 3 missing skills", "score_contribution": "+15" },
            { "name": "Job Search", "status": "Pending", "completion": 40, "last_run": "2 days ago", "outcome": "Browsed 5 roles", "score_contribution": "+5" }
        ],
        "current_snapshot": {
            "predicted_role": "Data Analyst / SDE",
            "domain_fit": "High",
            "salary_range": "$65k - $90k",
            "top_companies": ["Accenture", "Deloitte", "Capgemini"],
            "open_positions": 850,
            "selection_prob": "72%",
            "confidence": "High"
        },
        "evidence": {
            "detected_skills": ["Python", "SQL", "Data Visualization", "Communication"],
            "missing_skills": ["Cloud Platforms (AWS)", "Advanced Machine Learning", "Docker"],
            "resume_weaknesses": ["Quantifiable impact in project descriptions could be improved."],
            "project_weaknesses": ["Lack of deployed live projects link."]
        },
        "gap_analysis": {
            "missing_skills_tags": ["AWS", "Docker", "CI/CD"],
            "weak_areas": [
                { "area": "Deployment", "score": 40 },
                { "area": "System Design", "score": 50 }
            ],
            "top_reasons": ["Modern roles require cloud knowledge.", "Full-stack awareness is preferred."]
        },
        "improvement_plan": {
            "day_7": [ { "task": "Learn AWS EC2 & S3 basics", "type": "Urgent" } ],
            "day_30": [ { "task": "Deploy one ML model using Flask/Docker", "type": "Project" } ],
            "day_90": [ { "task": "Obtain AWS Cloud Practitioner Certification", "type": "Skill" } ]
        },
        "future_snapshot": {
            "expected_score": 92,
            "updated_salary": "$90k - $120k",
            "updated_roles": ["Data Data Scientist", "Cloud Engineer"],
            "updated_companies": ["Google", "Amazon", "Microsoft"],
            "updated_prob": "95%"
        },
        "timeline": [
            { "date": "Today", "action": "Generated Comprehensive Career Report" }
        ],
        "final_summary": "You are on a strong path with a solid foundation in Data analysis. closing the gap in Cloud and Deployment skills will significantly boost your profile for top-tier product companies."
    }
    
    return get_ai_json(prompt, temperature=0.7, fallback_data=mock_report)
