@echo off
title Smart Career Advisor - AI Powered Job & Placement Platform

echo ===================================================
echo       Smart Career Advisor Setup & Launcher
echo       (Updated for Model Prediction Features)
echo ===================================================

echo.
echo [1/5] Checking Python Environment...
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed or not in PATH.
    pause
    exit /b
)

echo.
echo [2/5] Installing/Updating Python Dependencies...
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo Error installing Python dependencies.
    pause
    exit /b
)

echo.
echo [3/5] Setting up Frontend...
cd frontend
if exist node_modules (
    echo node_modules found, skipping install...
) else (
    echo Installing npm dependencies...
    call npm install
)
cd ..

echo.
echo ===================================================
echo       Starting Application Services
echo ===================================================
echo.

echo [4/5] Launching Backend Server (New Window)...
:: Using uvicorn CLI for auto-reload during development
start "Smart Career Advisor - BACKEND" cmd /k "color 0A && echo Backend Running on http://localhost:8000 && echo Press Ctrl+C to stop && uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [5/5] Launching Frontend Server...
cd frontend
echo Frontend starting on http://localhost:5173
npm run dev
