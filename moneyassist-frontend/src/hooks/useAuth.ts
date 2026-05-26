import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store/store';
import { login, register, logout } from '../store/authSlice';
import { LoginCredentials, RegisterData } from '../services/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (data: RegisterData) => {
    try {
      await dispatch(register(data)).unwrap();
      navigate('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isAuthenticated = !!token && !!user;

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout
  };
};
