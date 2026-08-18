import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();

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

  const transactionTab = new URLSearchParams(location.search).get('tab');
  const mobileNavItems = [
    {
      to: '/dashboard',
      label: 'Beranda',
      isActive: location.pathname === '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3.25 3.75 10.2v9.05c0 .83.67 1.5 1.5 1.5h4.25v-5.5h5v5.5h4.25c.83 0 1.5-.67 1.5-1.5V10.2L12 3.25Zm0 2.62 6.25 5.26v7.62H16.5v-5.5h-9v5.5H5.75v-7.62L12 5.87Z" />
        </svg>
      )
    },
    {
      to: '/transactions?tab=history',
      label: 'Riwayat Transaksi',
      isActive: location.pathname === '/transactions' && transactionTab === 'history',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M3.5 12a8.5 8.5 0 1 0 2.49-6.01M3.5 5.5v4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 7.5v5l3.25 2" />
        </svg>
      )
    },
    {
      to: '/transactions?tab=form',
      label: 'Catat Transaksi',
      isActive: location.pathname === '/transactions' && transactionTab !== 'history',
      isPrimary: true,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
        </svg>
      )
    },
    {
      to: '/goals',
      label: 'Target Tabungan',
      isActive: location.pathname === '/goals',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect width="16" height="11" x="4" y="6.5" rx="2" strokeWidth={2.1} />
          <path strokeLinecap="round" strokeWidth={2.1} d="M7 10h10M7 14h4" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row pb-24 md:pb-0 overflow-x-hidden">
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
      <header className="md:hidden sticky top-0 bg-slate-950/95 border-b border-slate-900/80 backdrop-blur-md px-4 py-3 flex justify-between items-center z-20">
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
      <main className="flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8 relative z-10 max-w-5xl mx-auto w-full">
        {children}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] md:hidden">
        <nav className="pointer-events-auto mx-auto grid h-14 w-full max-w-[320px] grid-cols-4 items-center gap-1 rounded-full border border-white/40 bg-zinc-200/95 p-1.5 text-zinc-900 shadow-[0_14px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          {mobileNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              title={item.label}
              className={`flex h-11 min-w-0 items-center justify-center rounded-full transition-all duration-200 ${
                item.isActive
                  ? 'bg-zinc-300 text-white shadow-inner'
                  : 'text-zinc-800 hover:bg-zinc-300/60 active:bg-zinc-300/80'
              } ${item.isPrimary ? 'text-[1.05rem]' : ''}`}
            >
              {item.icon}
            </Link>
          ))}
        </nav>
      </div>

    </div>
  );
};

export default AuthenticatedLayout;
