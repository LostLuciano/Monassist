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

  const desktopNavItems = [
    {
      path: '/dashboard',
      label: 'Ringkasan Laporan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/transactions',
      label: 'Catat Transaksi',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      path: '/ai-chat',
      label: 'Asisten AI',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      path: '/goals',
      label: 'Target Tabungan',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      path: '/profile',
      label: 'Setelan & Profil',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-24 md:pb-0">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex md:w-64 bg-slate-900/40 border-r border-slate-900/80 backdrop-blur-xl flex-col p-6 shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="text-slate-950 font-black text-lg">M</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            MoneyAssist
          </span>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 space-y-1.5">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800/90 text-teal-400 font-bold border border-slate-700/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
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
            className="w-full py-2.5 bg-slate-900 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 text-slate-400 text-xs font-semibold rounded-xl transition-all"
          >
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header Top-Bar */}
      <header className="md:hidden sticky top-0 bg-slate-950/80 border-b border-slate-900/60 backdrop-blur-md px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-slate-950 font-black text-sm">M</span>
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            {pageTitle === 'Dashboard' ? 'MoneyAssist' : pageTitle}
          </span>
        </div>
        <div 
          onClick={() => navigate('/profile')}
          className="w-8 h-8 bg-slate-850 rounded-full flex items-center justify-center text-xs font-bold text-teal-400 border border-slate-750 cursor-pointer"
        >
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 relative z-10 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* ============================================================ */}
      {/* 8. MODERN FLOATING PILL BOTTOM NAVIGATION (Mobile) */}
      {/* ============================================================ */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-slate-900/90 border border-slate-800/90 backdrop-blur-2xl rounded-full px-4 py-2 shadow-2xl shadow-slate-950/90 flex items-center justify-between gap-1 w-full max-w-md">
          
          {/* 1. Home */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">Home</span>
          </NavLink>

          {/* 2. Transaksi */}
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">Transaksi</span>
          </NavLink>

          {/* 3. CENTER PROMINENT FLOATING PLUS BUTTON */}
          <button
            onClick={() => navigate('/transactions')}
            className="w-12 h-12 bg-gradient-to-tr from-teal-400 to-cyan-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition-transform shrink-0 -my-2"
            title="Tambah Transaksi Baru"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.8} d="M12 6v12m6-6H6" />
            </svg>
          </button>

          {/* 4. AI Assistant */}
          <NavLink
            to="/ai-chat"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">AI</span>
          </NavLink>

          {/* 5. Target / Goals */}
          <NavLink
            to="/goals"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all ${
                isActive ? 'text-teal-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-medium mt-0.5">Target</span>
          </NavLink>

        </nav>
      </div>

    </div>
  );
};

export default AuthenticatedLayout;
