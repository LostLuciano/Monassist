# MoneyAssist - AI-Powered Personal Finance Assistant

**Version:** 1.0.0  
**Status:** In Development  
**Language:** Bilingual (English/Indonesian)

---

## Overview / Gambaran Umum

MoneyAssist adalah aplikasi manajemen keuangan pribadi yang didukung oleh AI (Google Gemini API). Aplikasi ini dirancang untuk membantu pengguna memahami, menganalisis, dan mengoptimalkan pola pengeluaran mereka melalui antarmuka yang intuitif dan rekomendasi AI yang personal.

MoneyAssist is a personal finance management application powered by AI (Google Gemini API). It's designed to help users understand, analyze, and optimize their spending patterns through an intuitive interface and personalized AI recommendations.

---

## Key Features / Fitur Utama

### Guest Mode (Pre-Authentication)
- Interactive AI chat interface
- Feature preview and education
- Demo transaction simulation
- No data persistence

### Authenticated Mode (Post-Authentication)
- Comprehensive financial dashboard
- Transaction tracking and management
- Receipt image upload with OCR
- Savings goal creation and tracking
- AI-powered recommendations
- Daily/weekly financial summaries
- Spending analytics and insights
- Reminder notifications
- User profile management

---

## Technology Stack / Stack Teknologi

### Backend
- **Framework:** Laravel 11.x
- **Language:** PHP 8.2+
- **Database:** PostgreSQL 14+
- **Cache:** Redis
- **AI:** Google Gemini API
- **Authentication:** JWT (Laravel Sanctum)

### Frontend
- **Framework:** React 18.x
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit / Zustand
- **Build Tool:** Vite

### Mobile
- **Framework:** React Native
- **Language:** TypeScript
- **Platforms:** iOS 13+, Android 8+

### Deployment
- **Frontend:** Vercel / Netlify / AWS S3 + CloudFront
- **Backend:** AWS EC2 / Heroku / DigitalOcean
- **Database:** AWS RDS / Managed PostgreSQL

---

## Project Structure / Struktur Proyek

```
MoneyAssist/
├── README.md                          # This file
├── PRD.md                             # Product Requirements Document
├── USER_JOURNEY.md                    # User journey and personas
├── TECHNICAL_ARCHITECTURE.md          # Technical architecture details
├── API_DOCUMENTATION.md               # Complete API documentation
├── DATABASE_SCHEMA.md                 # Database schema and design
├── SETUP_GUIDE.md                     # Installation and setup guide
├── WIREFRAMES_AND_DESIGN.md          # UI/UX wireframes and design system
│
├── moneyassist-backend/               # Laravel backend
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── config/
│   ├── tests/
│   ├── .env.example
│   ├── composer.json
│   └── ...
│
├── moneyassist-frontend/              # React frontend
│   ├── src/
│   ├── public/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
└── moneyassist-mobile/                # React Native mobile
    ├── src/
    ├── android/
    ├── ios/
    ├── .env.example
    ├── package.json
    └── ...
```

---

## Quick Start / Mulai Cepat

### Prerequisites / Prasyarat

```bash
# Required software
- PHP 8.2+
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Composer
- npm or yarn
- Git
```

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/moneyassist-backend.git
cd moneyassist-backend

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Database setup
createdb moneyassist
php artisan migrate
php artisan db:seed

# Start server
php artisan serve
```

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/moneyassist-frontend.git
cd moneyassist-frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev
```

### Access Application

```
Frontend: http://localhost:5173
Backend: http://localhost:8000
API: http://localhost:8000/api
```

---

## Documentation / Dokumentasi

### 1. PRD.md
Complete product requirements document including:
- Product vision and goals
- Feature specifications
- User access control
- Design system
- Acceptance criteria

### 2. USER_JOURNEY.md
Detailed user journeys including:
- Guest mode user flow
- Authenticated mode user flow
- Persona descriptions
- Touchpoints and emotions
- Pain points and solutions

### 3. TECHNICAL_ARCHITECTURE.md
Technical architecture documentation:
- Backend architecture
- Frontend architecture
- Mobile architecture
- Deployment architecture
- Security considerations
- Performance optimization

### 4. API_DOCUMENTATION.md
Complete API reference:
- Authentication endpoints
- User endpoints
- Transaction endpoints
- Savings goals endpoints
- AI chat endpoints
- Recommendations endpoints
- Analytics endpoints
- Error handling
- Rate limiting

### 5. DATABASE_SCHEMA.md
Database design documentation:
- Table schemas
- Relationships
- Indexes
- Views
- Triggers
- Migration examples

### 6. SETUP_GUIDE.md
Installation and setup guide:
- Prerequisites
- Backend setup
- Frontend setup
- Mobile setup
- Docker setup
- Database setup
- API configuration
- Testing
- Deployment
- Troubleshooting

### 7. WIREFRAMES_AND_DESIGN.md
UI/UX design documentation:
- Design system
- Color palette
- Typography
- Spacing system
- Guest mode wireframes
- Authenticated mode wireframes
- Mobile wireframes
- Component specifications
- Responsive design
- Accessibility

