# MoneyAssist - Complete Setup Script
# This script will setup both frontend and backend

param(
    [switch]$Frontend,
    [switch]$Backend,
    [switch]$All
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Text)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Success {
    param([string]$Text)
    Write-Host $Text -ForegroundColor Green
}

function Write-Info {
    param([string]$Text)
    Write-Host $Text -ForegroundColor Yellow
}

function Write-Step {
    param([string]$Text)
    Write-Host "  $Text" -ForegroundColor White
}

# Show banner
Write-Header "MoneyAssist - Complete Setup"

if (-not $Frontend -and -not $Backend -and -not $All) {
    Write-Info "Usage:"
    Write-Step ".\setup-all.ps1 -All          # Setup both frontend and backend"
    Write-Step ".\setup-all.ps1 -Frontend     # Setup frontend only"
    Write-Step ".\setup-all.ps1 -Backend      # Setup backend only"
    Write-Host ""
    exit
}

# Setup Frontend
if ($Frontend -or $All) {
    Write-Header "Setting up Frontend..."
    
    try {
        Write-Info "Running frontend setup script..."
        & .\setup-frontend.ps1
        
        Write-Info "Generating components..."
        & .\setup-components.ps1
        
        Write-Success "Frontend setup completed!"
        Write-Host ""
        Write-Info "Next steps for frontend:"
        Write-Step "1. cd moneyassist-frontend"
        Write-Step "2. npm install"
        Write-Step "3. cp .env.example .env.local"
        Write-Step "4. npm run dev"
        Write-Host ""
    }
    catch {
        Write-Host "Error setting up frontend: $_" -ForegroundColor Red
        exit 1
    }
}

# Setup Backend
if ($Backend -or $All) {
    Write-Header "Setting up Backend..."
    
    Write-Info "Backend setup requires manual steps."
    Write-Host ""
    Write-Info "Please run the following commands:"
    Write-Step "1. composer create-project laravel/laravel moneyassist-backend"
    Write-Step "2. cd moneyassist-backend"
    Write-Step "3. composer require tymon/jwt-auth intervention/image laravel/sanctum"
    Write-Step "4. php artisan key:generate"
    Write-Step "5. Update .env with your database credentials"
    Write-Step "6. createdb moneyassist"
    Write-Step "7. php artisan migrate"
    Write-Step "8. php artisan serve"
    Write-Host ""
    Write-Info "Or run: .\setup-backend.ps1 for guided setup"
    Write-Host ""
}

# Final message
Write-Header "Setup Complete!"

Write-Success "MoneyAssist has been set up successfully!"
Write-Host ""
Write-Info "Documentation:"
Write-Step "- SETUP_INSTRUCTIONS.md - Detailed setup guide"
Write-Step "- README.md - Project overview"
Write-Step "- DOCUMENTATION_INDEX.md - Complete documentation index"
Write-Host ""
Write-Info "Quick Start:"
Write-Step "Frontend: cd moneyassist-frontend && npm run dev"
Write-Step "Backend:  cd moneyassist-backend && php artisan serve"
Write-Host ""
Write-Info "Access URLs:"
Write-Step "Frontend: http://localhost:5173"
Write-Step "Backend:  http://localhost:8000"
Write-Step "API:      http://localhost:8000/api"
Write-Host ""
Write-Success "Happy coding!"
Write-Host ""
