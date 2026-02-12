#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=======================================${NC}"
echo -e "${CYAN}   Smart Career Advisor Setup Script   ${NC}"
echo -e "${CYAN}=======================================${NC}"

# 1. Virtual Environment
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv .venv
fi
source .venv/bin/activate

# 2. Install Backend Dependencies
echo -e "${YELLOW}[1/4] Installing Python Dependencies...${NC}"
pip install --upgrade pip
pip install -r requirements.txt

# 3. Install Frontend Dependencies
echo -e "${YELLOW}[2/4] Installing Frontend Dependencies...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "node_modules already exists, skipping."
fi
cd ..

echo -e "${GREEN}---------------------------------------${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}---------------------------------------${NC}"

# 4. Start Services
echo -e "${CYAN}Starting Servers in side-by-side mode (if using screen/tmux) or standard...${NC}"

echo -e "${YELLOW}[3/4] Starting Backend (FastAPI)...${NC}"
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo -e "${YELLOW}[4/4] Starting Frontend (Vite)...${NC}"
cd frontend
npm run dev

# Cleanup
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