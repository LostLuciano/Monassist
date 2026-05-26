# MoneyAssist Frontend Setup Script
# This script will create all necessary files and folders for the frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MoneyAssist Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = "moneyassist-frontend"

# Create directory structure
Write-Host "Creating directory structure..." -ForegroundColor Yellow

$directories = @(
    "$baseDir/src/components/common",
    "$baseDir/src/components/auth",
    "$baseDir/src/components/guest",
    "$baseDir/src/components/dashboard",
    "$baseDir/src/components/transactions",
    "$baseDir/src/components/goals",
    "$baseDir/src/components/recommendations",
    "$baseDir/src/components/profile",
    "$baseDir/src/pages",
    "$baseDir/src/services",
    "$baseDir/src/store",
    "$baseDir/src/hooks",
    "$baseDir/src/types",
    "$baseDir/src/utils",
    "$baseDir/src/styles",
    "$baseDir/public/images",
    "$baseDir/public/icons"
)

foreach ($dir in $directories) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  Created: $dir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Directory structure created successfully!" -ForegroundColor Green
Write-Host ""

# Create TypeScript type definitions
Write-Host "Creating TypeScript type definitions..." -ForegroundColor Yellow

$typesContent = @"
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profile_photo_path?: string;
  monthly_income: number;
  reminder_frequency: string;
  reminder_time: string;
  notification_enabled: boolean;
  created_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  type: 'income' | 'expense';
  amount: number;
  description?: string;
  receipt_image_path?: string;
  transaction_date: string;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon?: string;
  color?: string;
}

export interface SavingsGoal {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
  category?: string;
  status: 'active' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high';
  progress_percentage?: number;
  remaining_amount?: number;
  days_remaining?: number;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: number;
  user_id: number;
  type: string;
  title: string;
  description: string;
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user_id?: number;
  message: string;
  response: string;
  is_guest: boolean;
  created_at: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  financial_status: 'controlled' | 'elevated' | 'critical';
  expense_by_category: ExpenseByCategory[];
  savings_goals_progress: SavingsGoal[];
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
  percentage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}
"@

Set-Content -Path "$baseDir/src/types/index.ts" -Value $typesContent
Write-Host "  Created: types/index.ts" -ForegroundColor Green

Write-Host ""
Write-Host "Creating utility functions..." -ForegroundColor Yellow

# Create utils
$utilsContent = @"
// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatPercentage = (value: number): string => {
  return `{value.toFixed(1)}%`;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
"@

Set-Content -Path "$baseDir/src/utils/formatters.ts" -Value $utilsContent
Write-Host "  Created: utils/formatters.ts" -ForegroundColor Green

$constantsContent = @"
// src/utils/constants.ts
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  GOALS: '/goals',
  PROFILE: '/profile',
  RECOMMENDATIONS: '/recommendations',
} as const;

export const FINANCIAL_STATUS = {
  CONTROLLED: 'controlled',
  ELEVATED: 'elevated',
  CRITICAL: 'critical',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const GOAL_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
} as const;
"@

Set-Content -Path "$baseDir/src/utils/constants.ts" -Value $constantsContent
Write-Host "  Created: utils/constants.ts" -ForegroundColor Green

Write-Host ""
Write-Host "Creating API service..." -ForegroundColor Yellow

# Create API service
$apiServiceContent = @"
// src/services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer {token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  getApi() {
    return this.api;
  }
}

export const apiService = new ApiService();
export const api = apiService.getApi();
"@

Set-Content -Path "$baseDir/src/services/api.ts" -Value $apiServiceContent
Write-Host "  Created: services/api.ts" -ForegroundColor Green

Write-Host ""
Write-Host "Creating Redux store..." -ForegroundColor Yellow

# Create Redux store
$storeContent = @"
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice';
import goalReducer from './goalSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    goals: goalReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
"@

Set-Content -Path "$baseDir/src/store/store.ts" -Value $storeContent
Write-Host "  Created: store/store.ts" -ForegroundColor Green

$authSliceContent = @"
// src/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
"@

Set-Content -Path "$baseDir/src/store/authSlice.ts" -Value $authSliceContent
Write-Host "  Created: store/authSlice.ts" -ForegroundColor Green

Write-Host ""
Write-Host "Creating App.tsx..." -ForegroundColor Yellow

# Create App.tsx
$appContent = @"
// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import GoalsPage from './pages/GoalsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import InstallPrompt from './components/common/InstallPrompt';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <InstallPrompt />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
"@

Set-Content -Path "$baseDir/src/App.tsx" -Value $appContent
Write-Host "  Created: App.tsx" -ForegroundColor Green

Write-Host ""
Write-Host "Creating README..." -ForegroundColor Yellow

# Create README
$readmeContent = @"
# MoneyAssist Frontend

AI-powered personal finance management application built with React, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Install dependencies:
``````bash
npm install
``````

2. Copy environment file:
``````bash
cp .env.example .env.local
``````

3. Update .env.local with your API URL

## Development

Start development server:
``````bash
npm run dev
``````

The app will be available at http://localhost:5173

## Build

Build for production:
``````bash
npm run build
``````

Preview production build:
``````bash
npm run preview
``````

## Testing

Run tests:
``````bash
npm run test
``````

Run tests with coverage:
``````bash
npm run test:coverage
``````

## Project Structure

``````
src/
├── components/       # React components
│   ├── common/      # Shared components
│   ├── auth/        # Authentication components
│   ├── guest/       # Guest mode components
│   ├── dashboard/   # Dashboard components
│   ├── transactions/# Transaction components
│   ├── goals/       # Goals components
│   └── profile/     # Profile components
├── pages/           # Page components
├── services/        # API services
├── store/           # Redux store
├── hooks/           # Custom hooks
├── types/           # TypeScript types
├── utils/           # Utility functions
└── styles/          # Global styles
``````

## Features

- Progressive Web App (PWA)
- Offline support
- Push notifications
- Responsive design
- TypeScript
- Tailwind CSS
- Redux state management
- React Router

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Documentation

See the main documentation in the parent directory for complete setup and deployment instructions.
"@

Set-Content -Path "$baseDir/README.md" -Value $readmeContent
Write-Host "  Created: README.md" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. cd moneyassist-frontend" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. cp .env.example .env.local" -ForegroundColor White
Write-Host "4. npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "The development server will start at http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: You still need to create individual component files." -ForegroundColor Yellow
Write-Host "Run 'setup-components.ps1' to generate all component files." -ForegroundColor Yellow
Write-Host ""
