# MoneyAssist Backend Setup Script
# This script will help setup Laravel backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MoneyAssist Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will guide you through setting up the Laravel backend." -ForegroundColor Yellow
Write-Host ""

# Check if Laravel is installed
Write-Host "Checking for Laravel installer..." -ForegroundColor Yellow
$laravelInstalled = Get-Command laravel -ErrorAction SilentlyContinue

if (-not $laravelInstalled) {
    Write-Host "Laravel installer not found. Installing..." -ForegroundColor Yellow
    composer global require laravel/installer
}

Write-Host ""
Write-Host "Creating Laravel project..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
Write-Host ""

# Create Laravel project
Set-Location "moneyassist-backend"
composer create-project laravel/laravel . "11.*"

Write-Host ""
Write-Host "Installing additional dependencies..." -ForegroundColor Yellow

# Install additional packages
composer require tymon/jwt-auth
composer require intervention/image
composer require laravel/sanctum

Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Yellow

# Create .env content
$envContent = @"
APP_NAME=MoneyAssist
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@moneyassist.com"
MAIL_FROM_NAME="{APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

GEMINI_API_KEY=
GEMINI_MODEL=gemini-pro

JWT_SECRET=
JWT_ALGO=HS256
JWT_TTL=3600
"@

Set-Content -Path ".env" -Value $envContent

Write-Host ""
Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update .env file with your database credentials" -ForegroundColor White
Write-Host "2. Update .env file with your Gemini API key" -ForegroundColor White
Write-Host "3. Create database: createdb moneyassist" -ForegroundColor White
Write-Host "4. Run migrations: php artisan migrate" -ForegroundColor White
Write-Host "5. Start server: php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Run 'setup-backend-files.ps1' to generate:" -ForegroundColor Yellow
Write-Host "  - Models" -ForegroundColor White
Write-Host "  - Controllers" -ForegroundColor White
Write-Host "  - Migrations" -ForegroundColor White
Write-Host "  - Services" -ForegroundColor White
Write-Host ""
