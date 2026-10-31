# setup_venv.ps1 - PowerShell script to initialize virtualenv and install dependencies
$ErrorActionPreference = "Stop"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Digital Dark Spot: Virtualenv Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if python exists
$pythonCmd = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $pythonCmd) {
    Write-Error "Python executable not found in PATH. Please install Python 3.10+."
}

# Create virtualenv if not exists
if (-not (Test-Path ".venv")) {
    Write-Host "[1/3] Creating virtual environment (.venv)..." -ForegroundColor Yellow
    python -m venv .venv
} else {
    Write-Host "[1/3] Existing .venv directory found." -ForegroundColor Green
}

# Determine python inside venv
$venvPython = Join-Path (Get-Location) ".venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    $venvPython = Join-Path (Get-Location) ".venv/bin/python"
}

Write-Host "[2/3] Upgrading pip and installing pinned dependencies..." -ForegroundColor Yellow
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r requirements.txt

Write-Host "[3/3] Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To activate the environment:" -ForegroundColor White
Write-Host "  .\.venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "To launch the Streamlit app:" -ForegroundColor White
Write-Host "  streamlit run frontend/app.py" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
