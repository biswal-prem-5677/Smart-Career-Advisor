# How to Run Smart Career Advisor

## Prerequisites
- **Python 3.8+** installed and added to PATH.
- **Node.js 16+** installed and added to PATH.
- **Git** (optional, for cloning).

## Quick Start (Windows)
1. **Double-click** the `start_project.ps1` file.
   - *Note: If PowerShell restricts execution, right-click -> 'Run with PowerShell' or run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` in a terminal first.*

**OR**

2. Run the batch file:
   - Double-click `setup.bat`.

## Manual Start
If dependencies are already installed:

### Backend
1. Open Terminal.
2. `pip install -r requirements.txt` (only needed once).
3. `uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload`.

### Frontend
1. Open a new Terminal.
2. `cd frontend`.
3. `npm install` (only needed once).
4. `npm run dev`.

## Troubleshooting
- **Model not found error**: Ensure you run the script from the root `Smart-Career-Advisor` folder.
- **Port already in use**: Close other terminal windows or change ports in the scripts.
