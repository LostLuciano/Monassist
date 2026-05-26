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
import AIChatPage from './pages/AIChatPage';

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
          <Route path="/ai-chat" element={<AIChatPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