---

## API Endpoints / Endpoint API

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Users
```
GET    /api/users/profile
PUT    /api/users/profile
PUT    /api/users/settings
GET    /api/users/summary
```

### Transactions
```
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
PUT    /api/transactions/{id}
DELETE /api/transactions/{id}
POST   /api/transactions/upload-receipt
```

### Savings Goals
```
GET    /api/savings-goals
POST   /api/savings-goals
GET    /api/savings-goals/{id}
PUT    /api/savings-goals/{id}
DELETE /api/savings-goals/{id}
```

### AI Chat
```
POST   /api/chat/message
GET    /api/chat/history
POST   /api/chat/guest-message
```

### Recommendations
```
GET    /api/recommendations
GET    /api/recommendations/{id}
PUT    /api/recommendations/{id}/read
DELETE /api/recommendations/{id}
```

### Analytics
```
GET    /api/analytics/daily-summary
GET    /api/analytics/weekly-summary
GET    /api/analytics/expense-breakdown
GET    /api/analytics/trend
```

---

## Database Schema / Skema Database

### Main Tables
- **users** - User accounts and profiles
- **transactions** - Income and expense records
- **categories** - Transaction categories
- **savings_goals** - User savings targets
- **chat_histories** - AI chat conversations
- **recommendations** - AI recommendations
- **notifications** - User notifications
- **api_tokens** - API authentication tokens
- **audit_logs** - System audit logs

---

## Environment Variables / Variabel Lingkungan

### Backend (.env)
```
APP_NAME=MoneyAssist
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=moneyassist
DB_USERNAME=postgres
DB_PASSWORD=password

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

GEMINI_API_KEY=your_api_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
SENDGRID_API_KEY=your_key

JWT_SECRET=your_secret
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MoneyAssist
VITE_APP_ENV=development
```

---

## Testing / Testing

### Backend Tests
```bash
php artisan test
php artisan test --coverage
```

### Frontend Tests
```bash
npm run test
npm run test:coverage
npm run test:watch
```

### E2E Tests
```bash
npm run cypress:open
npm run cypress:run
```

---

## Deployment / Deployment

### Deploy Backend to Heroku
```bash
heroku login
heroku create moneyassist-api
heroku addons:create heroku-postgresql:standard-0
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

### Deploy Frontend to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to AWS EC2
See SETUP_GUIDE.md for detailed instructions

---

## Contributing / Berkontribusi

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## Code Style / Gaya Kode

### Backend (PHP/Laravel)
- PSR-12 coding standard
- Use type hints
- Document with PHPDoc
- Follow Laravel conventions

### Frontend (React/TypeScript)
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Component-based architecture

### Mobile (React Native)
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Platform-specific code separation

---

## Performance Targets / Target Performa

- Page load time: < 2 seconds
- API response time: < 500ms
- Database query time: < 100ms
- Lighthouse score: > 90
- Mobile performance: > 85

---

## Security / Keamanan

- HTTPS/TLS encryption
- JWT authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Regular security audits
- Data encryption at rest

---

## Monitoring & Logging / Monitoring dan Logging

- Error tracking: Sentry
- Performance monitoring: New Relic
- Log aggregation: ELK Stack
- Uptime monitoring: UptimeRobot
- Application metrics: Custom dashboard

---

## Support & Contact / Dukungan dan Kontak

- **Email:** support@moneyassist.com
- **Website:** https://moneyassist.com
- **Documentation:** https://docs.moneyassist.com
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

---

## License / Lisensi

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Roadmap / Roadmap

### Phase 1 (Current)
- Core application setup
- Guest mode landing page
- Authentication system
- Basic dashboard

### Phase 2
- Advanced analytics
- Mobile app launch
- Multi-currency support
- Bill splitting

### Phase 3
- Investment tracking
- Budget planning
- Family sharing
- Gamification

### Phase 4
- Bank API integration
- Advanced AI features
- Community features
- Enterprise features

---

## Changelog / Changelog

See CHANGELOG.md for detailed version history.

---

## FAQ / Pertanyaan Umum

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption and security practices.

**Q: Can I export my data?**
A: Yes, you can export your data in PDF or CSV format.

**Q: Is there a mobile app?**
A: Yes, React Native apps for iOS and Android are available.

**Q: How often is the AI updated?**
A: The AI model is updated regularly with new features and improvements.

**Q: What payment methods are supported?**
A: We support credit cards, debit cards, and digital wallets.

---

## Acknowledgments / Pengakuan

- Google Gemini API for AI capabilities
- Laravel community for excellent framework
- React community for frontend library
- All contributors and supporters

---

## Version History / Riwayat Versi

- **1.0.0** (May 26, 2026) - Initial release
  - Core features implemented
  - Guest and authenticated modes
  - AI chat integration
  - Transaction tracking
  - Savings goals
  - Analytics dashboard

---

**Last Updated:** May 26, 2026  
**Maintained by:** MoneyAssist Team

---

For more information, visit the documentation files or contact support.
