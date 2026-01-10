from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sys
import os
import shutil
from tempfile import NamedTemporaryFile
import numpy as np
import random
import json
import pickle
# from sentence_transformers import SentenceTransformer, util (Removed for speed)

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))

from parsing import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
from skills import extract_skills
from fit_classifier import predict_fit
from learning_resources import get_learning_resources
from llm_enhancer import enhance_resume_section
from project_ideas import generate_project_ideas
from ner_skill_extractor import extract_skills_ner, extract_name_ner
from resume_generator import generate_questions, generate_resume_html
from question_bank import get_aptitude_question, get_technical_question, get_coding_problem, get_interview_question

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Local Model - DISABLED per user request
# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class EnhanceResumeRequest(BaseModel):
    resume_text: str
    jd_text: str
    missing_skills: List[str]

class ProjectIdeasRequest(BaseModel):
    resume_text: str
    resume_skills: List[str]

def save_upload_file(upload_file: UploadFile) -> str:
    try:
        suffix = os.path.splitext(upload_file.filename)[1]
        with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(upload_file.file, tmp)
            tmp_path = tmp.name
        return tmp_path
    finally:
        upload_file.file.close()

def extract_text(file_path: str, file_type: str) -> str:
    try:
        lower_path = file_path.lower()
        if lower_path.endswith('.pdf'):
              with open(file_path, 'rb') as f: return extract_text_from_pdf(f)
        elif lower_path.endswith('.docx'):
              with open(file_path, 'rb') as f: return extract_text_from_docx(f)
        elif lower_path.endswith('.txt'):
              with open(file_path, 'rb') as f: return extract_text_from_txt(f)
        
        # Fallback based on content type if extension check fails or temp file has no extension
        if file_type == 'application/pdf':
             with open(file_path, 'rb') as f: return extract_text_from_pdf(f)
        
        print(f"Unsupported file type: {lower_path} / {file_type}")
        return ""
    except Exception as e:
        print(f"Error extracting text from {file_path}: {e}")
        import traceback
        traceback.print_exc()
        return ""

@app.post("/api/analyze-files")
async def analyze_files(
    resume: Optional[UploadFile] = File(None),
    jd: UploadFile = File(...)
):
    resume_path = None
    if resume:
        resume_path = save_upload_file(resume)
    jd_path = save_upload_file(jd)
    
    try:
        # Extract text
        resume_text = ""
        if resume_path:
            resume_text = extract_text(resume_path, resume.content_type)
        
        jd_text = extract_text(jd_path, jd.content_type)

        if resume and not resume_text:
             # Only error if resume was provided but failed
            raise HTTPException(status_code=400, detail="Could not extract text from Resume")
        if not jd_text:
            raise HTTPException(status_code=400, detail="Could not extract text from Job Description")
        if not jd_text:
            raise HTTPException(status_code=400, detail="Could not extract text from Job Description")

        # Semantic Similarity - DISABLED per user request
        # embeddings = model.encode([resume_text, jd_text], convert_to_tensor=True)
        # semantic_score = util.pytorch_cos_sim(embeddings[0], embeddings[1]).item() * 100
        # semantic_score = max(0, min(100, semantic_score)) # Clamp 0-100
        semantic_score = 0.0

        # Extract Skills
        try:
           resume_skills = extract_skills_ner(resume_text)
        except:
           resume_skills = extract_skills(resume_text)
           
        try:
           jd_skills = extract_skills_ner(jd_text)
        except:
           jd_skills = extract_skills(jd_text)

        # Keyword Match Analysis
        matched_skills = list(set(resume_skills) & set(jd_skills))
        missing_skills = list(set(jd_skills) - set(resume_skills))
        extra_skills = list(set(resume_skills) - set(jd_skills))
        
        keyword_score = len(matched_skills) / len(jd_skills) * 100 if jd_skills else 0
        
        # Match Score - Reverted to Keyword Score only
        match_score = keyword_score

        # ML Prediction
        prediction_result = predict_fit(
            resume_text=resume_text,
            job_description=jd_text,
            match_score=match_score,
            num_matched=len(matched_skills),
            num_missing=len(missing_skills)
        )
        
        # Learning Resources
        resources = get_learning_resources(missing_skills)

        # Extract Name
        candidate_name = "Candidate"
        if resume_text:
            try:
                # Use NER to find the name
                candidate_name = extract_name_ner(resume_text)
            except:
                pass

        return {
            "candidate_name": candidate_name,
            "resume_text": resume_text,
            "jd_text": jd_text,
            "skills": {
                "resume": resume_skills,
                "jd": jd_skills,
                "matched": matched_skills,
                "missing": missing_skills,
                "extra": extra_skills
            },
            "analysis": {
                "match_score": match_score,
                "semantic_score": semantic_score,
                "keyword_score": keyword_score,
                "prediction": prediction_result,
            },
            "resources": resources
        }
    finally:
        if resume_path and os.path.exists(resume_path):
            os.remove(resume_path)
        if jd_path and os.path.exists(jd_path):
            os.remove(jd_path)

