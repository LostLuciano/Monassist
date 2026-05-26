# Technical Architecture - MoneyAssist
# Arsitektur Teknis - MoneyAssist

**Version:** 1.0.0  
**Last Updated:** May 26, 2026  
**Language:** Bilingual (English/Indonesian)

---

## 1. System Overview / Gambaran Sistem

MoneyAssist adalah aplikasi finansial yang dibangun dengan arsitektur modern yang mendukung multiple platforms. Sistem ini terdiri dari:

- **Backend API**: Laravel (PHP)
- **Frontend Web**: React + TypeScript
- **Mobile Apps**: React Native / Flutter
- **Database**: PostgreSQL
- **AI Integration**: Google Gemini API
- **Cloud Infrastructure**: AWS / DigitalOcean

---

## 2. Backend Architecture / Arsitektur Backend

### 2.1 Technology Stack

```
Framework: Laravel 11.x
Language: PHP 8.2+
Database: PostgreSQL 14+
Cache: Redis
Queue: Laravel Queue (Redis/Database)
API: RESTful API with JSON responses
Authentication: JWT (Laravel Sanctum)
```

### 2.2 Project Structure

```
moneyassist-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── SavingsGoalController.php
│   │   │   ├── UserController.php
│   │   │   ├── RecommendationController.php
│   │   │   └── ChatController.php
│   │   ├── Requests/
│   │   │   ├── LoginRequest.php
│   │   │   ├── RegisterRequest.php
│   │   │   ├── TransactionRequest.php
│   │   │   └── SavingsGoalRequest.php
│   │   └── Resources/
│   │       ├── TransactionResource.php
│   │       ├── UserResource.php
│   │       └── SavingsGoalResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Transaction.php
│   │   ├── SavingsGoal.php
│   │   ├── Category.php
│   │   ├── ChatHistory.php
│   │   └── Recommendation.php
│   ├── Services/
│   │   ├── GeminiAIService.php
│   │   ├── TransactionService.php
│   │   ├── RecommendationService.php
│   │   ├── OCRService.php
│   │   └── NotificationService.php
│   ├── Jobs/
│   │   ├── ProcessReceiptOCR.php
│   │   ├── GenerateRecommendations.php
│   │   └── SendDailyReminder.php
│   └── Middleware/
│       ├── AuthenticateUser.php
│       └── RateLimiter.php
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_transactions_table.php
│   │   ├── create_savings_goals_table.php
│   │   ├── create_categories_table.php
│   │   ├── create_chat_histories_table.php
│   │   └── create_recommendations_table.php
│   └── seeders/
│       ├── CategorySeeder.php
│       └── UserSeeder.php
├── routes/
│   ├── api.php
│   └── web.php
├── config/
│   ├── gemini.php
│   ├── ocr.php
│   └── notification.php
├── tests/
│   ├── Feature/
│   │   ├── AuthTest.php
│   │   ├── TransactionTest.php
│   │   └── RecommendationTest.php
│   └── Unit/
│       ├── TransactionServiceTest.php
│       └── RecommendationServiceTest.php
└── storage/
    ├── app/
    │   └── receipts/
    └── logs/
```

