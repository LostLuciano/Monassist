# MoneyAssist Backend - Setup Instructions

## Quick Start (5 Minutes)

### Step 1: Install Dependencies

```powershell
cd MoneyAssist\moneyassist-backend
composer install
```

### Step 2: Configure Environment

```powershell
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

### Step 3: Edit .env File

Open `.env` and update:

```env
APP_NAME=MoneyAssist
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### Step 4: Create Database

Using PostgreSQL:

```sql
CREATE DATABASE moneyassist;
```

### Step 5: Run Migrations

```powershell
php artisan migrate
```

### Step 6: Publish Sanctum

```powershell
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Step 7: Start Server

```powershell
php artisan serve
```

✅ Backend is now running at: `http://localhost:8000`

---

## Full Setup Guide

### Prerequisites

1. **PHP 8.2+**
   - Verify: `php --version`
   - Should show PHP 8.2 or higher

2. **Composer**
   - Verify: `composer --version`
   - Should show Composer 2.x

3. **PostgreSQL 12+**
   - Download: https://www.postgresql.org/download/
   - Verify: `psql --version`

4. **Node.js 18+** (for frontend)
   - Download: https://nodejs.org/
   - Verify: `node --version`

### Installation Steps

#### 1. Navigate to Backend Directory

```powershell
cd C:\Users\Vian_\Documents\asis\MoneyAssist\moneyassist-backend
```

#### 2. Install PHP Dependencies

```powershell
composer install
```

This will install:
- Laravel 12.x framework
- Laravel Sanctum (authentication)
- Google Generative AI PHP
- Intervention Image
- Maatwebsite Excel
- And other dependencies

#### 3. Create Environment File

```powershell
copy .env.example .env
```

#### 4. Generate Application Key

```powershell
php artisan key:generate
```

This generates a unique encryption key for your application.

#### 5. Configure Database

Edit `.env` file:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password
```

#### 6. Create PostgreSQL Database

Using pgAdmin or psql:

```sql
CREATE DATABASE moneyassist;
```

#### 7. Run Database Migrations

```powershell
php artisan migrate
```

This creates all database tables:
- users
- categories
- transactions
- savings_goals
- chat_messages
- recommendations
- reminders

#### 8. Publish Sanctum Configuration

```powershell
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

#### 9. Configure Gemini API

Get your API key from: https://ai.google.dev/

Edit `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

#### 10. Configure Frontend URL

Edit `.env`:

```env
FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173
```

#### 11. Start Development Server

```powershell
php artisan serve
```

Server will start at: `http://localhost:8000`

---

## Testing the API

### 1. Test Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status":"ok"}
```

### 2. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Response will include a token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "token": "your_token_here"
  }
}
```

### 4. Use Token for Protected Routes

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer your_token_here"
```

---

## Connecting Frontend to Backend

### 1. Update Frontend .env

Edit `moneyassist-frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Start Frontend

```powershell
cd ..\moneyassist-frontend
npm run dev
```

Frontend will be at: `http://localhost:5173`

### 3. Test Connection

- Open frontend in browser
- Try to register or login
- Check browser console for any errors
- Check backend logs for API calls

---

## Common Issues & Solutions

### Issue: "Composer not found"
**Solution**: Install Composer from https://getcomposer.org/

### Issue: "PHP not found"
**Solution**: Install PHP or add to PATH

### Issue: "Database connection failed"
**Solution**:
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists: `CREATE DATABASE moneyassist;`

### Issue: "CORS errors"
**Solution**:
- Check `config/cors.php`
- Verify `FRONTEND_URL` in `.env`
- Clear config: `php artisan config:clear`

### Issue: "Permission denied" on storage
**Solution**:
```powershell
icacls storage /grant Users:F /T
icacls bootstrap\cache /grant Users:F /T
```

### Issue: "Sanctum token not working"
**Solution**:
- Run: `php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"`
- Run: `php artisan migrate`
- Clear cache: `php artisan cache:clear`

---

## Useful Commands

```powershell
# Start development server
php artisan serve

# Run migrations
php artisan migrate

# Fresh migration (reset database)
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Create new controller
php artisan make:controller ControllerName

# Create new model
php artisan make:model ModelName

# Create new migration
php artisan make:migration create_table_name

# Run tests
php artisan test

# List all routes
php artisan route:list

# Tinker (interactive shell)
php artisan tinker
```

---

## Next Steps

1. ✅ Install backend
2. ✅ Configure database
3. ✅ Start server
4. ⏳ Test API endpoints
5. ⏳ Connect frontend
6. ⏳ Test full application
7. ⏳ Deploy to production

---

## Documentation

- **API Docs**: See `API_DOCUMENTATION.md`
- **Database Schema**: See `DATABASE_SCHEMA.md`
- **Backend Structure**: See `BACKEND_STRUCTURE.md`
- **README**: See `README.md`

---

## Support

For more information:
- Laravel Docs: https://laravel.com/docs
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Sanctum Docs: https://laravel.com/docs/sanctum

---

**Ready to build! 🚀**

Start with: `php artisan serve`
