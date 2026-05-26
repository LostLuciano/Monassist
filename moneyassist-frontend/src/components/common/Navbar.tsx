import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';

export default function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

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
