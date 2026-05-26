# MoneyAssist Backend - Quick Start Guide

## 🚀 Quick Installation (5 Minutes)

### Prerequisites Check

Before starting, verify you have:
- ✅ PHP 8.2+ installed
- ✅ Composer installed
- ✅ PostgreSQL installed and running

### Step-by-Step Installation

#### 1. Install Composer (if not installed)

**Windows:**
```powershell
# Download and run Composer-Setup.exe from:
# https://getcomposer.org/Composer-Setup.exe

# Verify installation
composer --version
```

#### 2. Create Laravel Project

```powershell
cd MoneyAssist
composer create-project laravel/laravel moneyassist-backend
cd moneyassist-backend
```

#### 3. Install Dependencies

```powershell
# Authentication
composer require laravel/sanctum

# Google Gemini AI
composer require google/generative-ai-php

# Image processing
composer require intervention/image

# Excel import/export
composer require maatwebsite/excel
```

#### 4. Configure Environment

```powershell
# Copy environment file
copy .env.example .env

# Generate app key
php artisan key:generate
```

Edit `.env` file:
```env
APP_NAME=MoneyAssist
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:5173

SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
```

#### 5. Create Database

```sql
-- Using psql or pgAdmin
CREATE DATABASE moneyassist;
```

#### 6. Run Migrations

```powershell
php artisan migrate
```

#### 7. Seed Database (Optional)

```powershell
php artisan db:seed
```

#### 8. Start Server

```powershell
php artisan serve
```

✅ **Backend is now running at:** `http://localhost:8000`

---

## 📝 What to Create Next

After Laravel is installed, you need to create these files:

### 1. Database Migrations (Priority: HIGH)

```powershell
# Create migrations
php artisan make:migration create_categories_table
php artisan make:migration create_transactions_table
php artisan make:migration create_savings_goals_table
php artisan make:migration create_chat_messages_table
php artisan make:migration create_recommendations_table
php artisan make:migration create_reminders_table
```

### 2. Models (Priority: HIGH)

```powershell
php artisan make:model Transaction -m
php artisan make:model Category -m
php artisan make:model SavingsGoal -m
php artisan make:model ChatMessage -m
php artisan make:model Recommendation -m
php artisan make:model Reminder -m
```

### 3. Controllers (Priority: HIGH)

```powershell
php artisan make:controller AuthController
php artisan make:controller TransactionController --resource
php artisan make:controller GoalController --resource
php artisan make:controller ChatController
php artisan make:controller RecommendationController
php artisan make:controller UserController
```

### 4. Services (Priority: MEDIUM)

Create in `app/Services/`:
- `GeminiService.php`
- `FinancialAnalysisService.php`
- `RecommendationService.php`
- `ChatService.php`
- `ReceiptProcessingService.php`

### 5. Requests (Priority: MEDIUM)

```powershell
php artisan make:request Auth/LoginRequest
php artisan make:request Auth/RegisterRequest
php artisan make:request Transaction/StoreTransactionRequest
php artisan make:request Transaction/UpdateTransactionRequest
php artisan make:request Goal/StoreGoalRequest
php artisan make:request Goal/UpdateGoalRequest
```

### 6. Resources (Priority: LOW)

```powershell
php artisan make:resource UserResource
php artisan make:resource TransactionResource
php artisan make:resource GoalResource
php artisan make:resource RecommendationResource
```

### 7. Configure Routes (Priority: HIGH)

Edit `routes/api.php` to add all API endpoints.

### 8. Configure CORS (Priority: HIGH)

Edit `config/cors.php` to allow frontend access.

### 9. Publish Sanctum (Priority: HIGH)

```powershell
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 10. Create Seeders (Priority: LOW)

```powershell
php artisan make:seeder CategorySeeder
php artisan make:seeder UserSeeder
```

---

## 🧪 Testing the API

### Test Authentication

```powershell
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test with Postman

1. Import API collection
2. Set base URL: `http://localhost:8000/api`
3. Add Authorization header: `Bearer {token}`
4. Test all endpoints

---

## 🔧 Common Commands

```powershell
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate
php artisan migrate:fresh --seed

# Create new files
php artisan make:controller ControllerName
php artisan make:model ModelName
php artisan make:migration create_table_name

# Run tests
php artisan test

# Start queue worker
php artisan queue:work

# Run scheduler
php artisan schedule:work
```

---

## 📚 File Templates

### Migration Template

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('table_name', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            // Add your columns here
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('table_name');
    }
};
```

### Controller Template

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class ExampleController extends Controller
{
    use ApiResponse;

    public function index()
    {
        // Logic here
        return $this->successResponse($data, 'Success message');
    }

    public function store(Request $request)
    {
        // Validation and logic
        return $this->successResponse($data, 'Created successfully', 201);
    }
}
```

### Model Template

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Example extends Model
{
    protected $fillable = [
        'field1',
        'field2',
    ];

    protected $casts = [
        'date_field' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 🐛 Troubleshooting

### Issue: Composer not found
**Solution:** Install Composer and restart terminal

### Issue: PHP not found
**Solution:** Install PHP or add to PATH

### Issue: Database connection failed
**Solution:** 
- Check PostgreSQL is running
- Verify credentials in `.env`
- Create database if not exists

### Issue: Permission denied
**Solution:**
```powershell
# Windows: Give write permissions to storage and bootstrap/cache
icacls storage /grant Users:F /T
icacls bootstrap\cache /grant Users:F /T
```

### Issue: CORS errors
**Solution:**
- Check `config/cors.php`
- Verify `FRONTEND_URL` in `.env`
- Clear config: `php artisan config:clear`

---

## 📖 Next Steps

1. ✅ Install Laravel
2. ✅ Configure environment
3. ⏳ Create migrations
4. ⏳ Create models
5. ⏳ Create controllers
6. ⏳ Create services
7. ⏳ Set up routes
8. ⏳ Test API endpoints
9. ⏳ Connect with frontend
10. ⏳ Deploy to production

---

## 📞 Need Help?

- **Documentation:** See `BACKEND_SETUP_GUIDE.md`
- **Structure:** See `BACKEND_STRUCTURE.md`
- **API Docs:** See `API_DOCUMENTATION.md`
- **Database:** See `DATABASE_SCHEMA.md`

---

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `php artisan serve` | Start development server |
| `php artisan migrate` | Run migrations |
| `php artisan db:seed` | Seed database |
| `php artisan make:controller` | Create controller |
| `php artisan make:model` | Create model |
| `php artisan route:list` | List all routes |
| `php artisan test` | Run tests |

---

**Ready to build! 🚀**

For detailed implementation, proceed to create the files listed above.
