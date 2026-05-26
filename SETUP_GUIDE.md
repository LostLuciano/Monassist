# Setup & Installation Guide - MoneyAssist
# Panduan Setup dan Instalasi - MoneyAssist

**Version:** 1.0.0  
**Last Updated:** May 26, 2026

---

## 1. Prerequisites / Prasyarat

### System Requirements

```
Operating System: Linux, macOS, or Windows
RAM: Minimum 4GB (8GB recommended)
Storage: Minimum 10GB free space
Internet: Stable connection required
```

### Required Software

```
PHP 8.2 or higher
Node.js 18.x or higher
PostgreSQL 14 or higher
Redis 6.0 or higher
Composer (PHP package manager)
npm or yarn (Node.js package manager)
Git
Docker (optional, for containerization)
```

### API Keys Required

```
Google Gemini API Key
AWS S3 credentials (for file storage)
SendGrid API Key (for email)
```

---

## 2. Backend Setup (Laravel) / Setup Backend (Laravel)

### 2.1 Clone Repository

```bash
git clone https://github.com/yourusername/moneyassist-backend.git
cd moneyassist-backend
```

### 2.2 Install PHP Dependencies

```bash
composer install
```

### 2.3 Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file with your configuration:

```env
APP_NAME=MoneyAssist
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro

AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=moneyassist-bucket

MAIL_MAILER=sendgrid
MAIL_FROM_ADDRESS=noreply@moneyassist.com
SENDGRID_API_KEY=your_sendgrid_key

JWT_SECRET=your_jwt_secret
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
```

### 2.4 Generate Application Key

```bash
php artisan key:generate
```

### 2.5 Create Database

```bash
# Using PostgreSQL
createdb moneyassist
```

### 2.6 Run Migrations

```bash
php artisan migrate
```

### 2.7 Seed Database (Optional)

```bash
php artisan db:seed
```

### 2.8 Create Storage Link

```bash
php artisan storage:link
```

### 2.9 Start Development Server

```bash
php artisan serve
```

Server akan berjalan di `http://localhost:8000`

### 2.10 Start Queue Worker (Optional)

```bash
php artisan queue:work
```

---

## 3. Frontend Setup (React) / Setup Frontend (React)

### 3.1 Clone Repository

```bash
git clone https://github.com/yourusername/moneyassist-frontend.git
cd moneyassist-frontend
```

### 3.2 Install Node Dependencies

```bash
npm install
# or
yarn install
```

### 3.3 Environment Configuration

```bash
cp .env.example .env.local
```

Edit `.env.local` file:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MoneyAssist
VITE_APP_ENV=development
```

### 3.4 Start Development Server

```bash
npm run dev
# or
yarn dev
```

Frontend akan berjalan di `http://localhost:5173`

### 3.5 Build for Production

```bash
npm run build
# or
yarn build
```

---

## 4. Mobile Setup (React Native) / Setup Mobile (React Native)

### 4.1 Clone Repository

```bash
git clone https://github.com/yourusername/moneyassist-mobile.git
cd moneyassist-mobile
```

### 4.2 Install Dependencies

```bash
npm install
# or
yarn install
```

### 4.3 Environment Configuration

Create `.env` file:

```env
API_URL=http://your-backend-url/api
APP_ENV=development
```

### 4.4 iOS Setup

```bash
cd ios
pod install
cd ..
```

### 4.5 Android Setup

```bash
# No additional setup needed, Android Studio will handle it
```

### 4.6 Start Development Server

```bash
npm start
# or
yarn start
```

### 4.7 Run on iOS

```bash
npm run ios
# or
yarn ios
```

### 4.8 Run on Android

```bash
npm run android
# or
yarn android
```

---

## 5. Docker Setup (Optional) / Setup Docker (Opsional)

### 5.1 Create Docker Compose File

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: moneyassist
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./moneyassist-backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./moneyassist-backend:/app

  frontend:
    build:
      context: ./moneyassist-frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 5.2 Start Docker Containers

```bash
docker-compose up -d
```

### 5.3 Stop Docker Containers

```bash
docker-compose down
```

---

## 6. Database Setup / Setup Database

### 6.1 Create Database

```bash
# Using PostgreSQL CLI
psql -U postgres
CREATE DATABASE moneyassist;
\q
```

### 6.2 Run Migrations

```bash
php artisan migrate
```

