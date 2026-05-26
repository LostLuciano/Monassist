# MoneyAssist Backend Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

1. **PHP 8.2 or higher**
   - Download from: https://windows.php.net/download/
   - Or use XAMPP/Laragon which includes PHP

2. **Composer** (PHP Package Manager)
   - Download from: https://getcomposer.org/download/
   - Run the installer and follow the instructions

3. **PostgreSQL 14 or higher**
   - Download from: https://www.postgresql.org/download/windows/
   - Or use the version included in XAMPP/Laragon

4. **Git** (Optional but recommended)
   - Download from: https://git-scm.com/download/win

## Installation Steps

### Step 1: Install Composer

1. Download Composer installer from https://getcomposer.org/Composer-Setup.exe
2. Run the installer
3. Follow the installation wizard
4. Verify installation:
   ```bash
   composer --version
   ```

### Step 2: Create Laravel Project

```bash
cd MoneyAssist
composer create-project laravel/laravel moneyassist-backend
cd moneyassist-backend
```

### Step 3: Install Required Packages

```bash
# Laravel Sanctum for API authentication
composer require laravel/sanctum

# Laravel Telescope for debugging (optional, dev only)
composer require laravel/telescope --dev

# Google Gemini API Client
composer require google/generative-ai-php

# Image intervention for receipt processing
composer require intervention/image

# Laravel Excel for import/export
composer require maatwebsite/excel

# CORS support
composer require fruitcake/laravel-cors
```

### Step 4: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Generate application key:
   ```bash
   php artisan key:generate
   ```

3. Configure database in `.env`:
   ```env
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=moneyassist
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   ```

4. Add Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Configure CORS:
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

### Step 5: Create Database

Using PostgreSQL command line or pgAdmin:

```sql
CREATE DATABASE moneyassist;
```

### Step 6: Run Migrations

```bash
php artisan migrate
```

### Step 7: Seed Database (Optional)

```bash
php artisan db:seed
```

### Step 8: Start Development Server

```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

## Project Structure

```
moneyassist-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── GoalController.php
│   │   │   ├── ChatController.php
│   │   │   └── RecommendationController.php
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   ├── Category.php
│   │   ├── SavingsGoal.php
│   │   ├── ChatMessage.php
│   │   └── Recommendation.php
│   └── Services/
│       ├── GeminiService.php
│       ├── FinancialAnalysisService.php
│       └── RecommendationService.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── api.php
│   └── web.php
└── config/
```

## API Endpoints

All API endpoints are prefixed with `/api`

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/profile` - Update profile

### Transactions
- GET `/api/transactions` - Get all transactions
- POST `/api/transactions` - Create transaction
- GET `/api/transactions/{id}` - Get single transaction
- PUT `/api/transactions/{id}` - Update transaction
- DELETE `/api/transactions/{id}` - Delete transaction
- GET `/api/transactions/statistics` - Get statistics
- POST `/api/transactions/{id}/receipt` - Upload receipt

### Goals
- GET `/api/goals` - Get all goals
- POST `/api/goals` - Create goal
- GET `/api/goals/{id}` - Get single goal
- PUT `/api/goals/{id}` - Update goal
- DELETE `/api/goals/{id}` - Delete goal
- POST `/api/goals/{id}/progress` - Update progress

### Chat & AI
- POST `/api/chat/message` - Send chat message
- GET `/api/chat/history` - Get chat history
- POST `/api/chat/voice` - Process voice note
- POST `/api/chat/receipt` - Process receipt image

### Recommendations
- GET `/api/recommendations` - Get recommendations
- POST `/api/recommendations/refresh` - Refresh recommendations

## Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=AuthTest
```

## Deployment

### Production Checklist

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Run `php artisan view:cache`
6. Set up proper database credentials
7. Configure proper CORS settings
8. Set up SSL certificate
9. Configure queue workers
10. Set up scheduled tasks

## Troubleshooting

### Composer not found
- Ensure Composer is installed and added to PATH
- Restart terminal after installation

### Database connection failed
- Check PostgreSQL is running
- Verify database credentials in `.env`
- Ensure database exists

### Permission denied errors
- Run: `chmod -R 775 storage bootstrap/cache` (Linux/Mac)
- Or give write permissions to storage and bootstrap/cache folders (Windows)

### CORS errors
- Check `config/cors.php` settings
- Verify `FRONTEND_URL` in `.env`
- Clear config cache: `php artisan config:clear`

## Additional Resources

- Laravel Documentation: https://laravel.com/docs
- Laravel Sanctum: https://laravel.com/docs/sanctum
- Google Gemini API: https://ai.google.dev/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/

## Support

For issues or questions, refer to:
- API_DOCUMENTATION.md for API details
- DATABASE_SCHEMA.md for database structure
- TECHNICAL_ARCHITECTURE.md for system design
