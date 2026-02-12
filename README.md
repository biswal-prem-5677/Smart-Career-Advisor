# Smart Career Advisor 
### AI-Powered Career Decision Engine (Hackathon Project)

Smart Career Advisor is a full-stack AI platform that guides a student through the complete career journey:

**Resume → Skill Gap → Job Search → Resume Builder → Job Prep → Roadmaps → Company Prep → ML Predictions → Final Report Card**

Unlike fragmented platforms (resume checkers, job portals, course sites), Smart Career Advisor works as a single **Career Decision Engine** that produces a measurable **Career Readiness Score**, explainable gaps, and actionable plans.

---

##   Key Features

###   Dashboard (Resume vs JD Analyzer)
- Upload **Resume + Job Description**
- Extracts text and skills using NLP
- Computes similarity score using:
  - CountVectorizer
  - Cosine similarity
- Generates:
  - Matched Skills
  - Missing Skills
  - Projects to add
  - Learning resources
- Live graphs and visual analytics

---

###   Find Jobs (Domain Job Explorer)
- Shows jobs available across domains
- Displays vacancy counts per role
- Uses dataset/API-based filtering

---

###   Resume Builder
- Generates premium resume based on Q&A
- Produces downloadable HTML resume
- AI resume enhancer suggests improvements

---

###   Job Prep
- Interview preparation module
- Generates:
  - Technical questions (based on JD)
  - Aptitude questions
  - Coding challenges
  - Mock interview feedback

---

###   Success Roadmap
- Time-based roadmap:
  - 7 days
  - 30 days
  - 90 days
- Provides structured weekly tasks

---

###   Career Roadmap
- Domain-based learning roadmap
- Phases:
  - Foundation → Intermediate → Specialization → Projects → Interview

---

###   Company Prep
- Company-specific preparation module
- Provides:
  - Last 3 years hiring pattern
  - Interview rounds & difficulty
  - 7-week crack plan
  - Required skills + core subjects

---

###   Model Prediction Hub (ML/DL)
Includes 5 prediction models:
1. Placement Prediction  
2. Job Role Prediction  
3. Salary Prediction  
4. Domain Fit Prediction  
5. Skill Match Prediction  

Each model provides:
- Prediction label
- Confidence score

---

###   Report Card (Final Decision Engine)
The most important module.

- Tracks usage across all modules
- Calculates Career Readiness Score (0–100)
- Shows:
  - Before improvement snapshot
  - Gap analysis + explainability
  - Improvement plan (7/30/90 days)
  - Future snapshot after improvements
- Downloadable final report

---

##   Project Architecture (Basic pre-implementation )

Smart-Career-Advisor/
│
├── frontend/ # React + Tailwind UI
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── api/
│ │ ├── context/
│ │ └── App.jsx
│ └── package.json
│
├── backend/ # FastAPI backend
│ ├── main.py # API entry point
│ ├── requirements.txt # Python dependencies
│ └── src/
│ ├── llm_utils.py
│ ├── resume_generator.py
│ ├── llm_enhancer.py
│ ├── jobrole.py
│ ├── salary.py
│ ├── domainfit.py
│ └── jobmatch.py
│
└── README.md

---

## ⚙️ Tech Stack

### Frontend
- React + Vite
- TailwindCSS
- Axios
- Recharts (graphs)
- Lucide Icons
- Retell Voice Assistant SDK

### Backend
- FastAPI
- Pydantic
- spaCy (optional NLP)
- NLTK + CountVectorizer
- NumPy / Pandas
- Pickle (.pkl ML models)

---

##   How to Run the Project

### 1️  Clone the Repository
```bash
git clone <your-repo-link>
cd Smart-Career-Advisor

 API Endpoints (Backend)
Endpoint	Method	Purpose
/api/analyze-files	POST	Resume vs JD analysis
/api/enhance-resume	POST	Resume enhancement
/api/project-ideas	POST	Project suggestions
/api/resume/questions	POST	Interview questions from JD
/api/resume/generate	POST	Generate resume HTML
/api/report/analyze	POST	Report card generation
/api/predict/job-role	POST	Job role prediction
/api/predict/salary	POST	Salary prediction
/api/predict/domain-fit	POST	Domain fit prediction
/api/predict/skill-match	POST	Skill match prediction

Team

Code Crafters

UI/UX Developer

Backend Developer

ML Developer

System Architect & Integrator (Team Lead)

Future Improvements

Live job scraping API

Persistent database for user history

Semantic similarity using transformers

LLM-powered mock interview simulation

Mobile-first UI