### 6.3 Seed Categories

```bash
php artisan db:seed --class=CategorySeeder
```

### 6.4 Create Admin User (Optional)

```bash
php artisan tinker
>>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('password')])
>>> exit
```

---

## 7. API Configuration / Konfigurasi API

### 7.1 Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Add to `.env`:

```env
GEMINI_API_KEY=your_api_key
```

### 7.2 AWS S3 Setup

1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Add credentials to `.env`:

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
```

### 7.3 SendGrid Email Setup

1. Create SendGrid account
2. Generate API key
3. Add to `.env`:

```env
SENDGRID_API_KEY=your_api_key
MAIL_FROM_ADDRESS=noreply@yourdomain.com
```

---

## 8. Testing / Testing

### 8.1 Backend Tests

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/AuthTest.php

# Run with coverage
php artisan test --coverage
```

### 8.2 Frontend Tests

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### 8.3 E2E Tests

```bash
# Run Cypress tests
npm run cypress:open

# Run headless
npm run cypress:run
```

---

## 9. Deployment / Deployment

### 9.1 Deploy Backend to Heroku

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create moneyassist-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

### 9.2 Deploy Frontend to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### 9.3 Deploy to AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Clone repository
git clone https://github.com/yourusername/moneyassist-backend.git

# Install dependencies
cd moneyassist-backend
composer install

# Configure environment
cp .env.example .env
# Edit .env with production values

# Run migrations
php artisan migrate --force

# Start application with supervisor
sudo systemctl start moneyassist
```

---

## 10. Monitoring & Maintenance / Monitoring dan Maintenance

### 10.1 Check Application Health

```bash
# Backend health check
curl http://localhost:8000/api/health

# Database connection
php artisan tinker
>>> DB::connection()->getPdo()
```

### 10.2 View Logs

```bash
# Laravel logs
tail -f storage/logs/laravel.log

# System logs
journalctl -u moneyassist -f
```

### 10.3 Database Backup

```bash
# Backup database
pg_dump -U postgres moneyassist > backup.sql

# Restore database
psql -U postgres moneyassist < backup.sql
```

### 10.4 Clear Cache

```bash
# Clear all cache
php artisan cache:clear

# Clear config cache
php artisan config:clear

# Clear view cache
php artisan view:clear
```

---

## 11. Troubleshooting / Troubleshooting

### Issue: Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U postgres -h localhost

# Verify .env database credentials
cat .env | grep DB_
```

### Issue: Composer Dependency Error

```bash
# Clear composer cache
composer clear-cache

# Update dependencies
composer update

# Reinstall dependencies
rm -rf vendor composer.lock
composer install
```

### Issue: Node Modules Error

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
php artisan serve --port=8001
```

### Issue: Permission Denied

```bash
# Fix storage permissions
chmod -R 775 storage bootstrap/cache

# Fix file ownership
sudo chown -R www-data:www-data /path/to/moneyassist
```

---

## 12. Development Tools / Tools Pengembangan

### 12.1 Recommended IDE

- **Backend**: PhpStorm, VS Code with PHP extensions
- **Frontend**: VS Code, WebStorm
- **Mobile**: VS Code, Android Studio, Xcode

### 12.2 Browser Extensions

- React Developer Tools
- Redux DevTools
- Postman (API testing)
- Thunder Client (API testing)

### 12.3 Command Line Tools

```bash
# Laravel Artisan
php artisan

# Composer
composer

# npm/yarn
npm, yarn

# Git
git

# PostgreSQL CLI
psql

# Redis CLI
redis-cli
```

---

## 13. Performance Optimization / Optimasi Performa

### 13.1 Backend Optimization

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

### 13.2 Frontend Optimization

```bash
# Build with optimization
npm run build

# Analyze bundle size
npm run build -- --analyze
```

---

## 14. Security Checklist / Checklist Keamanan

- [ ] Change default passwords
- [ ] Enable HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Enable two-factor authentication
- [ ] Regular security updates
- [ ] Database backups
- [ ] API rate limiting
- [ ] CORS configuration
- [ ] Environment variables secured
- [ ] Dependencies updated

---

## 15. Quick Start Commands / Perintah Quick Start

```bash
# Backend
cd moneyassist-backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend (in new terminal)
cd moneyassist-frontend
npm install
npm run dev

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API: http://localhost:8000/api
```

---

**Document End**