### 2.3 Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    profile_photo_path VARCHAR(255),
    monthly_income DECIMAL(15, 2) DEFAULT 0,
    reminder_frequency VARCHAR(50) DEFAULT 'daily',
    reminder_time TIME DEFAULT '08:00:00',
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    description VARCHAR(255),
    receipt_image_path VARCHAR(255),
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_user_date (user_id, transaction_date)
);
```

#### Savings Goals Table
```sql
CREATE TABLE savings_goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    target_date DATE NOT NULL,
    category VARCHAR(100),
    status ENUM('active', 'completed', 'abandoned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Categories Table
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('income', 'expense') NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Chat History Table
```sql
CREATE TABLE chat_histories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    is_guest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_created (user_id, created_at)
);
```

#### Recommendations Table
```sql
CREATE TABLE recommendations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);
```

---

## 3. API Endpoints / Endpoint API

### 3.1 Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh           - Refresh JWT token
GET    /api/auth/me                - Get current user info
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
```

### 3.2 User Endpoints

```
GET    /api/users/profile          - Get user profile
PUT    /api/users/profile          - Update user profile
PUT    /api/users/settings         - Update user settings
GET    /api/users/summary          - Get financial summary
```

### 3.3 Transaction Endpoints

```
GET    /api/transactions           - List transactions (with filters)
POST   /api/transactions           - Create transaction
GET    /api/transactions/{id}      - Get transaction detail
PUT    /api/transactions/{id}      - Update transaction
DELETE /api/transactions/{id}      - Delete transaction
POST   /api/transactions/upload-receipt - Upload receipt image
GET    /api/transactions/summary   - Get transaction summary
GET    /api/transactions/by-category - Get transactions by category
```

### 3.4 Savings Goals Endpoints

```
GET    /api/savings-goals          - List all goals
POST   /api/savings-goals          - Create new goal
GET    /api/savings-goals/{id}     - Get goal detail
PUT    /api/savings-goals/{id}     - Update goal
DELETE /api/savings-goals/{id}     - Delete goal
GET    /api/savings-goals/{id}/progress - Get goal progress
```

### 3.5 AI Chat Endpoints

```
POST   /api/chat/message           - Send chat message
GET    /api/chat/history           - Get chat history
POST   /api/chat/guest-message     - Guest chat (no auth required)
```

### 3.6 Recommendations Endpoints

```
GET    /api/recommendations        - Get recommendations
GET    /api/recommendations/{id}   - Get recommendation detail
PUT    /api/recommendations/{id}/read - Mark as read
DELETE /api/recommendations/{id}   - Delete recommendation
```

### 3.7 Analytics Endpoints

```
GET    /api/analytics/daily-summary    - Daily summary
GET    /api/analytics/weekly-summary   - Weekly summary
GET    /api/analytics/monthly-summary  - Monthly summary
GET    /api/analytics/expense-breakdown - Expense by category
GET    /api/analytics/trend            - Spending trend
```

---

## 4. Frontend Architecture / Arsitektur Frontend

### 4.1 Technology Stack

```
Framework: React 18.x
Language: TypeScript
Styling: Tailwind CSS
State Management: Redux Toolkit / Zustand
HTTP Client: Axios
Charts: Recharts / Chart.js
Form: React Hook Form
UI Components: Headless UI / Radix UI
Build Tool: Vite
```

### 4.2 Project Structure

```
moneyassist-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── guest/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AIChat.tsx
│   │   │   ├── FeaturePreview.tsx
│   │   │   └── HeroSection.tsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── StatisticsCard.tsx
│   │   │   ├── ExpenseChart.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   └── RecentTransactions.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── ReceiptUpload.tsx
│   │   │   └── TransactionDetail.tsx
│   │   ├── goals/
│   │   │   ├── GoalsList.tsx
│   │   │   ├── GoalForm.tsx
│   │   │   ├── GoalProgress.tsx
│   │   │   └── GoalDetail.tsx
│   │   ├── recommendations/
│   │   │   ├── RecommendationsList.tsx
│   │   │   └── RecommendationCard.tsx
│   │   └── profile/
│   │       ├── ProfilePage.tsx
│   │       ├── SettingsPage.tsx
│   │       └── NotificationSettings.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── TransactionsPage.tsx
│   │   ├── GoalsPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── transactionService.ts
│   │   ├── goalService.ts
│   │   ├── chatService.ts
│   │   └── recommendationService.ts
│   ├── store/
│   │   ├── authSlice.ts
│   │   ├── transactionSlice.ts
│   │   ├── goalSlice.ts
│   │   ├── uiSlice.ts
│   │   └── store.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useGoals.ts
│   │   └── useResponsive.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── auth.ts
│   │   ├── transaction.ts
│   │   ├── goal.ts
│   │   └── api.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── animations.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   ├── images/
│   ├── icons/
│   └── manifest.json
├── tests/
│   ├── components/
│   ├── services/
│   └── utils/
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

---

## 5. Mobile Architecture / Arsitektur Mobile

### 5.1 React Native Setup

```
Framework: React Native 0.73+
Language: TypeScript
Navigation: React Navigation
State Management: Redux Toolkit
HTTP Client: Axios
UI Components: React Native Paper / NativeBase
Platform Support: iOS 13+, Android 8+
```

### 5.2 Project Structure

```
moneyassist-mobile/
├── src/
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   ├── guest/
│   │   │   ├── LandingScreen.tsx
│   │   │   └── ChatScreen.tsx
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── SummaryScreen.tsx
│   │   │   └── AnalyticsScreen.tsx
│   │   ├── transactions/
│   │   │   ├── TransactionsScreen.tsx
│   │   │   ├── AddTransactionScreen.tsx
│   │   │   └── TransactionDetailScreen.tsx
│   │   ├── goals/
│   │   │   ├── GoalsScreen.tsx
│   │   │   ├── AddGoalScreen.tsx
│   │   │   └── GoalDetailScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── chat/
│   │       └── ChatScreen.tsx
│   ├── components/
│   │   ├── common/
│   │   ├── dashboard/
│   │   ├── transactions/
│   │   └── goals/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── AppNavigator.tsx
│   │   └── GuestNavigator.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   └── ...
│   ├── store/
│   │   └── ...
│   ├── types/
│   │   └── ...
│   ├── utils/
│   │   └── ...
│   └── App.tsx
├── android/
├── ios/
├── app.json
├── package.json
└── tsconfig.json
```

---

## 6. Deployment Architecture / Arsitektur Deployment

### 6.1 Web Deployment

```
Frontend:
- Build: npm run build
- Hosting: Vercel / Netlify / AWS S3 + CloudFront
- CDN: CloudFlare
- Domain: Custom domain with SSL

Backend:
- Server: AWS EC2 / DigitalOcean / Heroku
- Database: AWS RDS PostgreSQL / Managed PostgreSQL
- Cache: Redis (AWS ElastiCache / DigitalOcean)
- Storage: AWS S3 (for receipt images)
- Email: SendGrid / AWS SES
```

### 6.2 Mobile Deployment

```
iOS:
- Build: Xcode / EAS Build
- Distribution: Apple App Store
- Signing: Apple Developer Certificate

Android:
- Build: Android Studio / EAS Build
- Distribution: Google Play Store
- Signing: Android Keystore
```

### 6.3 CI/CD Pipeline

```
GitHub Actions / GitLab CI:
- Trigger: Push to main/develop branch
- Steps:
  1. Code checkout
  2. Install dependencies
  3. Run linting
  4. Run tests
  5. Build application
  6. Deploy to staging
  7. Run integration tests
  8. Deploy to production
```

---

## 7. Security Considerations / Pertimbangan Keamanan

### 7.1 Authentication & Authorization

```
- JWT tokens with expiration
- Refresh token rotation
- Role-based access control (RBAC)
- Rate limiting on auth endpoints
- Password hashing with bcrypt
- Two-factor authentication (optional)
```

### 7.2 Data Protection

```
- HTTPS/TLS encryption
- Database encryption at rest
- Sensitive data encryption
- CORS configuration
- CSRF protection
- SQL injection prevention
- XSS protection
```

### 7.3 API Security

```
- API key validation
- Request signing
- Rate limiting
- IP whitelisting (optional)
- Request validation
- Response sanitization
```

---

## 8. Performance Optimization / Optimasi Performa

### 8.1 Backend Optimization

```
- Database indexing
- Query optimization
- Caching strategy (Redis)
- Pagination for large datasets
- Lazy loading
- Compression (gzip)
```

### 8.2 Frontend Optimization

```
- Code splitting
- Lazy loading components
- Image optimization
- CSS minification
- JavaScript minification
- Service workers
- Progressive Web App (PWA)
```

### 8.3 Mobile Optimization

```
- Minimal bundle size
- Efficient state management
- Image caching
- Network request optimization
- Battery optimization
```

---

## 9. Monitoring & Logging / Monitoring dan Logging

### 9.1 Application Monitoring

```
- Error tracking: Sentry
- Performance monitoring: New Relic / DataDog
- Uptime monitoring: UptimeRobot
- Log aggregation: ELK Stack / CloudWatch
```

### 9.2 Metrics to Track

```
- API response time
- Error rate
- User engagement
- Conversion rate
- Database query performance
- Cache hit rate
- Server resource usage
```

---

## 10. Development Workflow / Alur Pengembangan

### 10.1 Git Branching Strategy

```
main (production)
├── develop (staging)
│   ├── feature/feature-name
│   ├── bugfix/bug-name
│   └── hotfix/hotfix-name
```

### 10.2 Development Environment Setup

```
Requirements:
- PHP 8.2+
- Node.js 18+
- PostgreSQL 14+
- Redis
- Docker (optional)

Setup:
1. Clone repository
2. Install dependencies
3. Copy .env.example to .env
4. Generate app key
5. Run migrations
6. Start development server
```

---

## 11. Testing Strategy / Strategi Testing

### 11.1 Backend Testing

```
- Unit Tests: PHPUnit
- Feature Tests: PHPUnit
- API Tests: Postman / Insomnia
- Load Testing: Apache JMeter
- Security Testing: OWASP ZAP
```

### 11.2 Frontend Testing

```
- Unit Tests: Vitest / Jest
- Component Tests: React Testing Library
- E2E Tests: Cypress / Playwright
- Visual Regression: Percy
```

### 11.3 Mobile Testing

```
- Unit Tests: Jest
- Component Tests: React Native Testing Library
- E2E Tests: Detox
- Device Testing: Real devices + emulators
```

---

**Document End**
