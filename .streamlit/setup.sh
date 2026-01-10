#!/bin/bash

# ==================================================================================
# 🚀 SMART CAREER ADVISOR - PROJECT MANUAL
# ==================================================================================
# This file serves as both a "Project Map" and a "Run Guide".
# Follow the layout and commands below to run the project correctly in VS Code.

# ==================================================================================
# 📂 1. PROJECT FILE STRUCTURE
# ==================================================================================
# Smart-Career-Advisor/            <-- ROOT DATA FOLDER
# │
# ├── backend/                     <-- [API] Brain of the App (FastAPI)
# │   └── main.py                  <-- Entry Point: Runs on Port 8000
# │
# ├── frontend/                    <-- [UI] User Interface (React + Vite)
# │   ├── src/                     <-- All React Components (.jsx)
# │   ├── public/                  <-- Images & 3D Models
# │   └── package.json             <-- Node Config (runs on Port 5173)
# │
# ├── app/                         <-- [ADMIN] Legacy Dashboard (Streamlit)
# │   └── main.py                  <-- Entry Point: Runs on Port 8501
# │
# ├── src/                         <-- [LOGIC] Shared AI Modules
# │   ├── parsing.py               <-- PDF/DOCX Parser
# │   ├── resume_generator.py      <-- AI Resume Builder
# │   └── parsing.py
# │
# ├── models/                      <-- [AI] Trained Models
# │   ├── xgboost_pipeline.pkl     <-- Placement Prediction Model
# │   └── label_encoder.pkl
# │
# └── requirements.txt             <-- Python Libraries

# ==================================================================================
# 💻 2. HOW TO RUN (MANUAL VS CODE COMMANDS)
# ==================================================================================
# Open Visual Studio Code.
# Open THREE separate terminals (Terminal -> New Terminal, or click '+').

# ----------------------------------------------------------------------------------
# 🟢 TERMINAL 1: START BACKEND (The AI Engine)
# ----------------------------------------------------------------------------------
echo "Step 1: In Terminal 1, run:"
echo "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
echo ""

# ----------------------------------------------------------------------------------
# 🔵 TERMINAL 2: START FRONTEND (The Website)
# ----------------------------------------------------------------------------------
echo "Step 2: In Terminal 2, run:"
echo "cd frontend"
echo "npm run dev"
echo ""

# ----------------------------------------------------------------------------------
# 🟠 TERMINAL 3: START ADMIN PANEL (Optional Streamlit Dashboard)
# ----------------------------------------------------------------------------------
echo "Step 3: In Terminal 3, run:"
echo "python -m streamlit run app/main.py"
echo ""

# ==================================================================================
# ✅ You are now ready to code!
# ==================================================================================