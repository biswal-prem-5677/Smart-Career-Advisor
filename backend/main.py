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
from email.mime.multipart import MIMEMultipart
from fpdf import FPDF

# Add src to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from llm_utils import generate_company_prep_plan, generate_report_card_analysis
from activity_logger import log_activity, get_user_activity

from skills import extract_skills
from fit_classifier import predict_fit
from learning_resources import get_learning_resources
from llm_enhancer import enhance_resume_section
from project_ideas import generate_project_ideas
from ner_skill_extractor import extract_skills_ner, extract_name_ner
from resume_generator import generate_questions, generate_resume_html
from parsing import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt
from question_bank import get_aptitude_question, get_technical_question, get_coding_problem, get_interview_question
from auth_utils import hash_password, verify_password
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load Env (Optional)
try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    load_dotenv(env_path)
    
    # Check if loaded
    email_user = os.getenv("EMAIL_USER")
    if email_user:
        print(f" Email configuration loaded for: {email_user}")
    else:
        print("⚠️  Email configuration NOT found in .env. OTPs will not be sent.")
except ImportError:
    print("⚠️  python-dotenv not installed. Generating OTP locally.")
except Exception as e:
    print(f"⚠️  Error loading .env: {e}")

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SkillSync AI Backend is running!", "status": "online"}

# Load Local Model - DISABLED per user request
# model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

class EnhanceResumeRequest(BaseModel):
    resume_text: str
    jd_text: str
    missing_skills: List[str]
    email: Optional[str] = None # Added for tracking


class AuthRequest(BaseModel):
    email: str
    password: Optional[str] = None
    
class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class SignUpCompleteRequest(BaseModel):
    email: str
    password: str
    otp: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str

# In-memory store for OTPs
otp_store = {}
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def send_otp_email(to_email: str, otp: str) -> bool:
    """Sends OTP via SMTP (Gmail or generic). Returns True if successful."""
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    if not sender_email or not sender_password:
        print("⚠️  EMAIL_USER or EMAIL_PASS not set. OTP will only be logged.")
        return False

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = "SkillSync AI - Verification Code"

        body = f"Your verification code is: {otp}\n\nThis code will expire in 5 minutes."
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"📧 Email sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        return False

@app.post("/api/auth/check-user")
async def check_user(request: AuthRequest):
    users = load_users()
    if request.email in users:
        return {"exists": True, "message": "User already exists"}
    return {"exists": False, "message": "User does not exist"}

@app.post("/api/auth/send-otp")
async def send_otp(request: AuthRequest):
    otp = str(random.randint(100000, 999999))
    otp_store[request.email] = otp
    print(f"🔑 OTP for {request.email}: {otp}") # Log always for debugging
    
    # Try sending email
    email_sent = send_otp_email(request.email, otp)
    
    msg = "OTP sent successfully"
    if not email_sent:
        msg += " (Check console for code if email not configured)"
        
    return {"success": True, "message": msg}

@app.post("/api/auth/verify-otp")
async def verify_otp(request: VerifyOTPRequest):
    if request.email in otp_store and otp_store[request.email] == request.otp:
        return {"success": True, "message": "OTP verified"}
    return {"success": False, "message": "Invalid OTP"}

@app.post("/api/auth/signup-complete")
async def signup_complete(request: SignUpCompleteRequest):
    # Verify OTP again to be safe
    if request.email not in otp_store or otp_store[request.email] != request.otp:
        return {"success": False, "message": "Invalid or expired OTP"}
    
    users = load_users()
    if request.email in users:
        return {"success": False, "message": "User already exists"}
    
    hashed_pw = hash_password(request.password)
    users[request.email] = {
        "email": request.email,
        "password": hashed_pw
    }
    save_users(users)
    del otp_store[request.email] # Clear OTP
    
    return {"success": True, "message": "Account created successfully"}

