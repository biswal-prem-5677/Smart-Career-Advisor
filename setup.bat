@echo off
title Smart Career Advisor - AI Powered Job & Placement Platform

echo ===================================================
echo       Smart Career Advisor Setup ^& Launcher
echo       (Updated for VS Code ^& AI Features)
echo ===================================================

echo.
echo [1/5] Checking Python Environment...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH.
    pause
    exit /b
)

:: Virtual Environment Support
if exist .venv (
    echo [OK] Using virtual environment (.venv)...
    call .venv\Scripts\activate
) else if exist myfirstproject\Scripts\activate.bat (
    echo [OK] Using virtual environment (myfirstproject)...
    call myfirstproject\Scripts\activate.bat
) else (
    echo [!] No virtual environment detected. Recommended: python -m venv .venv
)

echo.
echo [2/5] Installing/Updating Python Dependencies...
pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install Python dependencies.
    pause
)

echo.
echo [3/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo [WAIT] Installing npm dependencies...
    call npm install
) else (
    echo [OK] node_modules found.
)
cd ..

echo.
echo ===================================================
echo       Launching Application Services
echo ===================================================
echo.

echo [4/5] Launching Backend Server (New Window)...
:: Start backend in a NEW window so logs are visible
start "Smart Career Advisor - BACKEND" cmd /k "color 0A && echo Backend Running on http://localhost:8000 && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [5/5] Launching Frontend Server...
cd frontend
echo Frontend starting on http://localhost:5173
npm run dev