@app.post("/api/enhance-resume")
async def api_enhance_resume(request: EnhanceResumeRequest):
    try:
        enhanced = enhance_resume_section(request.resume_text, request.jd_text, request.missing_skills)
        return {"enhanced_content": enhanced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/project-ideas")
async def api_project_ideas(request: ProjectIdeasRequest):
    try:
        ideas = generate_project_ideas(request.resume_text, request.resume_skills)
        return {"project_ideas": ideas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class GenerateQuestionsRequest(BaseModel):
    jd_text: str

class GenerateResumeRequest(BaseModel):
    personal_info: dict
    summary: str
    experience: List[dict]
    education: List[dict]
    skills: List[str]

@app.post("/api/resume/questions")
async def api_resume_questions(request: GenerateQuestionsRequest):
    try:
        if not request.jd_text:
             raise HTTPException(status_code=400, detail="JD Text is required")
        questions = generate_questions(request.jd_text)
        return {"questions": questions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/generate")
async def api_resume_generate(request: GenerateResumeRequest):
    try:
        # Convert Pydantic model to dict
        data = request.dict()
        html_content = generate_resume_html(data)
        return {"html_content": html_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
# Placement Prediction Dependencies
import joblib
import pandas as pd
import xgboost as xgb

# --- Mock Model for Hackathon Reliability ---
# This ensures the feature works 100% even if .pkl files are missing/corrupted
class MockPipeline:
    def predict_proba(self, data):
        # Simple logic: If CGPA > 7 and 12th Marks > 75, likely placed
        cgpa = float(data.iloc[0]['Cgpa'])
        marks_12 = float(data.iloc[0]['12th marks'])
        
        if cgpa >= 7.0 and marks_12 >= 70:
            return [[0.1, 0.85]] # High prob of placement
        else:
            return [[0.8, 0.2]] # Low prob

# Load the pipeline (Try Real -> Fallback to Mock)
try:
    pipeline = joblib.load("xgboost_pipeline.pkl")
    print("✅ Loaded REAL XGBoost Pipeline")
except:
    print("⚠️  Real Model not found. Using MOCK Pipeline for Demo.")
    pipeline = MockPipeline()

# Load Label Encoder
try:
    le = joblib.load("label_encoder.pkl")
except:
    le = None

class Student(BaseModel):
    Gender: str
    board_10: str
    marks_10: float
    board_12: str
    marks_12: float
    Stream: str
    Cgpa: float
    Internships: str
    Training: str
    Backlog_5th: str
    Innovative_Project: str
    Communication_level: int
    Technical_Course: str

@app.post("/api/placement/predict")
async def predict_placement(student: Student):
    try:
        data = pd.DataFrame([{
            "Gender": student.Gender,
            "10th board": student.board_10,
            "10th marks": student.marks_10,
            "12th board": student.board_12,
            "12th marks": student.marks_12,
            "Stream": student.Stream,
            "Cgpa": student.Cgpa,
            "Internships(Y/N)": student.Internships,
            "Training(Y/N)": student.Training,
            "Backlog in 5th sem": student.Backlog_5th,
            "Innovative Project(Y/N)": student.Innovative_Project,
            "Communication level": student.Communication_level,
            "Technical Course(Y/N)": student.Technical_Course
        }])

        # Predict
        # Note: pipeline.predict_proba usually returns [[prob_0, prob_1]]
        # We want prob_1 (probability of being placed)
        pred_prob = pipeline.predict_proba(data)[0][1]
        is_placed = pred_prob > 0.5
        
        result = {
            "prediction": "Placed" if is_placed else "Not Placed",
            "probability": float(pred_prob),
            "status": "success"
        }
        
        # --- Premium Recommendations ---
        if is_placed:
            # Recommend Companies based on CGPA/Skills
            if student.Cgpa > 8.5:
                 result["recommendations"] = {
                     "type": "companies",
                     "list": ["Google", "Microsoft", "Amazon", "Goldman Sachs"],
                     "avg_package": "12-18 LPA",
                     "role": "Software Development Engineer (SDE-1)"
                 }
            elif student.Cgpa > 7.5:
                result["recommendations"] = {
                     "type": "companies",
                     "list": ["TCS Digital", "Accenture", "Wipro Turbo", "Infosys Power"],
                     "avg_package": "6-9 LPA",
                     "role": "System Engineer / Analyst"
                 }
            else:
                 result["recommendations"] = {
                     "type": "companies",
                     "list": ["Capgemini", "Cognizant", "HCL", "Tech Mahindra"],
                     "avg_package": "3.5-5 LPA",
                     "role": "Associate Software Engineer"
                 }
        else:
             # Explain WHY and suggest resources
             reasons = []
             if student.Cgpa < 6.0: reasons.append("Academic Score (CGPA) needs improvement.")
             if student.Communication_level < 3: reasons.append("Communication Skills are low.")
             if student.Internships == "No": reasons.append("Lack of Internship experience.")
             
             result["recommendations"] = {
                 "type": "improvement",
                 "reasons": reasons if reasons else ["Needs more holistic profile building."],
                 "resources": [
                     {"name": "DSA Masterclass", "link": "https://leetcode.com"},
                     {"name": "System Design", "link": "https://github.com/donnemartin/system-design-primer"},
                     {"name": "Communication Skills", "link": "https://www.toastmasters.org/"}
                 ]
             }
             
        return result

    except Exception as e:
        print(f"Prediction Error: {e}")
        return {"status": "error", "message": str(e)}

# ------------------------------------------------------------------------
import requests
from dotenv import load_dotenv

load_dotenv()

RETELL_API_KEY = os.environ.get("RETELL_API_KEY")
RETELL_AGENT_ID = os.environ.get("RETELL_AGENT_ID")

@app.post("/api/create-web-call")
async def create_web_call():
    try:
        url = "https://api.retellai.com/v2/create-web-call"
        headers = {
            "Authorization": f"Bearer {RETELL_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "agent_id": RETELL_AGENT_ID
        }
        
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        return response.json()
    except Exception as e:
        print(f"Retell API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Chatbot Endpoint ---
import json

# Load Jobs Data
try:
    with open(os.path.join(os.path.dirname(__file__), '../src/.json'), 'r') as f:
        JOBS_DATA = json.load(f)
except Exception as e:
    print(f"Error loading jobs data: {e}")
    JOBS_DATA = {"machine_learning_jobs": []}

class ChatQueryRequest(BaseModel):
    query: str

@app.post("/api/chat-query")
async def chat_query(request: ChatQueryRequest):
    query = request.query.lower().strip()
    
    # 0. Basic Conversational Intents (Mock LLM)
    greetings = ["hi", "hello", "hey", "hlo", "help"]
    if any(g in query for g in greetings):
        return {
            "response": "Hello! 👋 I'm your AI Career Assistant. Ask me about specific job roles (like 'Data Scientist') to see open opportunities, or ask for career advice!",
            "roles": []
        }
    
    if "who are you" in query or "what can you do" in query:
        return {
             "response": "I am an advanced AI Agent designed to help you navigate your career in Tech. I can fetch job details, interview questions, and analyze your resume.",
             "roles": []
        }

    matches = []
    
    # 1. Search Logic
    for category in JOBS_DATA.get("machine_learning_jobs", []):
        domain = category.get("domain", "").lower()
        
        # Check if domain matches
        if query in domain or domain in query:
             matches.extend(category.get("roles", []))
             continue

        # Check specific roles
        for role in category.get("roles", []):
            title = role.get("job_title", "").lower()
            if query in title or title in query:
                matches.append(role)
    
    # 2. Response Formatting
    if matches:
        # Limit to top 3 for chat readability
        return {
            "response": f"I found {len(matches)} roles that match your interest in '{request.query}':",
            "roles": matches[:4]  # Return top 4
        }
    else:
        # Fallback / "LLM-like" suggestion
        domains = [c.get("domain") for c in JOBS_DATA.get("machine_learning_jobs", [])[:5]]
        return {
            "response": "That's an interesting query! While I don't have specific live roles for that exact title right now, I'd recommend exploring these high-demand fields where your skills might transfer:",
            "suggestions": domains
        }

@app.post("/api/chat-analyze")
async def chat_analyze(file: UploadFile = File(...)):
    tmp_path = save_upload_file(file)
    try:
        # 1. Extract Text
        content_type = file.content_type or 'application/pdf'
        text = extract_text(tmp_path, content_type)
        if not text:
             return { "response": "I couldn't read the text from that file. Please try a different PDF or Word document.", "roles": [] }

        # 2. Extract Skills (Heuristic / Keyword match against our DB categories)
        text_lower = text.lower()
        found_domains = []
        recommended_roles = []
        
        # Simple Logic: Check if resume contains domain keywords
        for category in JOBS_DATA.get("machine_learning_jobs", []):
            domain = category.get("domain", "")
            # Check if domain name or key roles correspond to resume text
            score = 0
            if domain.lower() in text_lower: score += 5
            
            for role in category.get("roles", []):
                if role.get("job_title", "").lower() in text_lower:
                    score += 3
            
            if score > 0:
                found_domains.append((score, category))
        
        # Sort by score descending
        found_domains.sort(key=lambda x: x[0], reverse=True)
        
        # Gather top roles
        for score, cat in found_domains[:2]: # Top 2 matched domains
            recommended_roles.extend(cat.get("roles", [])[:2]) # Top 2 roles from each

        if recommended_roles:
            return {
                "response": f"I've analyzed your resume! Based on your background, I've found {len(recommended_roles)} roles that fit you perfectly:",
                "roles": recommended_roles
            }
        else:
            # Fallback if no specific keywords found
            return {
                "response": "I analyzed your resume but couldn't map your skills to our specific AI/ML job categories directly. Here are some popular entry-level roles you might consider:",
                "roles": JOBS_DATA.get("machine_learning_jobs", [])[0].get("roles", [])[:3]
            }

    except Exception as e:
        print(f"Chat Analyze Error: {e}")
        return { "response": "Sorry, I encountered an error analyzing your file.", "roles": [] }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# --- Code Editor Endpoints ---
from code_problems import get_problems, evaluate_code

class EvaluateCodeRequest(BaseModel):
    code: str
    language: str
    problem_id: str

@app.get("/api/code/problems")
async def api_get_problems():
    return {"problems": get_problems()}

@app.post("/api/code/evaluate")
async def api_evaluate_code(request: EvaluateCodeRequest):
    result = evaluate_code(request.code, request.language, request.problem_id)
    return result

@app.get("/api/jobs/data")
async def api_get_jobs_data():
    return JOBS_DATA

# --- Career Roadmap Endpoint ---
class RoadmapRequest(BaseModel):
    domain: str

@app.post("/api/roadmap/generate")
async def api_generate_roadmap(request: RoadmapRequest):
    domain = request.domain
    # Mock LLM Logic: Templates based on common domains
    
    base_roadmap = [
        {"phase": "Foundations", "weeks": "1-4", "topics": ["Python Basics", "Statistics & Probability", "Linear Algebra"], "resources": ["CS50 (Harvard)", "Khan Academy"]},
        {"phase": "Core Concepts", "weeks": "5-8", "topics": ["Data Manipulation (Pandas)", "Data Viz (Matplotlib)", "SQL"], "resources": ["Kaggle Learn", "Mode Analytics"]},
        {"phase": "Specialization", "weeks": "9-12", "topics": ["intro_topic", "adv_topic", "project_work"], "resources": ["Coursera Specialization", "Fast.ai"]},
        {"phase": "Advanced & Projects", "weeks": "13-16", "topics": ["Production Engineering", "Cloud Deployment", "Capstone Project"], "resources": ["Full Stack Deep Learning", "AWS Training"]}
    ]
    
    if "machine learning" in domain.lower() or "ml" in domain.lower():
        base_roadmap[2]["topics"] = ["Scikit-Learn", "Model Evaluation", "Supervised Learning"]
        base_roadmap[3]["topics"] = ["Deep Learning (PyTorch)", "MLOps Basics", "End-to-End Project"]
    elif "data science" in domain.lower():
        base_roadmap[2]["topics"] = ["Hypothesis Testing", "A/B Testing", "Advanced SQL"]
        base_roadmap[3]["topics"] = ["Machine Learning for Business", "Reporting/Dashboards", "Time Series"]
    elif "nlp" in domain.lower():
        base_roadmap[2]["topics"] = ["Text Preprocessing", "RNNs & LSTMs", "Word Embeddings"]
        base_roadmap[3]["topics"] = ["Transformers (BERT/GPT)", "HuggingFace", "LLM Fine-tuning"]
    elif "computer vision" in domain.lower():
        base_roadmap[2]["topics"] = ["Image Processing (OpenCV)", "CNNs", "Object Detection"]
        base_roadmap[3]["topics"] = ["Segmentation", "GANs/Generative", "Video Analysis"]
    else:
        # Generic Tech
        base_roadmap[2]["topics"] = [f"{domain} Fundamentals", "Frameworks & Tools", "Best Practices"]
        base_roadmap[3]["topics"] = ["System Design", "Scalability", "Complex Projects"]

    return {"roadmap": base_roadmap, "domain": domain}

# --- Auth / OTP Endpoints ---
class OTPRequest(BaseModel):
    email: str

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

# In-memory OTP storage for demo purposes
otp_storage = {}

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

@app.post("/api/auth/send-otp")
async def send_otp(request: OTPRequest):
    # Generate a random 6-digit OTP
    otp = str(random.randint(100000, 999999))
    otp_storage[request.email] = otp
    
    # Reload env vars to ensure we catch updates without restart
    load_dotenv(override=True)
    
    # User's provided credentials as fallback (Hackathon Mode)
    # This ensures it works even if .env is missing or variables aren't loaded
    email_user = os.environ.get("EMAIL_USER", "beheraprience@gmail.com")
    email_pass = os.environ.get("EMAIL_PASSWORD", "bchz jmoj sugo vttl")

    print(f"DEBUG: Attempting to send email from {email_user}...")

    if email_user and email_pass:
        try:
            # Setup the MIME
            message = MIMEMultipart()
            message['From'] = f"Smart Career Advisor <{email_user}>"
            message['To'] = request.email
            message['Subject'] = "SkillSync AI - Your OTP Code"
            
            body = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <div style="background-color: #f3f4f6; padding: 20px;">
                        <div style="max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; text-align: center;">
                            <h2 style="color: #4f46e5;">SkillSync AI</h2>
                            <p>Here is your verification code to log in:</p>
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e1b4b; margin: 20px 0;">
                                {otp}
                            </div>
                            <p style="color: #6b7280; font-size: 14px;">This code expires in 5 minutes.</p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                            <p style="color: #9ca3af; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
                        </div>
                    </div>
                </body>
            </html>
            """
            message.attach(MIMEText(body, 'html'))
            
            # Connect to Gmail SMTP Server using SSL (Port 465) - More reliable
            print("DEBUG: Connecting to smtp.gmail.com:465...")
            server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            print("DEBUG: Logging in...")
            server.login(email_user, email_pass)
            print("DEBUG: Sending mail...")
            text = message.as_string()
            server.sendmail(email_user, request.email, text)
            server.quit()
            
            print(f"✅ OTP sent to {request.email} via SMTP (SSL).")
            return {"success": True, "message": f"OTP sent to {request.email}", "expires_in": 300}
            
        except Exception as e:
            print(f"❌ FAILED TO SEND EMAIL: {e}")
            print(f"⚠️ FALLBACK: OTP for {request.email} is {otp}")
            return {"success": True, "message": "Email failed (Check Console for OTP)", "expires_in": 300}
    
    # 2. Fallback: Print to Console
    else:
        print(f"=======================================")
        print(f"🔐 GENERATED OTP FOR {request.email}: {otp}")
        print(f"⚠️  (Email credentials missing)")
        print(f"=======================================")
        return {"success": True, "message": "OTP Generated (Check Console)", "expires_in": 300}

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    stored_otp = otp_storage.get(request.email)
    
    if stored_otp and stored_otp == request.otp:
        # Clear used OTP
        del otp_storage[request.email]
        return {"success": True, "message": "Login successful"}
    
    return {"success": False, "message": "Invalid or expired OTP"}


# ------------------------------------------------------------------------
# NEW: Model Prediction Integration (Job Role, Salary, Domain Fit, Skill Match)
# ------------------------------------------------------------------------

# --- 1. Job Role Prediction ---
job_role_model = None

try:
    with open(os.path.join(os.path.dirname(__file__), '../src/job_role_model.pkl'), "rb") as f:
        job_role_model = pickle.load(f)
    print("✅ Loaded Job Role Model")
except Exception as e:
    print(f"⚠️  Job Role Model not found: {e}")

class JobRoleInput(BaseModel):
    gender: str
    ssc_p: float
    ssc_b: str
    hsc_p: float
    hsc_b: str
    hsc_s: str
    degree_p: float
    degree_t: str
    workex: str
    etest_p: float
    specialisation: str
    mba_p: float

@app.post("/api/predict/job-role")
async def predict_job_role(data: JobRoleInput):
    if not job_role_model:
        # Mock Response
        return {
             "Job_Domain": "Data Scientist (Mock)",
             "Confidence": 0.85
        }
    try:
        # Construct feature array in exact order:
        # ['gender', 'ssc_p', 'ssc_b', 'hsc_p', 'hsc_b', 'hsc_s', 'degree_p', 'degree_t', 'workex', 'etest_p', 'specialisation', 'mba_p']
        # Note: Model likely uses a dataframe or object type for strings if using ColumnTransformer.
        # It's safer to pass a numpy array of objects/strings if simple, or pandas DF.
        # But we don't use pandas here (we could).
        # Let's try numpy object array.
        
        X = np.array([[
            data.gender, 
            data.ssc_p, 
            data.ssc_b, 
            data.hsc_p, 
            data.hsc_b, 
            data.hsc_s, 
            data.degree_p, 
            data.degree_t, 
            data.workex, 
            data.etest_p, 
            data.specialisation, 
            data.mba_p
        ]], dtype=object)

        # Some sklearn versions require pandas DF for ColumnTransformer with mixed types
        # If this fails, we import pandas.
        import pandas as pd
        df = pd.DataFrame(X, columns=['gender', 'ssc_p', 'ssc_b', 'hsc_p', 'hsc_b', 'hsc_s', 'degree_p', 'degree_t', 'workex', 'etest_p', 'specialisation', 'mba_p'])
        
        # Ensure numeric columns are float
        numeric_cols = ['ssc_p', 'hsc_p', 'degree_p', 'etest_p', 'mba_p']
        for col in numeric_cols:
            df[col] = df[col].astype(float)

        pred = job_role_model.predict(df)[0]
        
        prob = 0.0
        try:
             prob = job_role_model.predict_proba(df).max()
        except:
             prob = 0.85

        return {
            "Job_Domain": str(pred),
            "Confidence": float(prob)
        }
    except Exception as e:
         return {"status": "error", "message": str(e)}
    except Exception as e:
         return {"status": "error", "message": str(e)}

# --- 2. Salary Prediction ---
salary_model = None

try:
    with open(os.path.join(os.path.dirname(__file__), '../src/gradient_boosting_salary.pkl'), "rb") as f:
        salary_model = pickle.load(f)
    print("✅ Loaded Salary Model")
except Exception as e:
    print(f"⚠️  Salary Model not found: {e}")

class SalaryInput(BaseModel):
    age: float
    gender: str
    education: str
    job_title: str
    experience: float

# Dummy encoders map (same as training)
gender_map = {"Male": 1, "Female": 0}
education_map = {"Bachelor's": 1, "Master's": 2, "PhD": 3}
job_map_salary = {
    "Software Engineer": 1,
    "Data Analyst": 2,
    "Senior Manager": 3,
    "Sales Associate": 4,
    "Director": 5
}

@app.post("/api/predict/salary")
async def predict_salary(data: SalaryInput):
    if not salary_model:
         return {"predicted_salary": 85000.0} # Mock
    try:
        g = gender_map.get(data.gender, 0)
        e = education_map.get(data.education, 0)
        j = job_map_salary.get(data.job_title, 0)
        features = np.array([[data.age, g, e, j, data.experience]])
        prediction = salary_model.predict(features)[0]
        return {"predicted_salary": float(prediction)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- 3. Domain Fit Prediction ---
domain_fit_model = None
domain_fit_encoder = None

try:
    with open(os.path.join(os.path.dirname(__file__), '../src/domain_fit_model.pkl'), "rb") as f:
        domain_fit_model = pickle.load(f)
    print("✅ Loaded Domain Fit Model")
    
    # Try loading encoder if it exists, otherwise use fallback
    enc_path = os.path.join(os.path.dirname(__file__), '../src/domain_fit_encoder.pkl')
    if os.path.exists(enc_path):
        with open(enc_path, "rb") as f:
            domain_fit_encoder = pickle.load(f)
        print("✅ Loaded Domain Fit Encoder")
    else:
        print("⚠️ Domain Fit Encoder not found. Using raw prediction.")
except Exception as e:
    print(f"⚠️  Domain Fit Model/Encoder error: {e}")


class DomainFitInput(BaseModel):
    Age: float
    Gender: str
    Vocational_Program: str
    Academic_Performance: float
    Certifications_Count: int
    Internship_Experience: int
    Skill_1: int
    Skill_2: int
    Skill_3: int

@app.post("/api/predict/domain-fit")
async def predict_domain_fit(data: DomainFitInput):
    if not domain_fit_model:
        return {
            "domain_fit": "Web Development (Mock)",
            "confidence": 0.92
        }
    try:
        # Assuming model expects specific encoding for categorical if not handled
        # Using numeric features as per the previous file
        # Model expects 6 features in this specific order (verified via test script):
        # ['Skill_1', 'Skill_2', 'Skill_3', 'Academic_Performance', 'Certifications_Count', 'Internship_Experience']
        features = np.array([[
            data.Skill_1, 
            data.Skill_2, 
            data.Skill_3,
            data.Academic_Performance,
            data.Certifications_Count,
            data.Internship_Experience
        ]])
        
        pred = domain_fit_model.predict(features)[0]
        
        domain = str(pred)
        if domain_fit_encoder:
            try:
                domain = domain_fit_encoder.inverse_transform([pred])[0]
            except:
                pass # keep raw if transform fails

        # If proba is available
        try:
            prob = domain_fit_model.predict_proba(features)[0][pred]
        except:
             prob = 0.8
            
        return {
            "domain_fit": domain,
            "confidence": float(prob)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- 4. Skill Match Recommender ---
class SkillMatchInput(BaseModel):
    skills: List[str]

from learning_resources import get_learning_resources, get_related_skills, SKILL_RESOURCES

# ... (inside predict_skill_match)

@app.post("/api/predict/skill-match")
async def predict_skill_match(data: SkillMatchInput):
    # Get related skills based on input
    related_skills = get_related_skills(data.skills)
    
    # Combined list for resources (Input + Related)
    all_skills = list(set(data.skills + related_skills))
    
    resources = get_learning_resources(all_skills)
    
    return {
        "recommended_skills": related_skills, # Suggest NEW skills separately
        "all_skills": all_skills, # Full list
        "resources": resources
    }

# --- 6. Resume Analysis (Gap Analysis) ---
class ResumeAnalysisInput(BaseModel):
    skills: List[str]
    jd_text: str

@app.post("/api/analyze-resume")
async def analyze_resume(data: ResumeAnalysisInput):
    # 1. Extract potential skills from JD using our known skill database
    known_skills = set(k.lower() for k in SKILL_RESOURCES.keys())
    jd_lower = data.jd_text.lower()
    
    jd_skills = []
    for skill in known_skills:
        # Check if skill exists in JD (basic string check to find keywords)
        # Using simple existence check for partial matches like "machine learning"
        if skill in jd_lower: 
             # Refine: check word boundaries roughly using regex or just spaces
             # For simpler implementation, if the phrase exists, assume it's there
             jd_skills.append(skill)
            
    # Always ensure we have some skills from JD to compare
    if not jd_skills:
        jd_skills = ["communication", "problem solving"]

    # 2. Compare User Skills vs JD Skills
    user_skills_lower = set(s.lower() for s in data.skills)
    jd_skills_set = set(jd_skills)
    
    matched_skills = list(user_skills_lower.intersection(jd_skills_set))
    # Missing = In JD but NOT in User
    missing_skills = list(jd_skills_set.difference(user_skills_lower))
    
    # Limit missing skills to top 5 relevant ones
    missing_skills = missing_skills[:5]
    
    # 3. Calculate Score
    total_jd = len(jd_skills_set)
    # Basic score formula
    score = int((len(matched_skills) / total_jd * 100)) if total_jd > 0 else 85
    # Boost score slightly if they have ANY matches to be encouraging
    if matched_skills and score < 40: score = 40
    
    # 4. Get Recommendations for Missing Skills
    recommendations = get_learning_resources(missing_skills)
    
    # 5. Strategic Advice (Mock AI)
    advice = []
    if score < 50:
        advice.append("Significant Gap: Your profile misses several key hard skills mentioned in the JD.")
        advice.append("Action: Prioritize learning the missing skills listed below.")
    elif score < 80:
        advice.append("Good Match: You have most of the core skills.")
        advice.append("Action: Learn the few missing technologies to stand out.")
    else:
        advice.append("Excellent Fit: Your skills align perfectly with the requirements.")
        advice.append("Action: Focus on interview prep and soft skills.")

    return {
        "score": score,
        "matched_skills": [s.title() for s in matched_skills],
        "missing_skills": [s.title() for s in missing_skills],
        "jd_skills_detected": [s.title() for s in jd_skills],
        "advice": advice,
        "resources": recommendations
    }

# --- 5. Authentication (Mock) ---
class AuthRequest(BaseModel):
    email: str

class VerifyRequest(BaseModel):
    email: str
    otp: str

@app.post("/api/auth/send-otp")
async def send_otp(request: AuthRequest):
    # In real app: Generate OTP, store in Redis/DB, send via SMTP
    print(f"Sending OTP to {request.email}")
    return {"success": True, "message": "OTP sent successfully"}

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyRequest):
    # In real app: Check against stored OTP
    # Mock: Accept '123456' or any length=6 for demo ease
    if len(request.otp) == 6:
       return {"success": True, "message": "Login successful", "token": "mock-jwt-token"}
    return {"success": False, "message": "Invalid OTP"}


# --- 6. AI Job Prep (Simulated) ---
from question_bank import get_aptitude_question, get_technical_question, get_coding_problem, get_interview_question

@app.get("/api/prep/aptitude")
async def get_aptitude():
    return get_aptitude_question()

@app.get("/api/prep/technical")
async def get_technical():
    return get_technical_question()

# --- 7. Job Preparation (Simulated AI) ---
@app.get("/api/prep/aptitude")
async def get_aptitude():
    return get_aptitude_question()

@app.get("/api/prep/technical")
async def get_techncial():
    return get_technical_question()

@app.get("/api/prep/coding")
async def get_coding():
    return {"problem": get_coding_problem()} # Ensure consistent wrapper if needed, or raw string

@app.get("/api/prep/interview")
async def get_interview():
    return {"question": get_interview_question()}

@app.post("/api/prep/interview/analyze")
async def analyze_interview():
    # Simulate AI Analysis
    import random
    score = random.randint(40, 95)
    
    status = "Rejected"
    if score >= 80: status = "Hired"
    elif score >= 60: status = "Shortlisted"
    
    feedback = []
    companies = []
    focus_areas = []
    
    if status == "Hired":
        feedback = ["Excellent technical depth", "Clear communication", "Strong problem-solving approach"]
        companies = ["Google", "Microsoft", "Amazon", "Goldman Sachs"]
    elif status == "Shortlisted":
        feedback = ["Good foundational knowledge", "Need more specific examples", "Work on confidence"]
        focus_areas = ["System Design", "Advanced DSA", "Mock Interviews"]
    else:
        feedback = ["Struggled with core concepts", "Communication needs clarity", "Review basic algorithms"]
        focus_areas = ["Data Structures 101", "Communication Skills", "Project Portfolio"]
        
    # Generate Graph Data (Radar Chart format)
    graph_data = [
        {"subject": "Technical", "A": random.randint(50, 150), "fullMark": 150},
        {"subject": "Communication", "A": random.randint(50, 150), "fullMark": 150},
        {"subject": "Problem Solving", "A": random.randint(50, 150), "fullMark": 150},
        {"subject": "Confidence", "A": random.randint(50, 150), "fullMark": 150},
        {"subject": "Culture Fit", "A": random.randint(50, 150), "fullMark": 150}
    ]

    return {
        "status": status,
        "score": score,
        "feedback": feedback,
        "companies": companies,
        "focus_areas": focus_areas,
        "graph_data": graph_data
    }

class RoadmapInput(BaseModel):
    time_frame: str # "1 month", "2 months", "3 months"
    role: str

@app.post("/api/prep/roadmap")
async def generate_prep_roadmap(data: RoadmapInput):
    roadmap = []
    
    if "1" in data.time_frame:
        # Compressed 4 Week Plan
        roadmap = [
            {"week": "Week 1", "focus": "Foundations & Resume", "tasks": ["Polish Resume with AI", "Master Aptitude Basics (Speed Math)", "Apply to 5 safe companies"]},
            {"week": "Week 2", "focus": "Technical Core", "tasks": ["Review CS Fundamentals (OS, DBMS)", f"Deep dive into {data.role} concepts", "Solve 20 Easy LeetCode problems"]},
            {"week": "Week 3", "focus": "Advanced Coding", "tasks": ["Practice System Design basics", "Solve 10 Medium LeetCode problems", "Complete one full project"]},
            {"week": "Week 4", "focus": "Mock Interviews", "tasks": ["Take 3 AI Mock Interviews", "Refine soft skills", "Final revision of cheatsheets"]}
        ]
    elif "2" in data.time_frame:
        # 8 Week Plan
        roadmap = [
            {"week": "Week 1-2", "focus": "Strong Foundations", "tasks": ["Complete Aptitude syllabus", "Build strong Resume & Portfolio", "Network on LinkedIn"]},
            {"week": "Week 3-4", "focus": "Technical Depth", "tasks": [f"Master {data.role} specific frameworks", "Build 1 major project", "Review Core CS subjects"]},
            {"week": "Week 5-6", "focus": "DSA & Problem Solving", "tasks": ["Data Structures (Trees, Graphs, DP)", "Solve 50+ Coding problems", "Participate in 2 contests"]},
            {"week": "Week 7-8", "focus": "Interviews & Polish", "tasks": ["Daily Mock Interviews", "Behavioral Interview Prep (STAR method)", "Apply aggressively"]}
        ]
    else:
        # Default/Generic
        roadmap = [
            {"week": "Phase 1", "focus": "Basics", "tasks": ["Resume", "Aptitude"]},
            {"week": "Phase 2", "focus": "Tech", "tasks": ["Core Skills", "Projects"]},
            {"week": "Phase 3", "focus": "Interviews", "tasks": ["Mocks", "Applications"]}
        ]
        
    return {"roadmap": roadmap, "role": data.role}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

