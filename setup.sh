#!/bin/bash

echo "======================================="
echo "   Smart Career Advisor Setup Script   "
echo "======================================="

# 1. Install Backend Dependencies
echo "[1/4] Installing Python Dependencies..."
pip install -r requirements.txt

# 2. Install Frontend Dependencies
echo "[2/4] Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo "---------------------------------------"
echo "Setup Complete!"
echo "---------------------------------------"
echo "Starting Servers..."

# 3. Start Backend (in background)
echo "[3/4] Starting Backend (FastAPI) on Port 8000..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 4. Start Frontend
echo "[4/4] Starting Frontend (Vite)..."
cd frontend
npm run dev

# Cleanup function to kill backend when script exits
trap "kill $BACKEND_PID" EXIT


# Option 1: The "One-Click" Script (Recommended)
# This method automatically installs dependencies and launches both servers for you.

# Open your VS Code Terminal (`Ctrl + ``).
# Make sure you are in the project root folder.
# Run the following command:
# powershell
# .\setup.bat
# This will open a new window for the Backend and keep the Frontend running in your VS Code terminal.
# Option 2: The Manual "Professional" Way (Split Terminal)
# If you prefer to see both logs inside VS Code side-by-side:

# Open two terminal instances in VS Code (click the + icon or split button in the terminal panel).
# Terminal 1 (Backend):
# powershell
# # Make sure you are in the root directory
# python backend/main.py
# You should see: Uvicorn running on [http://0.0.0.0](http://0.0.0.0):8000
# Terminal 2 (Frontend):
# powershell
# cd frontend
# npm run dev
# You should see: Local: http://localhost:5173/
# Once running, Ctrl + Click on the Frontend URL (http://localhost:5173) to open the app.