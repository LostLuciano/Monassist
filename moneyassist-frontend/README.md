# MoneyAssist Frontend

AI-powered personal finance management application built with React, TypeScript, and Vite.

## 🚀 Features

- **Smart Expense Tracking**: Automatically categorize and track all your expenses
- **AI Financial Assistant**: Get personalized recommendations and insights
- **Savings Goals**: Set and track multiple savings goals with progress monitoring
- **Real-time Analytics**: Beautiful charts and graphs to visualize spending patterns
- **Guest Mode**: Try the app before signing up with AI chat preview
- **PWA Support**: Install as a mobile app with offline capabilities
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Backend API running (see backend README)

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your backend API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🧪 Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── common/         # Reusable common components
│   ├── dashboard/      # Dashboard-specific components
│   ├── goals/          # Savings goals components
│   ├── guest/          # Guest mode components
│   ├── profile/        # User profile components
│   ├── recommendations/# AI recommendations components
│   └── transactions/   # Transaction management components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useGoals.ts     # Goals management hook
│   ├── useResponsive.ts# Responsive design hook
│   └── useTransactions.ts # Transactions hook
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   ├── GoalsPage.tsx
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── ProfilePage.tsx
│   ├── RegisterPage.tsx
│   └── TransactionsPage.tsx
├── services/           # API service layer
│   ├── api.ts          # Axios configuration
│   ├── authService.ts  # Authentication API
│   ├── chatService.ts  # AI chat API
│   ├── goalService.ts  # Goals API
│   ├── recommendationService.ts # Recommendations API
│   └── transactionService.ts    # Transactions API
├── store/              # Redux store
│   ├── authSlice.ts    # Authentication state
│   ├── goalSlice.ts    # Goals state
│   ├── store.ts        # Store configuration
│   ├── transactionSlice.ts # Transactions state
│   └── uiSlice.ts      # UI state
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── constants.ts    # App constants
│   └── formatters.ts   # Formatting utilities
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **date-fns** - Date utilities

## 🔑 Key Components

### Authentication
- `LoginPage` - User login
- `RegisterPage` - User registration
- `ProtectedRoute` - Route protection

### Dashboard
- `DashboardPage` - Main dashboard view
- `StatisticsCard` - Financial statistics display
- `ExpenseChart` - Expense breakdown chart
- `TrendChart` - Spending trends visualization
- `RecentTransactions` - Recent transaction list

### Transactions
- `TransactionsPage` - Transaction management
- `TransactionList` - Transaction listing with filters
- `TransactionForm` - Add/edit transaction form

### Goals
- `GoalsPage` - Savings goals management
- `GoalsList` - Goals listing
- `GoalForm` - Add/edit goal form
- `GoalProgress` - Goal progress visualization

### Guest Mode
- `LandingPage` - Landing page with hero section
- `AIChat` - AI chat assistant for guests
- `HeroSection` - Hero section component
- `FeaturePreview` - Feature showcase

### Profile
- `ProfilePage` - User profile management
- `ProfileForm` - Edit profile information
- `SettingsForm` - App settings and preferences

### Recommendations
- `RecommendationsList` - AI recommendations list
- `RecommendationCard` - Individual recommendation card

## 🔐 Authentication Flow

1. User visits landing page (guest mode)
2. Can interact with AI chat assistant (limited)
3. Login/Register to access full features
4. JWT token stored in localStorage
5. Token automatically included in API requests
6. Protected routes redirect to login if not authenticated

## 📱 PWA Features

- **Offline Support**: Service worker caches assets
- **Install Prompt**: Custom install prompt component
- **Background Sync**: Sync transactions when back online
- **Push Notifications**: Financial reminders and alerts
- **App Shortcuts**: Quick actions from home screen

## 🎯 State Management

The app uses Redux Toolkit for state management with the following slices:

- **authSlice**: User authentication and profile
- **transactionSlice**: Transaction data and filters
- **goalSlice**: Savings goals
- **uiSlice**: UI state, loading, errors, recommendations

## 🌐 API Integration

All API calls go through the centralized `api.ts` service which:
- Adds authentication token to requests
- Handles request/response interceptors
- Manages error handling
- Provides consistent API interface

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Custom color scheme**: Teal/Cyan gradient (inspired by Wise app)
- **Responsive breakpoints**: Mobile-first approach
- **Dark mode ready**: Theme system in place

## 🧩 Custom Hooks

### useAuth
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### useTransactions
```typescript
const {
  transactions,
  createTransaction,
  getTotalIncome,
  getTotalExpense
} = useTransactions();
```

### useGoals
```typescript
const {
  goals,
  createGoal,
  getActiveGoals,
  getOverallProgress
} = useGoals();
```

### useResponsive
```typescript
const { isMobile, isTablet, isDesktop } = useResponsive();
```

## 🔧 Environment Variables

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=MoneyAssist
VITE_APP_VERSION=1.0.0
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```bash
docker build -t moneyassist-frontend .
docker run -p 80:80 moneyassist-frontend
```

## 🐛 Troubleshooting

### CORS Issues
Make sure your backend API has CORS enabled for your frontend URL.

### API Connection Failed
Check that `VITE_API_URL` in `.env` points to your running backend.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@moneyassist.com or open an issue in the repository.

## 🙏 Acknowledgments

- Design inspired by [Wise](https://wise.com)
- Icons from [Heroicons](https://heroicons.com)
- Charts powered by [Recharts](https://recharts.org)
