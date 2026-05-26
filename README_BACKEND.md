# MoneyAssist Backend Documentation

## 📚 Documentation Overview

This folder contains complete documentation for building the MoneyAssist Laravel backend.

### Available Documentation Files

1. **BACKEND_QUICK_START.md** ⭐ START HERE
   - Quick 5-minute installation guide
   - Step-by-step setup instructions
   - Common commands and troubleshooting
   - **Read this first!**

2. **BACKEND_SETUP_GUIDE.md**
   - Detailed installation guide
   - Prerequisites and requirements
   - Configuration instructions
   - Deployment checklist
   - Troubleshooting guide

3. **BACKEND_STRUCTURE.md**
   - Complete file structure
   - All controllers, models, services
   - API response formats
   - Security features
   - Performance optimization

4. **install-backend.ps1**
   - Automated installation script
   - Checks prerequisites
   - Installs dependencies
   - Configures environment

5. **API_DOCUMENTATION.md**
   - All API endpoints
   - Request/response examples
   - Authentication flow
   - Error handling

6. **DATABASE_SCHEMA.md**
   - Database structure
   - Table relationships
   - Indexes and constraints

## 🚀 Quick Start

### Option 1: Automated Installation (Recommended)

```powershell
cd MoneyAssist
.\install-backend.ps1
```

### Option 2: Manual Installation

```powershell
# 1. Install Composer (if not installed)
# Download from: https://getcomposer.org/Composer-Setup.exe

# 2. Create Laravel project
cd MoneyAssist
composer create-project laravel/laravel moneyassist-backend
cd moneyassist-backend

# 3. Install dependencies
composer require laravel/sanctum
composer require google/generative-ai-php
composer require intervention/image
composer require maatwebsite/excel

# 4. Configure environment
copy .env.example .env
php artisan key:generate

# 5. Update .env with your database credentials

# 6. Run migrations
php artisan migrate

# 7. Start server
php artisan serve
```

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **PHP 8.2+** - [Download](https://windows.php.net/download/)
- ✅ **Composer** - [Download](https://getcomposer.org/download/)
- ✅ **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- ✅ **Git** (Optional) - [Download](https://git-scm.com/download/win)

## 🏗️ What You'll Build

### Backend Features

1. **Authentication System**
   - User registration and login
   - JWT token authentication
   - Password reset
   - Profile management

2. **Transaction Management**
   - CRUD operations
   - Receipt upload and OCR
   - Category management
   - Statistics and analytics

3. **Savings Goals**
   - Goal creation and tracking
   - Progress monitoring
   - Deadline alerts

4. **AI Integration**
   - Google Gemini API
   - Financial analysis
   - Personalized recommendations
   - Chat assistant

5. **Additional Features**
   - Email notifications
   - Daily reminders
   - Data export (Excel, PDF)
   - File uploads

### Tech Stack

- **Framework:** Laravel 11.x
- **Database:** PostgreSQL
- **Authentication:** Laravel Sanctum
- **AI:** Google Gemini API
- **Image Processing:** Intervention Image
- **Excel:** Laravel Excel

## 📁 Project Structure

```
moneyassist-backend/
├── app/
│   ├── Http/Controllers/     # API Controllers
│   ├── Models/               # Eloquent Models
│   ├── Services/             # Business Logic
│   └── Traits/               # Reusable Traits
├── database/
│   ├── migrations/           # Database Migrations
│   └── seeders/              # Database Seeders
├── routes/
│   └── api.php               # API Routes
├── config/                   # Configuration Files
└── tests/                    # Unit & Feature Tests
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get user

### Transactions
- `GET /api/transactions` - List transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `GET /api/goals/{id}` - Get goal
- `PUT /api/goals/{id}` - Update goal
- `DELETE /api/goals/{id}` - Delete goal

### AI & Chat
- `POST /api/chat/message` - Send message
- `GET /api/chat/history` - Get history
- `POST /api/chat/voice` - Process voice
- `POST /api/chat/receipt` - Process receipt

### Recommendations
- `GET /api/recommendations` - Get recommendations
- `POST /api/recommendations/refresh` - Refresh

## 🧪 Testing

```powershell
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=AuthTest

# Run with coverage
php artisan test --coverage
```

## 🚀 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure database
- [ ] Set up CORS
- [ ] Configure queue workers
- [ ] Set up scheduled tasks
- [ ] Configure SSL
- [ ] Set up backups
- [ ] Configure monitoring

### Deploy Commands

```powershell
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Clear caches
php artisan cache:clear
```

## 📖 Learning Resources

### Laravel Documentation
- [Official Docs](https://laravel.com/docs)
- [Sanctum](https://laravel.com/docs/sanctum)
- [Eloquent ORM](https://laravel.com/docs/eloquent)

### Google Gemini
- [Gemini API Docs](https://ai.google.dev/docs)
- [PHP Client](https://github.com/google/generative-ai-php)

### PostgreSQL
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🐛 Common Issues

### Composer not found
**Solution:** Install Composer and restart terminal

### Database connection failed
**Solution:** Check PostgreSQL is running and credentials are correct

### Permission denied
**Solution:** Give write permissions to `storage` and `bootstrap/cache`

### CORS errors
**Solution:** Configure `config/cors.php` and set `FRONTEND_URL` in `.env`

## 📞 Support

For detailed information, see:
- `BACKEND_QUICK_START.md` - Quick installation
- `BACKEND_SETUP_GUIDE.md` - Detailed setup
- `BACKEND_STRUCTURE.md` - File structure
- `API_DOCUMENTATION.md` - API details
- `DATABASE_SCHEMA.md` - Database schema

## 🎯 Next Steps

1. ✅ Read `BACKEND_QUICK_START.md`
2. ⏳ Install prerequisites (PHP, Composer, PostgreSQL)
3. ⏳ Run installation script or manual setup
4. ⏳ Create migrations and models
5. ⏳ Create controllers and services
6. ⏳ Set up routes
7. ⏳ Test API endpoints
8. ⏳ Connect with frontend
9. ⏳ Deploy to production

## 📝 Notes

- Frontend is already built and ready in `moneyassist-frontend/`
- Backend will connect to frontend via API
- Use Postman or similar tool for API testing
- Follow Laravel best practices
- Write tests for critical features

---

**Ready to build the backend! 🚀**

Start with `BACKEND_QUICK_START.md` for installation instructions.
