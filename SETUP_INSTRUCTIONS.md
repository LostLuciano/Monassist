# MoneyAssist - Setup Instructions
# Instruksi Setup MoneyAssist

**Version:** 1.0.0  
**Last Updated:** May 26, 2026

---

## Quick Start / Mulai Cepat

### Prerequisites / Prasyarat

Pastikan Anda sudah menginstall:
- Node.js 18+ (https://nodejs.org/)
- PHP 8.2+ (https://www.php.net/)
- Composer (https://getcomposer.org/)
- PostgreSQL 14+ (https://www.postgresql.org/)
- Redis (https://redis.io/)

---

## Setup Frontend (React)

### Option 1: Automatic Setup (Recommended)

```powershell
# 1. Run frontend setup script
.\setup-frontend.ps1

# 2. Generate components
.\setup-components.ps1

# 3. Navigate to frontend directory
cd moneyassist-frontend

# 4. Install dependencies
npm install

# 5. Copy environment file
cp .env.example .env.local

# 6. Start development server
npm run dev
```

### Option 2: Manual Setup

```powershell
# 1. Navigate to frontend directory
cd moneyassist-frontend

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Update .env.local with your API URL
# VITE_API_URL=http://localhost:8000/api

# 5. Start development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:5173**

---

## Setup Backend (Laravel)

### Option 1: Automatic Setup (Recommended)

```powershell
# 1. Run backend setup script
.\setup-backend.ps1

# 2. Update .env file with your credentials
# - Database credentials
# - Gemini API key
# - AWS credentials (optional)

# 3. Create database
createdb moneyassist

# 4. Run migrations
cd moneyassist-backend
php artisan migrate

# 5. Seed database (optional)
php artisan db:seed

# 6. Start server
php artisan serve
```

### Option 2: Manual Setup

```powershell
# 1. Create Laravel project
composer create-project laravel/laravel moneyassist-backend "11.*"

# 2. Navigate to backend directory
cd moneyassist-backend

# 3. Install additional packages
composer require tymon/jwt-auth
composer require intervention/image
composer require laravel/sanctum

# 4. Copy .env.example to .env
cp .env.example .env

# 5. Generate application key
php artisan key:generate

# 6. Update .env with your credentials

# 7. Create database
createdb moneyassist

# 8. Run migrations
php artisan migrate

# 9. Start server
php artisan serve
```

Backend akan berjalan di: **http://localhost:8000**

---

## Environment Variables

### Frontend (.env.local)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MoneyAssist
VITE_APP_ENV=development
```

### Backend (.env)

```env
APP_NAME=MoneyAssist
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro

JWT_SECRET=your_jwt_secret
```

---

## Database Setup

### Create Database

```bash
# Using PostgreSQL CLI
createdb moneyassist

# Or using psql
psql -U postgres
CREATE DATABASE moneyassist;
\q
```

### Run Migrations

```bash
cd moneyassist-backend
php artisan migrate
```

### Seed Database (Optional)

```bash
php artisan db:seed
```

---

## Testing

### Frontend Tests

```bash
cd moneyassist-frontend
npm run test
npm run test:coverage
```

### Backend Tests

```bash
cd moneyassist-backend
php artisan test
php artisan test --coverage
```

---

## Development Workflow

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd moneyassist-backend
php artisan serve
```

**Terminal 2 - Frontend:**
```bash
cd moneyassist-frontend
npm run dev
```

### Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api
- **Backend Admin:** http://localhost:8000

---

## Build for Production

### Frontend

```bash
cd moneyassist-frontend
npm run build
```

Build output akan ada di folder `dist/`

### Backend

```bash
cd moneyassist-backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Troubleshooting

### Port Already in Use

**Frontend (5173):**
```bash
# Kill process using port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Backend (8000):**
```bash
# Kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
php artisan serve --port=8001
```

### Database Connection Error

1. Check PostgreSQL is running:
```bash
pg_isready
```

2. Check credentials in `.env`

3. Test connection:
```bash
psql -U postgres -h localhost
```

### Composer Dependency Error

```bash
# Clear composer cache
composer clear-cache

# Update dependencies
composer update

# Reinstall
rm -rf vendor composer.lock
composer install
```

### npm Dependency Error

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Project Structure

```
MoneyAssist/
├── moneyassist-frontend/     # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
├── moneyassist-backend/      # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API controllers
│   │   │   └── Requests/    # Form requests
│   │   ├── Models/          # Eloquent models
│   │   └── Services/        # Business logic
│   ├── database/
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Database seeders
│   ├── routes/
│   │   └── api.php          # API routes
│   └── composer.json
│
└── Documentation/            # All documentation files
```

---

## Available Scripts

### Frontend Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:coverage # Run tests with coverage
```

### Backend Scripts

```bash
php artisan serve              # Start development server
php artisan migrate            # Run migrations
php artisan migrate:fresh      # Fresh migration
php artisan db:seed            # Seed database
php artisan test               # Run tests
php artisan queue:work         # Start queue worker
php artisan cache:clear        # Clear cache
php artisan config:clear       # Clear config cache
php artisan route:clear        # Clear route cache
```

---

## API Documentation

API documentation is available at:
- **Local:** http://localhost:8000/api/documentation
- **Documentation File:** See `API_DOCUMENTATION.md`

---

## Additional Resources

- **Complete Documentation:** See all `.md` files in root directory
- **PRD:** Product Requirements Document
- **Technical Architecture:** System architecture details
- **Database Schema:** Database design and schema
- **Wireframes:** UI/UX design and wireframes
- **Mobile Design:** Mobile app design specifications
- **PWA Implementation:** Progressive Web App guide

---

## Support

For issues or questions:
1. Check documentation files
2. Check troubleshooting section
3. Review API documentation
4. Check GitHub issues (if applicable)

---

## Next Steps

After setup is complete:

1. **Review Documentation**
   - Read PRD.md for product requirements
   - Check TECHNICAL_ARCHITECTURE.md for system design
   - Review API_DOCUMENTATION.md for API reference

2. **Start Development**
   - Follow WIREFRAMES_AND_DESIGN.md for UI implementation
   - Use IMPLEMENTATION_CHECKLIST.md to track progress
   - Reference DATABASE_SCHEMA.md for database queries

3. **Testing**
   - Write unit tests
   - Write integration tests
   - Test on multiple devices

4. **Deployment**
   - Follow deployment guide in SETUP_GUIDE.md
   - Configure production environment
   - Setup monitoring and logging

---

## Quick Reference

### Start Development

```bash
# Terminal 1 - Backend
cd moneyassist-backend && php artisan serve

# Terminal 2 - Frontend  
cd moneyassist-frontend && npm run dev
```

### Access URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API: http://localhost:8000/api

### Default Credentials (After Seeding)

- Email: admin@example.com
- Password: password

---

**Happy Coding! / Selamat Coding!**

For complete documentation, see DOCUMENTATION_INDEX.md
