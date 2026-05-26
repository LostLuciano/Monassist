# MoneyAssist Backend

AI-powered personal finance application backend built with Laravel 12.x and PostgreSQL.

## Features

- User authentication with Laravel Sanctum
- Transaction management (income/expense tracking)
- Savings goals tracking
- AI-powered chat interface (Google Gemini API)
- Financial recommendations engine
- Reminders and notifications
- RESTful API with comprehensive endpoints
- CORS support for frontend integration
- PostgreSQL database with migrations

## Requirements

- PHP 8.2+
- Composer
- PostgreSQL 12+
- Node.js 18+ (for frontend integration)

## Installation

### 1. Clone or Extract Project

```bash
cd MoneyAssist/moneyassist-backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Environment Configuration

```bash
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` file with your configuration:

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
```

### 4. Create Database

```sql
-- Using psql or pgAdmin
CREATE DATABASE moneyassist;
```

### 5. Run Migrations

```bash
php artisan migrate
```

### 6. Publish Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 7. Start Development Server

```bash
php artisan serve
```

Backend will be available at: `http://localhost:8000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Transactions

- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/statistics` - Get statistics

### Goals

- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `GET /api/goals/{id}` - Get goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal
- `POST /api/goals/{id}/progress` - Add progress
- `GET /api/goals/statistics` - Get statistics

### Chat

- `GET /api/chat/history` - Get chat history
- `POST /api/chat/send` - Send message
- `GET /api/chat/{id}` - Get message
- `DELETE /api/chat/{id}` - Delete message
- `DELETE /api/chat` - Clear history

### Recommendations

- `GET /api/recommendations` - List recommendations
- `POST /api/recommendations/generate` - Generate recommendations
- `GET /api/recommendations/{id}` - Get recommendation
- `PUT /api/recommendations/{id}/status` - Update status
- `DELETE /api/recommendations/{id}` - Delete recommendation
- `GET /api/recommendations/statistics` - Get statistics

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── TransactionController.php
│   │   ├── GoalController.php
│   │   ├── ChatController.php
│   │   └── RecommendationController.php
│   ├── Middleware/
│   │   ├── Authenticate.php
│   │   ├── TrustProxies.php
│   │   └── ...
│   └── Kernel.php
├── Models/
│   ├── User.php
│   ├── Transaction.php
│   ├── Category.php
│   ├── SavingsGoal.php
│   ├── ChatMessage.php
│   ├── Recommendation.php
│   └── Reminder.php
├── Services/
│   ├── GeminiService.php
│   └── RecommendationService.php
├── Traits/
│   └── ApiResponse.php
└── Providers/
    ├── AppServiceProvider.php
    ├── AuthServiceProvider.php
    ├── RouteServiceProvider.php
    └── ...

database/
├── migrations/
│   ├── 2024_01_01_000001_create_users_table.php
│   ├── 2024_01_01_000002_create_categories_table.php
│   ├── 2024_01_01_000003_create_transactions_table.php
│   ├── 2024_01_01_000004_create_savings_goals_table.php
│   ├── 2024_01_01_000005_create_chat_messages_table.php
│   ├── 2024_01_01_000006_create_recommendations_table.php
│   └── 2024_01_01_000007_create_reminders_table.php
├── factories/
└── seeders/

routes/
├── api.php
├── web.php
└── channels.php

config/
├── app.php
├── database.php
├── cors.php
└── services.php
```

## Database Schema

### Users Table
- id, name, email, password, phone, avatar_url, bio, currency, language, theme, notifications_enabled, timestamps

### Categories Table
- id, user_id, name, icon, color, type (income/expense), budget_limit, description, timestamps

### Transactions Table
- id, user_id, category_id, type (income/expense), amount, description, date, receipt_url, tags, notes, timestamps

### Savings Goals Table
- id, user_id, name, description, target_amount, current_amount, deadline, category, icon, color, priority, status, timestamps

### Chat Messages Table
- id, user_id, message, response, type, context, sentiment, timestamps

### Recommendations Table
- id, user_id, title, description, type, priority, potential_savings, implementation_difficulty, status, data, timestamps

### Reminders Table
- id, user_id, title, description, type, due_date, frequency, status, notification_sent, timestamps

## Testing

### Test Authentication

```bash
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

## Configuration

### CORS Configuration

Edit `config/cors.php` to allow frontend origins:

```php
'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:5173'),
    'http://localhost:3000',
],
```

### Sanctum Configuration

Edit `config/sanctum.php` for token settings:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost:5173')),
```

### Database Configuration

Edit `.env` for database connection:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

## Common Commands

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

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

## Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env`
- Ensure database exists

### CORS Errors
- Check `config/cors.php`
- Verify `FRONTEND_URL` in `.env`
- Clear config: `php artisan config:clear`

### Permission Denied
```bash
# Windows: Give write permissions
icacls storage /grant Users:F /T
icacls bootstrap\cache /grant Users:F /T
```

### Composer Issues
- Clear cache: `composer clear-cache`
- Update: `composer update`
- Reinstall: `composer install --no-cache`

## Deployment

### Production Setup

1. Set `APP_DEBUG=false` in `.env`
2. Set `APP_ENV=production`
3. Generate strong `APP_KEY`
4. Configure production database
5. Set up HTTPS
6. Configure CORS for production domain
7. Set up environment variables
8. Run migrations: `php artisan migrate --force`
9. Cache configuration: `php artisan config:cache`
10. Cache routes: `php artisan route:cache`

### Environment Variables

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=moneyassist
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password

GEMINI_API_KEY=your-api-key
FRONTEND_URL=https://your-frontend-domain.com
```

## Support

For issues or questions, refer to:
- Laravel Documentation: https://laravel.com/docs
- API Documentation: See `API_DOCUMENTATION.md`
- Database Schema: See `DATABASE_SCHEMA.md`

## License

MIT License - See LICENSE file for details

---

**Backend Status**: ✅ Ready for Development

Start the server with: `php artisan serve`
