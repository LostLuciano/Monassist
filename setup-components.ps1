# MoneyAssist Components Generator Script
# This script will create all React components

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MoneyAssist Components Generator" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseDir = "moneyassist-frontend/src"

Write-Host "Generating components..." -ForegroundColor Yellow
Write-Host ""

# Generate component files with content
$components = @{
    "components/common/Navbar.tsx" = @"
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            MoneyAssist
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/transactions" className="text-gray-700 hover:text-primary">
                  Transactions
                </Link>
                <Link to="/goals" className="text-gray-700 hover:text-primary">
                  Goals
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
"@

    "components/common/LoadingSpinner.tsx" = @"
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}
"@

    "components/common/InstallPrompt.tsx" = @"
import { useEffect, useState } from 'react';

export default function InstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`User response: {outcome}`);
      setInstallPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-elevation-3 max-w-sm z-50">
      <h3 className="font-semibold text-lg mb-2">Install MoneyAssist</h3>
      <p className="text-gray-600 mb-4">Get quick access to your finances</p>
      <div className="flex space-x-2">
        <button onClick={handleInstall} className="btn-primary flex-1">
          Install
        </button>
        <button onClick={() => setShowPrompt(false)} className="btn-secondary flex-1">
          Not Now
        </button>
      </div>
    </div>
  );
}
"@

    "components/auth/ProtectedRoute.tsx" = @"
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

export default function ProtectedRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
"@

    "pages/LandingPage.tsx" = @"
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to MoneyAssist
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your AI-powered personal finance assistant
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="btn-primary">
              Start Free Trial
            </Link>
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* AI Chat Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-elevation-2 p-8">
          <h2 className="text-2xl font-bold mb-4">MoneyAssist AI</h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-800">
                Welcome! I'm MoneyAssist, your AI financial assistant. 
                I can help you understand your spending patterns and achieve your goals.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Sample Questions:</p>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                How can I reduce my spending?
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                What's a good savings target?
              </button>
              <button className="w-full text-left px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                Where am I spending the most?
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-600">Overview keuangan Anda dengan jelas</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Transactions</h3>
            <p className="text-gray-600">Catat pengeluaran dengan mudah</p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Goals</h3>
            <p className="text-gray-600">Buat dan pantau target tabungan</p>
          </div>
        </div>
      </section>
    </div>
  );
}
"@

    "pages/LoginPage.tsx" = @"
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { api } from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">MoneyAssist</h1>
          <p className="text-gray-600 mt-2">Welcome Back</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"@

    "pages/RegisterPage.tsx" = @"
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { api } from '../services/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      dispatch(setCredentials(response.data));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">MoneyAssist</h1>
          <p className="text-gray-600 mt-2">Create Account</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                minLength={8}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Min 8 characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
"@

    "pages/DashboardPage.tsx" = @"
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { api } from '../services/api';
import { FinancialSummary } from '../types';
import { formatCurrency } from '../utils/formatters';
import Navbar from '../components/common/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await api.get('/users/summary');
      setSummary(response.data.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          {summary && (
            <span className={`badge-{summary.financial_status} mt-2 inline-block`}>
              Status: {summary.financial_status}
            </span>
          )}
        </div>

        {summary && (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Income
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.total_income)}
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Expense
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.total_expense)}
                </p>
              </div>

              <div className="card">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Balance
                </h3>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(summary.balance)}
                </p>
              </div>
            </div>

            {/* Expense by Category */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Expense by Category</h2>
              <div className="space-y-3">
                {summary.expense_by_category.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-gray-600">
                        {formatCurrency(item.amount)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `{item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
"@

    "pages/TransactionsPage.tsx" = @"
import Navbar from '../components/common/Navbar';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Transactions</h1>
        <p className="text-gray-600">Transaction management coming soon...</p>
      </div>
    </div>
  );
}
"@

    "pages/GoalsPage.tsx" = @"
import Navbar from '../components/common/Navbar';

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Savings Goals</h1>
        <p className="text-gray-600">Goals management coming soon...</p>
      </div>
    </div>
  );
}
"@

    "pages/ProfilePage.tsx" = @"
import Navbar from '../components/common/Navbar';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>
        <p className="text-gray-600">Profile management coming soon...</p>
      </div>
    </div>
  );
}
"@

    "store/transactionSlice.ts" = @"
import { createSlice } from '@reduxjs/toolkit';

interface TransactionState {
  transactions: any[];
  loading: boolean;
}

const initialState: TransactionState = {
  transactions: [],
  loading: false,
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
});

export default transactionSlice.reducer;
"@

    "store/goalSlice.ts" = @"
import { createSlice } from '@reduxjs/toolkit';

interface GoalState {
  goals: any[];
  loading: boolean;
}

const initialState: GoalState = {
  goals: [],
  loading: false,
};

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
});

export default goalSlice.reducer;
"@

    "store/uiSlice.ts" = @"
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: false,
  theme: 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleSidebar, setTheme } = uiSlice.actions;
export default uiSlice.reducer;
"@
}

foreach ($file in $components.Keys) {
    $content = $components[$file]
    $filePath = "$baseDir/$file"
    Set-Content -Path $filePath -Value $content
    Write-Host "  Created: $file" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Components Generated Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All React components have been created." -ForegroundColor White
Write-Host "You can now start the development server:" -ForegroundColor Yellow
Write-Host "  cd moneyassist-frontend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
