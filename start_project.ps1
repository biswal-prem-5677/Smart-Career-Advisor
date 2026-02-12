  # Smart Career Advisor - Startup Script
Set-Location $PSScriptRoot

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "      Smart Career Advisor Setup & Launcher" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# Check for VS Code environment
if ($env:TERM_PROGRAM -eq "vscode") {
    Write-Host ">>> VS Code Integrated Terminal Detected." -ForegroundColor Cyan
    Write-Host ">>> TIP: You can also press [F5] to launch using the VS Code Debugger." -ForegroundColor DarkCyan
}

# 0. Health Check: .env files
Write-Host "[0/5] Checking Configuration..." -ForegroundColor Yellow
if (!(Test-Path "backend/.env")) {
    Write-Host "Warning: backend/.env not found! AI features and Email OTP may not work." -ForegroundColor DarkYellow
} else {
    Write-Host "Found backend/.env config." -ForegroundColor Green
}

# 1. Check Python
Write-Host "[1/5] Checking Python Environment..." -ForegroundColor Yellow
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Python is not installed or not in PATH." -ForegroundColor Red
    Pause
    Exit
}

# 2. Virtual Environment Support
# if (Test-Path ".venv/Scripts/Activate.ps1") {
#     Write-Host "Activating virtual environment (.venv)..." -ForegroundColor Green
#     . .venv/Scripts/Activate.ps1
# # } elseif (Test-Path "myfirstproject/Scripts/Activate.ps1") {
# #     Write-Host "Activating virtual environment (myfirstproject)..." -ForegroundColor Green
# #     . myfirstproject/Scripts/Activate.ps1
# } else {
#     Write-Host "No virtual environment detected. Proceeding with global Python." -ForegroundColor Yellow
# }

# 3. Install Python Deps
Write-Host ""
Write-Host "[2/5] Syncing Python Dependencies..." -ForegroundColor Yellow
python -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) {
    Write-Host "Warning: Some dependencies failed to install. Check requirements.txt." -ForegroundColor DarkYellow
}

# 4. Setup Frontend
Write-Host ""
Write-Host "[3/5] Syncing Frontend Dependencies..." -ForegroundColor Yellow
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "node_modules missing, installing (this may take a minute)..." -ForegroundColor Cyan
    Set-Location frontend
    npm install
    Set-Location ..
} else {
    Write-Host "Found node_modules, proceeding..." -ForegroundColor Gray
}

# 5. Start Services
Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "      Starting Services (Logs in New Windows)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Start Backend
Write-Host "[4/5] Launching Backend Server..." -ForegroundColor Yellow
$backendCommand = "uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; Write-Host 'Backend Logs'; Write-Host 'Running on: http://localhost:8000'; $backendCommand"

# Start Frontend
Write-Host ""
Write-Host "[5/5] Launching Frontend Server..." -ForegroundColor Yellow
$frontendCommand = "npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot/frontend'; Write-Host 'Frontend Logs'; Write-Host 'Running on: http://localhost:5173'; $frontendCommand"

Write-Host ""
Write-Host "✅ Application is LIVE!" -ForegroundColor Green
Write-Host "🔗 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔗 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

# Automatically open the app in the browser
Write-Host "Opening web browser..." -ForegroundColor Gray
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "You can now view logs in the two new PowerShell windows."
Write-Host "Press any key to close this launcher..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
