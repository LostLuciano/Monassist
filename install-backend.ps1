# MoneyAssist Backend Installation Script
# This script helps set up the Laravel backend for MoneyAssist

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MoneyAssist Backend Installation" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Composer is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$composerInstalled = Get-Command composer -ErrorAction SilentlyContinue

if (-not $composerInstalled) {
    Write-Host "ERROR: Composer is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Composer first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://getcomposer.org/Composer-Setup.exe" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✓ Composer is installed" -ForegroundColor Green

# Check if PHP is installed
$phpInstalled = Get-Command php -ErrorAction SilentlyContinue

if (-not $phpInstalled) {
    Write-Host "ERROR: PHP is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PHP 8.2 or higher:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://windows.php.net/download/" -ForegroundColor White
    Write-Host "2. Or install XAMPP/Laragon which includes PHP" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

$phpVersion = php -v | Select-String -Pattern "PHP (\d+\.\d+)" | ForEach-Object { $_.Matches.Groups[1].Value }
Write-Host "✓ PHP $phpVersion is installed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Creating Laravel Project" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (Test-Path "moneyassist-backend") {
    Write-Host "Backend directory already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to delete and recreate it? (y/n)"
    if ($overwrite -eq "y") {
        Remove-Item -Recurse -Force moneyassist-backend
        Write-Host "Deleted existing backend directory" -ForegroundColor Green
    } else {
        Write-Host "Skipping Laravel project creation" -ForegroundColor Yellow
        Set-Location moneyassist-backend
    }
}

if (-not (Test-Path "moneyassist-backend")) {
    Write-Host "Creating Laravel project..." -ForegroundColor Yellow
    composer create-project laravel/laravel moneyassist-backend
    Set-Location moneyassist-backend
    Write-Host "✓ Laravel project created" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Installing Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Installing Laravel Sanctum..." -ForegroundColor Yellow
composer require laravel/sanctum

Write-Host "Installing Google Gemini API..." -ForegroundColor Yellow
composer require google/generative-ai-php

Write-Host "Installing Image Intervention..." -ForegroundColor Yellow
composer require intervention/image

Write-Host "Installing Laravel Excel..." -ForegroundColor Yellow
composer require maatwebsite/excel

Write-Host "✓ All dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Environment Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Copy-Item .env.example .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
}

Write-Host "Generating application key..." -ForegroundColor Yellow
php artisan key:generate
Write-Host "✓ Application key generated" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 4: Database Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Please configure your database in .env file:" -ForegroundColor Yellow
Write-Host "DB_CONNECTION=pgsql" -ForegroundColor White
Write-Host "DB_HOST=127.0.0.1" -ForegroundColor White
Write-Host "DB_PORT=5432" -ForegroundColor White
Write-Host "DB_DATABASE=moneyassist" -ForegroundColor White
Write-Host "DB_USERNAME=postgres" -ForegroundColor White
Write-Host "DB_PASSWORD=your_password" -ForegroundColor White
Write-Host ""
Write-Host "Also add your Google Gemini API key:" -ForegroundColor Yellow
Write-Host "GEMINI_API_KEY=your_api_key_here" -ForegroundColor White
Write-Host ""

$configureNow = Read-Host "Do you want to configure database now? (y/n)"

if ($configureNow -eq "y") {
    $dbName = Read-Host "Enter database name (default: moneyassist)"
    if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "moneyassist" }
    
    $dbUser = Read-Host "Enter database username (default: postgres)"
    if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }
    
    $dbPass = Read-Host "Enter database password" -AsSecureString
    $dbPassPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPass)
    )
    
    # Update .env file
    $envContent = Get-Content .env
    $envContent = $envContent -replace "DB_DATABASE=.*", "DB_DATABASE=$dbName"
    $envContent = $envContent -replace "DB_USERNAME=.*", "DB_USERNAME=$dbUser"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPassPlain"
    $envContent | Set-Content .env
    
    Write-Host "✓ Database configuration updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create database: CREATE DATABASE moneyassist;" -ForegroundColor White
Write-Host "2. Run migrations: php artisan migrate" -ForegroundColor White
Write-Host "3. Seed database: php artisan db:seed" -ForegroundColor White
Write-Host "4. Start server: php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "The API will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "For more information, see BACKEND_SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
