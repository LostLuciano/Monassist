import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logout } from '../../store/authSlice';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, pageTitle }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    {
      path: '/dashboard',
      label: 'Ringkasan Laporan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      path: '/transactions',
      label: 'Catat Transaksi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: '/ai-chat',
      label: 'Asisten AI',
      isCenter: true,
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      path: '/goals',
      label: 'Target Tabungan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      path: '/profile',
      label: 'Alaram & Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-20 md:pb-0">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 bg-slate-900/40 border-r border-slate-900 backdrop-blur-xl flex-col p-6 shrink-0 z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
            <span className="text-white font-extrabold text-lg">M</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            MoneyAssist
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User profile & Logout footer */}
        <div className="pt-6 border-t border-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sm font-bold text-white border border-slate-700">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="truncate">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-[10px] text-slate-500 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-800/40 hover:bg-red-500/10 hover:text-red-400 border border-slate-700/60 hover:border-red-500/20 text-slate-300 text-xs font-semibold rounded-xl transition-all"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header Top-Bar */}
      <header className="md:hidden sticky top-0 bg-slate-950/80 border-b border-slate-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-extrabold text-sm">M</span>
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            {pageTitle}
          </span>
        </div>
        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-white border border-slate-700">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 relative z-10 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Navigation Tab Bar with Centered AI Assistant */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-slate-950/95 border-t border-slate-900/80 backdrop-blur-lg h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center -translate-y-4.5 transition-all duration-300 relative ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`
                }
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/35 border-2 border-slate-950 text-white relative">
                  {item.icon}
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-slate-950 rounded-full animate-ping"></span>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 border border-slate-950 rounded-full"></span>
                </div>
                <span className="text-[9px] font-extrabold text-teal-400 mt-1">{item.label}</span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 w-14 h-full transition-all ${
                  isActive ? 'text-teal-400 scale-105 font-bold' : 'text-slate-500'
                }`
              }
            >
              {item.icon}
              <span className="text-[8px] font-bold text-center truncate w-full px-0.5 leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
};

export default AuthenticatedLayout;