@app.post("/api/auth/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    users = load_users()
    if request.email not in users:
        return {"success": False, "message": "Email not found"}

    otp = str(random.randint(100000, 999999))
    otp_store[request.email] = otp
    print(f"🔑 Reset OTP for {request.email}: {otp}")

    email_sent = send_otp_email(request.email, otp)
    msg = "OTP sent to your email"
    if not email_sent:
        msg += " (Check console)"

    return {"success": True, "message": msg}

@app.post("/api/auth/reset-password")
async def reset_password(request: ResetPasswordRequest):
    if request.email not in otp_store or otp_store[request.email] != request.otp:
        return {"success": False, "message": "Invalid or expired OTP"}

    users = load_users()
    if request.email not in users:
        return {"success": False, "message": "User not found"}

    hashed_pw = hash_password(request.new_password)
    users[request.email]["password"] = hashed_pw
    save_users(users)
    del otp_store[request.email]

    return {"success": True, "message": "Password reset successfully"}

@app.post("/api/auth/login")
async def login(request: AuthRequest):
    users = load_users()
    if request.email not in users:
        return {"success": False, "message": "User does not exist"}
    
    user = users[request.email]
    if verify_password(user["password"], request.password):
        return {"success": True, "message": "Login successful", "user": {"email": request.email}}
    
    return {"success": False, "message": "Incorrect password"}


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

    jd: UploadFile = File(...),
    email: Optional[str] = Form(None) # Added for tracking
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
        
        # Log this activity
        if email or (resume and email):
             log_activity(email, "resume_scan_fit_check", {
                 "match_score": match_score,
                 "role_detect": candidate_name # using name field for now or could parse role
             })


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

class EnhanceResumeRequest(BaseModel):
    resume_text: str
    jd_text: str
    missing_skills: list

class ProjectIdeasRequest(BaseModel):
    resume_text: str
    resume_skills: list

class GenerateRoleQuestionsRequest(BaseModel):
    target_role: str

class GenerateRoleBasedResumeRequest(BaseModel):
    target_role: str
    personal_info: dict
    answers: dict
    skills: List[str]
    target_company: Optional[str] = None

@app.post("/api/resume/questions")
async def api_resume_questions(request: GenerateQuestionsRequest):
    try:
        from llm_utils import get_ai_json
        
        prompt = f"""
        Generate 5 technical interview questions based on this Job Description.
        Job Description: "{request.jd_text[:1000]}..."
        
        Output JSON format:
        [
            {{"question": "Question text", "type": "Technical", "difficulty": "Medium"}},
            ...
        ]
        """
        questions_data = get_ai_json(prompt)
        if questions_data and isinstance(questions_data, list):
            # Extract only the question text if it's a list of objects
            if len(questions_data) > 0 and isinstance(questions_data[0], dict):
                questions = [q.get("question", str(q)) for q in questions_data]
            else:
                questions = questions_data
        else:
             # Fallback
             questions = generate_questions(request.jd_text)
             
        return {"questions": questions}
    except Exception as e:
        print(f"Error generating questions: {e}")
        # Fallback
        try:
            questions = generate_questions(request.jd_text)
            return {"questions": questions}
        except:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/enhance-resume")
async def api_enhance_resume(request: EnhanceResumeRequest):
    try:
        from llm_enhancer import enhance_resume_section
        result = enhance_resume_section(request.resume_text, request.jd_text, request.missing_skills)
        return result
    except Exception as e:
        print(f"Error enhancing resume: {e}")
        # Return static fallback if error
        from llm_enhancer import fallback_enhancer
        return fallback_enhancer(request.resume_text, request.jd_text, request.missing_skills)

@app.post("/api/project-ideas")
async def api_project_ideas(request: ProjectIdeasRequest):
    try:
        from project_ideas import generate_project_ideas
        result = generate_project_ideas(request.resume_text, request.resume_skills)
        return result
    except Exception as e:
         print(f"Error generating project ideas: {e}")
         return "Error generating ideas."

@app.post("/api/resume/generate")
async def api_resume_generate(request: GenerateResumeRequest):
    try:
        # Convert Pydantic model to dict
        data = request.dict()
        html_content = generate_resume_html(data)
        return {"html_content": html_content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/role-questions")
async def api_role_questions(request: GenerateRoleQuestionsRequest):
    try:
        from llm_utils import get_ai_json
        
        prompt = f"""
        Generate 5-7 role-specific questions for a {request.target_role} resume.
        Questions should cover:
        1. Professional Summary/Experience
        2. Technical Skills & Expertise
        3. Projects & Achievements
        4. Education & Certifications
        5. Problem-solving abilities
        
        Output JSON format:
        [
            "What specific experience do you have with [relevant technology/skill]?",
            "Describe a project where you demonstrated [key competency]...",
            ...
        ]
        """
        questions_data = get_ai_json(prompt)
        if questions_data and isinstance(questions_data, list):
            return {"questions": questions_data}
        else:
            # Fallback questions
            fallback_questions = [
                f"Describe your experience as a {request.target_role}.",
                "What are your key technical skills for this role?",
                "Tell us about a relevant project you've worked on.",
                "What makes you a strong candidate for this position?",
                "Describe your educational background and certifications."
            ]
            return {"questions": fallback_questions}
    except Exception as e:
        print(f"Error generating role questions: {e}")
        return {"questions": [f"Tell us about your experience as a {request.target_role}."]}

@app.post("/api/resume/generate-role-based")
async def api_generate_role_based_resume(request: GenerateRoleBasedResumeRequest):
    try:
        from llm_utils import get_ai_response
        
        # Generate professional summary based on answers
        answers_text = '. '.join(request.answers.values()) if request.answers else ''
        
        summary_prompt = f"""
        Create a compelling professional summary for a {request.target_role} position.
        
        Candidate Information:
        - Skills: {', '.join(request.skills)}
        - Experience: {answers_text}
        - Target Company: {request.target_company or 'General'}
        
        Requirements:
        - Use action verbs (Led, Developed, Implemented, etc.)
        - Include quantifiable achievements (%, numbers, metrics)
        - Avoid generic phrases like "hardworking" or "passionate"
        - Keep it concise (2-3 sentences)
        - Tailor to {request.target_role} role
        
        Output only the summary text.
        """
        
        professional_summary = get_ai_response(summary_prompt, temperature=0.7)
        
        # Generate experience entries
        experience_prompt = f"""
        Create 1-2 professional experience entries for a {request.target_role} resume.
        
        Information:
        - Skills: {', '.join(request.skills)}
        - Answers: {answers_text}
        - Target: {request.target_role}
        
        Requirements:
        - Use real-world impact statements
        - Include metrics and achievements
        - Avoid fake experience unless implied by answers
        - Use action verbs
        - Format as bullet points
        
        Output JSON format:
        {{
            "experience": [
                {{
                    "role": "{request.target_role}",
                    "company": "Previous Company",
                    "duration": "Recent",
                    "description": "• Achievement 1\\n• Achievement 2\\n• Achievement 3"
                }}
            ]
        }}
        """
        
        experience_data = get_ai_json(experience_prompt, temperature=0.7)
        
        # Generate education entries
        education_prompt = f"""
        Create relevant education entries for a {request.target_role}.
        
        Output JSON format:
        {{
            "education": [
                {{
                    "degree": "Relevant Degree",
                    "institution": "University Name",
                    "year": "2024"
                }}
            ]
        }}
        """
        
        education_data = get_ai_json(education_prompt, temperature=0.7)
        
        # Prepare data for resume template
        resume_data = {
            'personal_info': request.personal_info,
            'summary': professional_summary,
            'experience': experience_data.get('experience', [{
                'role': request.target_role,
                'company': 'Previous Experience',
                'duration': 'Recent',
                'description': answers_text
            }]),
            'education': education_data.get('education', [{
                'degree': 'B.Tech/S.Degree',
                'institution': 'University Name',
                'year': '2024'
            }]),
            'skills': request.skills
        }
        
        html_content = generate_resume_html(resume_data)
        return {"html_content": html_content}
        
    except Exception as e:
        print(f"Error generating role-based resume: {e}")
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
# Load the pipeline (Try Real -> Fallback to Mock)
try:
    model_path = os.path.join(os.path.dirname(__file__), '../src/xgboost_pipeline.pkl')
    pipeline = joblib.load(model_path)
    print(f"✅ Loaded REAL XGBoost Pipeline from {model_path}")
except Exception as e:
    print(f"⚠️  Real Model not found at expected path: {e}")
    print("⚠️  Using MOCK Pipeline for Demo.")
    pipeline = MockPipeline()

# Load Label Encoder
try:
    le_path = os.path.join(os.path.dirname(__file__), '../src/label_encoder.pkl')
    le = joblib.load(le_path)
    print(f"✅ Loaded Label Encoder from {le_path}")
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
    email: Optional[str] = None # Added for tracking

@app.post("/api/placement/predict")
async def predict_placement(student: Student):
    try:
        # Log activity
        if student.email:
            log_activity(student.email, "placement_prediction", {
                "cgpa": student.Cgpa,
                "prediction": "Pending" 
            })

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
        
        # --- Hard Academic Safeguard ---
        # If CGPA is extremely low or 0, it's virtually impossible to be placed.
        # This overrides potential ML model bias for outliers.
        if student.Cgpa < 5.0 or student.marks_12 < 50:
             pred_prob = min(pred_prob, 0.1) # Force low probability
             
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
    with open(os.path.join(os.path.dirname(__file__), '../src/jobs.json'), 'r') as f:
        JOBS_DATA = json.load(f)
except Exception as e:
    print(f"Error loading jobs data: {e}")
    JOBS_DATA = {"machine_learning_jobs": []}

class ChatQueryRequest(BaseModel):
    query: str

@app.post("/api/chat-query")
async def chat_query(request: ChatQueryRequest):
    query = request.query.lower().strip()
    print(f"DEBUG: Received chat query: {query}")
    
    # Imports
    from llm_utils import get_ai_response, get_ai_json
    import re

    # 0. Basic Conversational Intents
    greetings = ["hi", "hello", "hey", "hlo", "help"]
    if any(g in query for g in greetings) and len(query.split()) < 3:
        return {
            "response": "Hello! 👋 I'm your AI Career Assistant. Ask me about specific job roles (like 'Data Scientist') to see open opportunities, or ask for career advice!",
            "roles": []
        }
    
    # 0.5 AI Intent Detection (Advice vs Job Search)
    intent = "JOB_SEARCH" # Default
    try:
        intent_prompt = f"""
        Analyze the user query: "{request.query}"
        Is the user looking for a specific job/role listings (JOB_SEARCH) or asking a general career/personal advice question (ADVICE)?
        
        Examples:
        - "NLP jobs" -> JOB_SEARCH
        - "what can i do" -> ADVICE
        - "how to start a career in AI" -> ADVICE
        - "Data Scientist roles in Google" -> JOB_SEARCH
        
        Answer with ONLY 'JOB_SEARCH' or 'ADVICE'.
        """
        classification = get_ai_response(intent_prompt).strip().upper()
        if "ADVICE" in classification:
             intent = "ADVICE"
        print(f"DEBUG: Detected Intent: {intent}")
    except:
        pass

    # 0.6 Relevance Guard (Check if Career/Tech related & Appropriate)
    # 0.6 Relevance Guard (Relaxed)
    try:
        guard_prompt = f"""
        Is the following query potentially related to a job search, career advice, professional skills, technology, or general self-improvement? 
        Query: '{query}'
        
        Rules:
        - ALLOW: "nlp", "jobs", "what can i do", "advice", "Help", "learning", "roadmaps".
        - BLOCK ONLY: "sax", explicit sexual content, hate speech, or complete gibberish (e.g., "asdfgh").
        
        Answer with ONLY 'Yes' (if allowed) or 'No' (if blocked).
        """
        is_relevant = get_ai_response(guard_prompt).strip().lower()
        if "no" in is_relevant:
            return {
                "response": "no idea about that this is not in my memory",
                "roles": [],
                "suggestions": ["Data Science", "Machine Learning", "NLP"]
            }
    except:
        pass 
    if intent == "ADVICE":
        try:
            advice_prompt = f"""
            User Query: "{request.query}"
            TASK: provide a helpful, conversational, and specific career advice response.
            - If they ask "what can i do", suggest exploring domains like Data Science, NLP, or MLOps based on current trends.
            - Keep it encouraging and under 60 words.
            - Do NOT return a list of jobs, just a professional response.
            """
            ai_advice = get_ai_response(advice_prompt)
            return {
                "response": ai_advice,
                "roles": [],
                "suggestions": ["Data Scientist", "NLP Engineer", "MLOps Analyst"]
            }
        except Exception as e:
            return {
                "response": "That's a great question! I recommend exploring emerging fields in AI like Generative AI, MLOps, or Data Engineering. What specific area are you most interested in?",
                "suggestions": ["Data Science", "NLP", "Machine Learning"]
            }

    # 2. Job Search Flow (Existing Logic)
    matches = []
    clean_query = re.sub(r"\b(jobs|roles|openings|tell|me|about|find|search|for)\b", "", query).strip()
    
    for category in JOBS_DATA.get("machine_learning_jobs", []):
        domain = category.get("domain", "").lower()
        if clean_query and (clean_query in domain or domain in clean_query):
             matches.extend(category.get("roles", []))
             continue

        for role in category.get("roles", []):
            title = role.get("job_title", "").lower()
            if clean_query and (clean_query in title or title in clean_query):
                matches.append(role)
    
    if matches:
        try:
            context = "\n".join([f"- Role: {m['job_title']} at {m.get('company', 'Tech Company')}. Skills: {', '.join(m.get('skills', []))}" for m in matches[:5]])
            prompt = f"""
            User Query: "{query}"
            Matched Jobs: {context}
            TASK: Be a helpful Career Advisor. List top 3 with Title, Company, Package. Max 50 words.
            """
            ai_response = get_ai_response(prompt)
            return { "response": ai_response, "roles": matches[:4] }
        except Exception as e:
            return { "response": f"I found some roles related to '{clean_query}':", "roles": matches[:4] }

    # 3. AI Selection Fallback (For roles not in DB)
    else:
        try:
            print("DEBUG: Calling Gemini for fallback job generation...")
            prompt = f"""
            User Query: "{query}"
            TASK: Generate 3 realistic tech job listings for this query.
            Output JSON format list:
            [{{ "job_title": "...", "company": "...", "location": "...", "package": "...", "skills": ["..."], "description": "..." }}]
            """
            ai_roles = get_ai_json(prompt)
            
            if isinstance(ai_roles, dict) and ai_roles.get("error") == "quota_exceeded":
                return {
                    "response": "I'm currently receiving too many requests. Please try again in a few seconds! ⏳",
                    "roles": [],
                    "suggestions": ["Data Science", "Machine Learning", "NLP"]
                }
            
            if not ai_roles or not isinstance(ai_roles, list):
                 raise Exception("No roles generated")

            for role in ai_roles:
                raw_role = role.get('job_title', 'Software Engineer')
                raw_company = role.get('company', 'Tech Firm')
                clean_role = re.split(r"[/,]", re.sub(r"\(.*?\)", "", raw_role))[0].strip()
                clean_company = re.split(r"[/,]", raw_company)[0].strip()
                query_string = f"{clean_role} {clean_company} jobs".replace(" ", "+")
                role['apply_link'] = f"https://www.google.com/search?q={query_string}&ibp=htl;jobs"
            
            return {
                "response": f"While I don't have exact matches in my local database, here are 3 trending opportunities for '{request.query}':",
                "roles": ai_roles,
                "suggestions": []
            }
        except Exception as e:
            return {
                "response": f"I couldn't find specific details for '{request.query}' right now. Would you like to explore these domains instead?",
                "suggestions": ["Data Science", "Machine Learning", "NLP", "Computer Vision"]
            }

# --- Report Card Analysis ---
class ReportCardRequest(BaseModel):
    report_data: dict

@app.post("/api/report/analyze")
async def analyze_report_card(request: ReportCardRequest):
    try:
        from llm_utils import generate_report_card_analysis
        analysis = generate_report_card_analysis(request.report_data)
        return analysis
    except Exception as e:
        print(f"Report Card Analysis Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat-analyze")
async def chat_analyze(file: UploadFile = File(...)):
    tmp_path = save_upload_file(file)
    try:
        # 1. Extract Text
        content_type = file.content_type or 'application/pdf'
        text = extract_text(tmp_path, content_type)
        if not text:
             return { "response": "I couldn't read the text from that file. Please try a different PDF or Word document.", "roles": [] }

        # 2. Gemini Analysis
        try:
            from llm_utils import get_ai_json
            
            prompt = f"""
            Act as an Expert Career Coach and Recruiter. 
            Analyze the following resume text to identify the candidate's core strengths and best-fit roles.

            RESUME TEXT:
            {text[:3000]}

            TASK:
            1. Identify the Top 3 Job Roles this candidate has a HIGH chance of getting hired for.
            2. For each role, determine the "Hiring Probability" (High/Medium) and explain why (Ease of entry).
            3. Recommend 2-3 specific companies known for hiring these profiles.

            Output JSON format:
            {{
                "summary": "Brief encouraging summary of their profile (max 2 sentences).",
                "recommendations": [
                    {{
                        "role": "Job Title",
                        "probability": "High/Medium",
                        "reason": "Why this is a good fit",
                        "target_companies": ["Company A", "Company B"]
                    }}
                ]
            }}
            """
            
            ai_data = get_ai_json(prompt)
            
            if isinstance(ai_data, dict) and ai_data.get("error") == "quota_exceeded":
                return { 
                    "response": "I'm currently receiving too many requests. Please try again in a few seconds! ⏳", 
                    "roles": [] 
                }
            
            # Format for Frontend
            response_text = ai_data.get("summary", "I've analyzed your resume and found some great opportunities for you!")
            roles = []
            
            import re
            
            for rec in ai_data.get("recommendations", []):
                companies_str = ", ".join(rec.get("target_companies", []))
                
                # Sanitize for Search Link
                raw_role = rec.get('role', '')
                raw_company = rec.get('target_companies', [''])[0]
                
                # Remove content in parentheses e.g. "Engineer (Intern)" -> "Engineer"
                clean_role = re.sub(r"\(.*?\)", "", raw_role).strip()
                # Split by / or , and take the first part
                clean_role = re.split(r"[/,]", clean_role)[0].strip()
                # Take first company if multiple slashes e.g. "Google/Meta" -> "Google"
                clean_company = re.split(r"[/,]", raw_company)[0].strip()
                
                search_query = f"{clean_role} {clean_company} jobs".replace(" ", "+")
                
                roles.append({
                    "job_title": f"{rec.get('role')} ({rec.get('probability')} Match)",
                    "company": companies_str, 
                    "description": f"{rec.get('reason')} \n\n🎯 Target: {companies_str}",
                    "apply_link": f"https://www.google.com/search?q={search_query}&ibp=htl;jobs"
                })

            return {
                "response": f"{response_text} Here are the roles where your hiring chances are highest:",
                "roles": roles
            }

        except Exception as e:
            print(f"Gemini Analyze Error: {e}")
            # Fallback to keyword matching if AI fails
            text_lower = text.lower()
            found_domains = []
            recommended_roles = []
            
            for category in JOBS_DATA.get("machine_learning_jobs", []):
                domain = category.get("domain", "")
                score = 0
                if domain.lower() in text_lower: score += 5
                for role in category.get("roles", []):
                    if role.get("job_title", "").lower() in text_lower:
                        score += 3
                if score > 0:
                    found_domains.append((score, category))
            
            found_domains.sort(key=lambda x: x[0], reverse=True)
            for score, cat in found_domains[:2]:
                recommended_roles.extend(cat.get("roles", [])[:2])

            return {
                "response": "I analyzed your keywords. Here are some roles that match your skills:",
                "roles": recommended_roles
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
        {"phase": "Foundations", "weeks": "1-4", "topics": ["Python Basics", "Statistics & Probability", "Linear Algebra"], "resources": [{"name": "CS50 (Harvard)", "url": "https://cs50.harvard.edu/x/"}, {"name": "Khan Academy", "url": "https://www.khanacademy.org/math/statistics-probability"}]},
        {"phase": "Core Concepts", "weeks": "5-8", "topics": ["Data Manipulation (Pandas)", "Data Viz (Matplotlib)", "SQL"], "resources": [{"name": "Kaggle Learn", "url": "https://www.kaggle.com/learn"}, {"name": "Mode SQL Tutorial", "url": "https://mode.com/sql-tutorial/"}]},
        {"phase": "Specialization", "weeks": "9-12", "topics": ["intro_topic", "adv_topic", "project_work"], "resources": [{"name": "Coursera Specialization", "url": "https://www.coursera.org/browse/data-science"}, {"name": "Fast.ai", "url": "https://course.fast.ai/"}]},
        {"phase": "Advanced & Projects", "weeks": "13-16", "topics": ["Production Engineering", "Cloud Deployment", "Capstone Project"], "resources": [{"name": "Full Stack Deep Learning", "url": "https://fullstackdeeplearning.com/"}, {"name": "AWS Machine Learning", "url": "https://aws.amazon.com/machine-learning/"}]}
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
    path = os.path.join(os.path.dirname(__file__), '../src/job_role_model.pkl')
    job_role_model = joblib.load(path)
    print("✅ Loaded Job Role Model")
except Exception as e:
    print(f"⚠️  Job Role Model not found: {e}")

# RICH DATA FOR JOB ROLES
JOB_ROLE_DETAILS = {
    "Data Scientist": {
        "description": "Extracts insights from data to help businesses make smart decisions. Uses ML and statistical methods.",
        "avg_salary": "₹12,00,000 - ₹25,00,000",
        "skills": ["Python", "Machine Learning", "Statistics", "SQL"],
        "companies": ["Google", "Amazon", "Microsoft", "Flipkart"],
        "growth": "Dataset Growth: 30% YoY",
        "roadmap_link": "/roadmap/data-science"
    },
    "HR Manager": {
        "description": "Oversees recruitment, employee relations, and company culture. Vital for organizational health.",
        "avg_salary": "₹6,00,000 - ₹15,00,000",
        "skills": ["Communication", "Conflict Resolution", "Labor Laws", "Management"],
        "companies": ["Deloitte", "TCS", "Infosys", "Reliance"],
        "growth": "Stable & Essential",
        "roadmap_link": "/roadmap/hr"
    },
    "Marketing Manager": {
        "description": "Develops strategies to promote products/services and boost brand awareness.",
        "avg_salary": "₹7,00,000 - ₹18,00,000",
        "skills": ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
        "companies": ["HUL", "P&G", "Zomato", "Swiggy"],
        "growth": "High Demand",
        "roadmap_link": "/roadmap/marketing"
    },
    "Business Analyst": {
        "description": "Bridges the gap between IT and business using data analytics to assess processes.",
        "avg_salary": "₹7,00,000 - ₹16,00,000",
        "skills": ["SQL", "Tableau", "Excel", "Communication"],
        "companies": ["Accenture", "McKinsey", "Cognizant"],
        "growth": "Rapidly Growing",
        "roadmap_link": "/roadmap/business-analyst"
    },
    "Software Developer": {
        "description": "Builds and maintains software applications. The backbone of the tech industry.",
        "avg_salary": "₹5,00,000 - ₹14,00,000",
        "skills": ["Java/Python", "Data Structures", "System Design", "Databases"],
        "companies": ["Google", "Adobe", "Oracle", "Startups"],
        "growth": "Evergreen",
        "roadmap_link": "/roadmap/software-dev"
    },
     "Sales Executive": {
        "description": "Drives revenue by selling products/services to customers.",
        "avg_salary": "₹4,00,000 - ₹10,00,000 + Incentives",
        "skills": ["Negotiation", "CRM", "Communication", "Closing"],
        "companies": ["Byju's", "Salesforce", "HDFC Bank"],
        "growth": "Performance Based",
        "roadmap_link": "/roadmap/sales"
    }
}

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
    pred_role = "Data Scientist" # Default fallback
    prob = 0.85
    
    if job_role_model:
        try:
            # Construct feature array
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

            # Use pandas if needed for mixed types handling in pipeline
            import pandas as pd
            df = pd.DataFrame(X, columns=['gender', 'ssc_p', 'ssc_b', 'hsc_p', 'hsc_b', 'hsc_s', 'degree_p', 'degree_t', 'workex', 'etest_p', 'specialisation', 'mba_p'])
            
            # Ensure numeric columns are float
            numeric_cols = ['ssc_p', 'hsc_p', 'degree_p', 'etest_p', 'mba_p']
            for col in numeric_cols:
                df[col] = df[col].astype(float)

            pred_role = str(job_role_model.predict(df)[0])
            
            try:
                 prob = job_role_model.predict_proba(df).max()
            except:
                 prob = 0.85
        except Exception as e:
            print(f"Prediction Error: {e}")
            # Fallback will be used
            
    # Get Details or Default
    details = JOB_ROLE_DETAILS.get(pred_role.strip(), {
        "description": f"A promising career in {pred_role}. Focusing on your strengths will lead to success.",
        "avg_salary": "Competitive Market Standard",
        "skills": ["Core Domain Skills", "Communication", "Problem Solving"],
        "companies": ["Top MNCs", "Startups"],
        "growth": "Stable",
        "roadmap_link": "/roadmap"
    })

    return {
        "Job_Domain": pred_role,
        "Confidence": float(prob),
        "details": details
    }

# --- 2. Salary Prediction ---
salary_model = None

try:
    path = os.path.join(os.path.dirname(__file__), '../src/gradient_boosting_salary.pkl')
    salary_model = joblib.load(path)
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
    predicted_salary = 85000.0 # Default fallback
    
    if salary_model:
        try:
            g = gender_map.get(data.gender, 0)
            e = education_map.get(data.education, 0)
            j = job_map_salary.get(data.job_title, 0)
            features = np.array([[data.age, g, e, j, data.experience]])
            predicted_salary = float(salary_model.predict(features)[0])
        except Exception as e:
            print(f"Salary Prediction Error: {e}")

    # Calculate Range & Insights
    min_salary = round(predicted_salary * 0.9, -3) # -10%
    max_salary = round(predicted_salary * 1.15, -3) # +15%
    
    # Mock Insights based on Role
    insights = {
        "Software Engineer": {"growth": "+22%", "demand": "Very High", "tips": "Focus on System Design & AI skills."},
        "Data Analyst": {"growth": "+18%", "demand": "High", "tips": "Master SQL and advanced visualization."},
        "Senior Manager": {"growth": "+10%", "demand": "Stable", "tips": "Leadership and strategic planning are key."},
        "Sales Associate": {"growth": "+12%", "demand": "Moderate", "tips": "Build strong client relationships."},
        "Director": {"growth": "+8%", "demand": "Niche", "tips": "Visionary leadership drives value."}
    }
    
    role_insights = insights.get(data.job_title, {"growth": "+15%", "demand": "High", "tips": "Continuous learning is essential."})

    return {
        "predicted_salary": round(predicted_salary, -3),
        "min_salary": min_salary,
        "max_salary": max_salary,
        "market_trend": role_insights["demand"],
        "growth_rate": role_insights["growth"],
        "tips": role_insights["tips"]
    }

# --- 3. Domain Fit Prediction ---
domain_fit_model = None
domain_fit_encoder = None

try:
    path = os.path.join(os.path.dirname(__file__), '../src/domain_fit_model.pkl')
    domain_fit_model = joblib.load(path)
    print("✅ Loaded Domain Fit Model")
    
    # Try loading encoder if it exists, otherwise use fallback
    enc_path = os.path.join(os.path.dirname(__file__), '../src/domain_fit_encoder.pkl')
    if os.path.exists(enc_path):
        domain_fit_encoder = joblib.load(enc_path)
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
        # Model expects 7 features in this specific order:
        # ['Age', 'Skill_1', 'Skill_2', 'Skill_3', 'Academic_Performance', 'Certifications_Count', 'Internship_Experience']
        features = np.array([[
            data.Age,
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
        
        # --- Rich Details for "Advanced" Output ---
        domain_details = {
            "Data Science": {
                "description": "You have a knack for finding patterns in chaos. Data Science involves extracting insights from messy data to drive decision-making.",
                "roles": ["Data Scientist", "Data Analyst", "Machine Learning Engineer"],
                "avg_salary": "₹8,00,000 - ₹18,00,000 per annum",
                "skills_needed": ["Python", "SQL", "Statistics", "Machine Learning"],
                "roadmap_link": "/roadmap/data-science"
            },
            "Web Development": {
                "description": "You enjoy building things that people interact with. Web Development is about creating functional and beautiful digital experiences.",
                "roles": ["Frontend Developer", "Backend Developer", "Full Stack Engineer"],
                "avg_salary": "₹5,00,000 - ₹14,00,000 per annum",
                "skills_needed": ["React.js", "Node.js", "HTML/CSS", "System Design"],
                "roadmap_link": "/roadmap/web-development" 
            },
            "Android Development": {
                "description": "You want to build apps that live in people's pockets. Mobile dev is fast-paced and user-centric.",
                "roles": ["Android Developer", "iOS Developer", "Mobile Architect"],
                "avg_salary": "₹6,00,000 - ₹15,00,000 per annum",
                "skills_needed": ["Kotlin", "Flutter", "Java", "Mobile UI/UX"],
                "roadmap_link": "/roadmap/android"
            },
            "Machine Learning": {
                "description": "You are interested in teaching computers to learn. ML is the cutting edge of AI and automation.",
                "roles": ["ML Engineer", "AI Researcher", "NLP Scientist"],
                "avg_salary": "₹10,00,000 - ₹25,00,000 per annum",
                "skills_needed": ["TensorFlow", "PyTorch", "Deep Learning", "Mathematics"],
                "roadmap_link": "/roadmap/machine-learning"
            }
        }
        
        # Default fallback
        details = domain_details.get(domain, {
            "description": f"You show strong potential for {domain}. It's a growing field with many opportunities.",
            "roles": [f"{domain} Specialist", "Consultant"],
            "avg_salary": "Competitive",
            "skills_needed": ["Core Technical Skills", "Problem Solving"],
            "roadmap_link": "/roadmap"
        })

        return {
            "domain_fit": domain,
            "confidence": float(prob),
            "details": details
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- 4. Skill Match Recommender ---
class SkillMatchInput(BaseModel):
    skills: List[str]
    target_role: Optional[str] = None

from learning_resources import get_learning_resources, get_related_skills, SKILL_RESOURCES

# Define Required Skills per Role (Gap Analysis)
ROLE_SKILLS = {
    "Data Scientist": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Scikit-Learn"],
    "Data Analyst": ["Excel", "SQL", "Tableau", "Python", "Data Visualization"],
    "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
    "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "API Design"],
    "Full Stack Developer": ["React", "Node.js", "MongoDB", "Express", "MERN Stack"],
    "Machine Learning Engineer": ["Python", "TensorFlow", "Deep Learning", "MLOps", "Docker"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
    "Android Developer": ["Java", "Kotlin", "Android Studio", "XML", "Firebase"],
}

# Define Project Ideas per Role
ROLE_PROJECTS = {
    "Data Scientist": ["Customer Churn Prediction Model", "Movie Recommendation System", "Stock Price Predictor"],
    "Data Analyst": ["Sales Dashboard in Tableau", "E-commerce Data Analysis with SQL", "COVID-19 Impact Report"],
    "Frontend Developer": ["Personal Portfolio Website", "Weather App using API", "E-commerce Landing Page"],
    "Backend Developer": ["RESTful API for Blog", "User Authentication System", "Chat Application Backend"],
    "Full Stack Developer": ["MERN Stack E-commerce Store", "Social Media Clone", "Real-time Task Manager"],
    "Machine Learning Engineer": ["Image Classification App", "Sentiment Analysis Tool", "Voice Assistant Pivot"],
    "DevOps Engineer": ["CI/CD Pipeline for Web App", "Dockerized Microservices Deployment", "AWS Infrastructure Setup"],
    "Android Developer": ["To-Do List App", "Weather Forecast App", "Chat App using Firebase"],
}

@app.post("/api/predict/skill-match")
async def predict_skill_match(data: SkillMatchInput):
    user_skills_lower = set([s.lower().strip() for s in data.skills])
    
    # 1. Basic Related Skills (Always provided)
    related_skills = get_related_skills(data.skills)
    
    # 2. Role-Based Analysis (If Target Role selected)
    analysis = None
    target_role = data.target_role

    if target_role and target_role in ROLE_SKILLS:
        required_skills = ROLE_SKILLS[target_role]
        required_lower = {s.lower() for s in required_skills}
        
        # Calculate Matches
        matched = [s for s in required_skills if s.lower() in user_skills_lower]
        missing = [s for s in required_skills if s.lower() not in user_skills_lower]
        
        # Score calculation
        score = int((len(matched) / len(required_skills)) * 100) if required_skills else 0
        
        # Project Ideas
        projects = ROLE_PROJECTS.get(target_role, ["Build a Portfolio Project", "Contribute to Open Source"])
        
        analysis = {
            "role": target_role,
            "match_score": score,
            "matched_skills": matched,
            "missing_skills": missing,
            "projects": projects
        }

    # Combined list for resources (Input + Related + Missing if any)
    skills_to_fetch_resources = list(set(data.skills + related_skills + (analysis["missing_skills"] if analysis else [])))
    resources = get_learning_resources(skills_to_fetch_resources)
    
    return {
        "recommended_skills": related_skills,
        "all_skills": skills_to_fetch_resources,
        "resources": resources,
        "analysis": analysis # New field
    }

# --- 6. Resume Analysis (Gap Analysis) ---
class ResumeAnalysisInput(BaseModel):
    skills: List[str]
    jd_text: str
    jd_text: str
    target_company: Optional[str] = "a Top Tech Company"
    email: Optional[str] = None

@app.post("/api/analyze-resume")
async def analyze_resume(data: ResumeAnalysisInput):
    # Log Activity
    if data.email:
        log_activity(data.email, "resume_gap_analysis", {
            "target_company": data.target_company,
            "skills_count": len(data.skills)
        })

    from llm_utils import get_ai_json
    
    prompt = f"""
    Act as an Expert Recruiter and Career Coach. 
    Analyze the candidate's skills against the Job Description and the culture/expectations of the Target Company.

    Candidate Skills: {", ".join(data.skills)}
    Job Description: "{data.jd_text[:1500]}..."
    Target Company: "{data.target_company}"

    Provide a professional analysis including:
    1. A match score (0-100) based on how well their skills fit the JD and the company's typical standards.
    2. A list of skills that are matched.
    3. A list of critical skills mentioned in the JD that are MISSING from the candidate's profile.
    4. 3-4 specific pieces of advice (verbal feedback) tailored to the company (e.g., "Google values scale; highlight your experience with large datasets").
    
    Output JSON format:
    {{
        "score": 85,
        "matched_skills": ["Skill1", "Skill2"],
        "missing_skills": ["Skill3", "Skill4"],
        "advice": ["Advice 1", "Advice 2"],
        "jd_skills_detected": ["Skill1", "Skill2", "Skill3", "Skill4"]
    }}
    """
    
    try:
        analysis = get_ai_json(prompt)
        if not analysis:
            raise Exception("Gemini returned empty JSON")
            
        # Get learning resources for missing skills
        analysis["resources"] = get_learning_resources(analysis.get("missing_skills", []))
        return analysis
        
    except Exception as e:
        print(f"Error in analyze_resume: {e}")
        # Fallback to simple logic if Gemini fails
        jd_skills = [s.lower() for s in data.skills] # Placeholder logic
        return {
            "score": 70,
            "matched_skills": data.skills,
            "missing_skills": ["System Design", "Cloud Architecture"],
            "advice": ["Your core skills are strong.", "Consider adding more projects."],
            "jd_skills_detected": data.skills + ["System Design"],
            "resources": get_learning_resources(["System Design"])
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
class PrepRequest(BaseModel):
    role: str = "Software Engineer"
    history: list = []
from question_bank import get_aptitude_question, get_technical_question, get_coding_problem, get_interview_question

@app.post("/api/prep/aptitude")
async def get_aptitude(request: PrepRequest):
    from llm_utils import get_ai_json
    prompt = f"""
    Generate 1 short but highly challenging logic or mathematical aptitude question for a {request.role} role. 
    Keep it strictly plain text (NO LaTeX, NO dollar signs, NO complex symbols).
    Focus on brain teasers, probability, or sequence logic.
    Output JSON format: {{'q': 'Concise question text', 'options': ['A', 'B', 'C', 'D'], 'correct': 'The correct option text'}}
    """

    return get_ai_json(prompt, fallback_data=get_aptitude_question())


@app.post("/api/prep/technical")
async def get_technical(request: PrepRequest):
    from llm_utils import get_ai_json
    prompt = f"""
    Generate 1 core technical interview question for a {request.role} role. 
    Keep it strictly plain text (NO LaTeX). 
    Include 4 options and the correct answer. 
    Output JSON format: {{'q': 'The question text', 'options': ['A', 'B', 'C', 'D'], 'correct': 'The correct option value'}}
    """

    return get_ai_json(prompt, fallback_data=get_technical_question())


@app.post("/api/prep/coding")
async def get_coding(request: PrepRequest):
    from llm_utils import get_ai_json
    prompt = f"""
    Generate 1 concise coding/algorithmic problem statement for a {request.role} interview. 
    Focus on logic or DSA. 
    Strictly plain text (NO LaTeX).
    Output JSON format: {{'problem': 'The problem text'}}
    """

    return get_ai_json(prompt, fallback_data={"problem": get_coding_problem()})


@app.post("/api/prep/interview")
async def get_interview(request: PrepRequest):
    from llm_utils import get_ai_json
    prompt = f"Generate 1 high-quality behavioral or situational interview question for a {request.role} role. Strictly plain text. Output JSON: {{'question': 'The question text'}}"
    return get_ai_json(prompt, fallback_data={"question": get_interview_question()})


@app.post("/api/prep/interview/analyze")
async def analyze_interview(request: PrepRequest):
    from llm_utils import get_ai_json
    import random
    
    # Format history for the prompt
    history_str = "\n".join([
        f"- Round: {h.get('round', 'N/A')}, Correct: {h.get('isCorrect', 'N/A')}, Question: {h.get('question', 'N/A')}, Answer: {h.get('answer', 'N/A')}, Problem: {h.get('problem', 'N/A')}, Solution: {h.get('solution', 'N/A')}"
        for h in request.history
    ])

    prompt = f"""
    Act as an AI Interviewer. The candidate just finished a multi-stage assessment for the role of '{request.role}'.
    
    Assessment History:
    {history_str}
    
    Generate a holistic performance report based on their performance across all rounds.
    Be specific in the 'feedback' section about which rounds they excelled in and where they struggled (e.g., "Excelled in Aptitude but struggled with Coding logic").
    
    Output JSON format:
    {{
        "status": "Hired" or "Shortlisted" or "Rejected",
        "score": number (0-100),
        "feedback": ["Detailed feedback points considering multi-stage performance"],
        "companies": ["Top companies that would hire this profile"],
        "focus_areas": ["Areas to improve if not hired"],
        "stage_summary": [
            {{"round": "Aptitude", "status": "Passed/Failed/Attempted", "details": "Short comment"}},
            {{"round": "Technical", "status": "...", "details": "..."}},
            {{"round": "Coding", "status": "...", "details": "..."}}
        ],
        "graph_data": [
            {{"subject": "Technical", "A": number (50-150), "fullMark": 150}},
            {{"subject": "Communication", "A": number (50-150), "fullMark": 150}},
            {{"subject": "Problem Solving", "A": number (50-150), "fullMark": 150}},
            {{"subject": "Confidence", "A": number (50-150), "fullMark": 150}},
            {{"subject": "Culture Fit", "A": number (50-150), "fullMark": 150}}
        ]
    }}
    """
    
    try:
        report = get_ai_json(prompt)
        if report: return report
    except:
        pass

    # Fallback to random if Gemini fails
    status = random.choice(["Hired", "Shortlisted", "Rejected"])
    score = random.randint(40, 95)
    return {
        "status": status,
        "score": score,
        "feedback": ["Good effort", "Need more clarity"],
        "companies": ["Tech Corp", "Dev Solutions"],
        "focus_areas": ["System Design", "HR basics"],
        "graph_data": [
            {"subject": "Technical", "A": random.randint(50, 150), "fullMark": 150},
            {"subject": "Communication", "A": random.randint(50, 150), "fullMark": 150},
            {"subject": "Problem Solving", "A": random.randint(50, 150), "fullMark": 150},
            {"subject": "Confidence", "A": random.randint(50, 150), "fullMark": 150},
            {"subject": "Culture Fit", "A": random.randint(50, 150), "fullMark": 150}
        ]
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

class CompanyPrepRequest(BaseModel):
    company_type: str # "Product" or "Service"
    company_name: str # e.g. "Google", "TCS"
    company_type: str # "Product" or "Service"
    company_name: str # e.g. "Google", "TCS"
    time_period: Optional[str] = "4 Weeks"
    email: Optional[str] = None

@app.post("/api/company-prep")
async def get_company_prep_plan(request: CompanyPrepRequest):
    # Log Activity
    if request.email:
        log_activity(request.email, "company_prep_plan", {
            "company": request.company_name, 
            "type": request.company_type
        })

    try:
        plan = generate_company_prep_plan(request.company_type, request.company_name, request.time_period)
        
        if not plan or "error" in plan:
            return {"success": False, "message": plan.get("error", "Failed to generate plan due to AI quota or error.") if plan else "Empty response from AI."}
            
        return {"success": True, "plan": plan}
    except Exception as e:
        print(f"Error generating company prep plan: {e}")
        return {"success": False, "message": "Failed to generate plan"}

class ReportCardRequest(BaseModel):
    report_data: dict

@app.post("/api/report/analyze")
async def analyze_report_card(request: ReportCardRequest):
    from llm_utils import generate_report_card_analysis
    try:
        report = generate_report_card_analysis(request.report_data)
        return report
    except Exception as e:
        print(f"Error generating report card: {e}")
        return {"grade": "N/A", "summary": "Error generating report.", "strengths": [], "weaknesses": [], "action_plan": [], "final_verdict": "Try again later."}

class HistoryReportRequest(BaseModel):
    email: str

@app.post("/api/report/generate-from-history")
async def generate_report_from_history(request: HistoryReportRequest):
    try:
        # 1. Fetch History
        history = get_user_activity(request.email)
        
        # 2. Prepare Data for LLM
        # We summarize the history to pass meaningful context
        summary_data = {
            "total_activities": len(history),
            "recent_actions": history[-10:] if history else [],
            "unique_features_used": list(set([h['type'] for h in history]))
        }
        
        # 3. Generate Analysis
        report = generate_report_card_analysis(summary_data)
        return report
    except Exception as e:
        print(f"Error generating history report: {e}")
        return {"error": str(e)}

class PDFDownloadRequest(BaseModel):
    report_data: dict

@app.post("/api/report/download-pdf")
async def download_report_pdf(request: PDFDownloadRequest):
    try:
        # Generate PDF using FPDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        data = request.report_data
        
        # Header
        pdf.set_font("Arial", 'B', 24)
        pdf.cell(200, 20, txt="Smart Career Report Card", ln=True, align='C')
        pdf.ln(10)
        
        # Scores
        pdf.set_font("Arial", 'B', 16)
        pdf.cell(200, 10, txt=f"Readiness Score: {data.get('readiness_score', 'N/A')}/100", ln=True)
        pdf.cell(200, 10, txt=f"Status: {data.get('status_label', 'N/A')}", ln=True)
        pdf.ln(10)
        
        # Breakdown
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, txt="Score Breakdown:", ln=True)
        pdf.set_font("Arial", size=12)
        breakdown = data.get("score_breakdown", {})
        for k, v in breakdown.items():
            pdf.cell(200, 8, txt=f"- {k}: {v}", ln=True)
        pdf.ln(10)
        
        # Summary
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, txt="Final Verdict:", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.multi_cell(0, 8, txt=data.get("final_verdict", data.get("final_summary", "No summary provided.")))
        pdf.ln(10)
        
        # Plan
        pdf.set_font("Arial", 'B', 14)
        pdf.cell(200, 10, txt="Improvement Plan (Next Steps):", ln=True)
        pdf.set_font("Arial", size=12)
        plan = data.get("improvement_plan", {})
        
        # Flatten plan for PDF
        for period, tasks in plan.items():
             pdf.set_font("Arial", 'B', 12)
             pdf.cell(200, 8, txt=f"{period.replace('_', ' ').title()}:", ln=True)
             pdf.set_font("Arial", size=12)
             for t in tasks:
                 task_str = t.get('task', str(t))
                 pdf.cell(200, 8, txt=f"  - {task_str}", ln=True)

        # Output to file
        filename = f"Career_Report_{int(datetime.now().timestamp())}.pdf"
        filepath = os.path.join(os.path.dirname(__file__), filename)
        pdf.output(filepath)
        
        # Return file
        from fastapi.responses import FileResponse
        return FileResponse(filepath, filename=filename, media_type='application/pdf')

    except Exception as e:
        print(f"Error generating PDF: {e}")
        # Return error as JSON if PDF fails (though endpoint expects file, frontend should handle)
        return {"error": str(e)}




# --- ChatBot Implementation ---

class ChatQueryRequest(BaseModel):
    query: str

@app.post("/api/chat-query")
async def chat_query(request: ChatQueryRequest):
    from llm_utils import get_ai_json
    
    prompt = f"""
    Act as a friendly Career Assistant. User asks: "{request.query}"
    
    Provide a helpful response. If the user asks for jobs, suggest 2-3 relevant roles.
    
    Output JSON format:
    {{
        "response": "The text response (keep it concise and encouraging)",
        "roles": [
            {{ "job_title": "Title", "description": "Short desc", "apply_link": "https://linkedin.com/jobs/search/?keywords=Title" }}
        ],
        "suggestions": ["Next question 1", "Next question 2"]
    }}
    """
    
    # Use optimized get_ai_json (uses gemini-1.5-flash-8b for speed)
    return get_ai_json(prompt, temperature=0.7, fallback_data={
        "response": "I'm having trouble connecting to the AI right now, but I can still help you browse jobs!",
        "roles": [],
        "suggestions": ["Search Jobs", "Upload Resume"]
    })

@app.post("/api/chat-analyze")
async def chat_analyze(file: UploadFile = File(...)):
    from llm_utils import get_ai_json
    from parsing import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt

    try:
        # Extract Text
        content = ""
        suffix = f".{file.filename.split('.')[-1]}" if '.' in file.filename else ".tmp"
        
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            shutil.copyfileobj(file.file, temp)
            temp_path = temp.name
            
        try:
            if file.filename.endswith(".pdf"):
                with open(temp_path, "rb") as f: content = extract_text_from_pdf(f)
            elif file.filename.endswith(".docx"):
                 content = extract_text_from_docx(temp_path) # docx lib handles path
            else:
                 with open(temp_path, "r", encoding="utf-8") as f: content = f.read()
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        if not content:
            return {"response": "I couldn't read the file content. Please try a different file.", "roles": []}

        prompt = f"""
        Analyze this resume content contextually:
        {content[:3000]}... (truncated)
        
        1. Summarize the profile briefly.
        2. Suggest 3 best-fit job roles based on skills.
        
        Output JSON format:
        {{
            "response": "Overview of the profile and why these roles fit.",
            "roles": [
                {{ "job_title": "Title", "description": "Why this fits", "apply_link": "https://linkedin.com/jobs/search/?keywords=Title" }}
            ],
             "suggestions": ["How to improve resume", "Mock Interview"]
        }}
        """
        
        return get_ai_json(prompt, temperature=0.5, fallback_data={
            "response": "I see your resume! It looks great. You might be a good fit for Software Engineering roles.",
            "roles": [{ "job_title": "Software Engineer", "description": "Based on general keywords", "apply_link": "#" }],
            "suggestions": []
        })

    except Exception as e:
        print(f"Chat Analyze Error: {e}")
        return {"response": "Error analyzing file.", "roles": []}

# --- HR Emailer (Auto Mate Mail) Implementation ---

class HREmailGenerateRequest(BaseModel):
    hr_name: str
    company: str
    user_name: str
    skills: List[str]
    target_role: str

@app.post("/api/hr-emailer/analyze")
async def hr_emailer_analyze(file: UploadFile = File(...)):
    from llm_utils import get_ai_json
    from parsing import extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt

    try:
        content = ""
        suffix = f".{file.filename.split('.')[-1]}" if '.' in file.filename else ".tmp"
        with NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            shutil.copyfileobj(file.file, temp)
            temp_path = temp.name
            
        try:
            if file.filename.endswith(".pdf"):
                with open(temp_path, "rb") as f: content = extract_text_from_pdf(f)
            elif file.filename.endswith(".docx"):
                 content = extract_text_from_docx(temp_path)
            else:
                 with open(temp_path, "r", encoding="utf-8") as f: content = f.read()
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

        if not content:
            return {"error": "Could not extract text from resume"}

        prompt = f"""
        Extract professional details from this resume:
        {content[:4000]}
        
        Output JSON format:
        {{
            "name": "Full Name",
            "skills": ["Skill1", "Skill2", "Skill3"],
            "summary": "1-sentence professional summary",
            "suggested_roles": ["Role1", "Role2"]
        }}
        """
        
        return get_ai_json(prompt, temperature=0.3, fallback_data={
            "name": "Priyabrata Biswal",
            "skills": ["Python", "Machine Learning", "React"],
            "summary": "Aspiring engineer with focus on AI and Web Dev.",
            "suggested_roles": ["Data Analyst", "Software Engineer"]
        })

    except Exception as e:
        print(f"HR Emailer Analyze Error: {e}")
        return {"error": str(e)}

@app.post("/api/hr-emailer/generate-email")
async def hr_emailer_generate_email(request: HREmailGenerateRequest):
    from llm_utils import get_ai_json
    
    prompt = f"""
    Generate a professional and concise job application email.
    HR Name: {request.hr_name}
    Company: {request.company}
    User Name: {request.user_name}
    User Skills: {", ".join(request.skills)}
    Target Role: {request.target_role}
    
    The email should be warm, professional, and mention the resume is attached.
    
    Output JSON format:
    {{
        "email_content": "The full email body text"
    }}
    """
    
    return get_ai_json(prompt, temperature=0.7, fallback_data={
        "email_content": f"Hello {request.hr_name},\n\nI’m {request.user_name}, a fresher with skills in {', '.join(request.skills)} and strong projects. I’m applying for the {request.target_role} role at {request.company}.\n\nMy resume is attached.\nThank you for your time.\n\nRegards,\n{request.user_name.split(' ')[0]}"
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

