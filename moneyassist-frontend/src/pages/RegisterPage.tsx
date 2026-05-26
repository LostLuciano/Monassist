import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { api } from '../services/api';
import Auth3DScene from '../components/auth/Auth3DScene';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirmation) {
      setError('Password konfirmasi tidak cocok dengan password utama');
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
      setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Column: Interactive 3D Canvas Scene */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 border-r border-slate-800/60 relative flex-col justify-between p-10 overflow-hidden">
        {/* Floating Brand Logo */}
        <div className="flex items-center gap-3 z-20">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            MoneyAssist
          </span>
        </div>

        {/* 3D Canvas Scene Container */}
        <div className="absolute inset-0 z-10">
          <Auth3DScene />
        </div>

        {/* Bottom copyright/info */}
        <div className="z-20 text-xs text-slate-500">
          &copy; 2026 MoneyAssist. All rights reserved. Secure & encrypted.
        </div>
      </div>

      {/* Right Column: Sleek Glassmorphic Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-slate-950 relative">
        {/* Background decorative glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Back to Home floating action */}
        <Link 
          to="/" 
          className="absolute top-8 right-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors duration-200"
        >
          {/* Home Icon Inline SVG */}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>

        {/* Inner Container */}
        <div className="max-w-md w-full z-10 animate-fade-in my-8">
          {/* Header Mobile Brand & Text */}
          <div className="text-center lg:text-left mb-6">
            <div className="flex justify-center lg:justify-start items-center gap-2 mb-3 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MoneyAssist</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Mulai Petualangan Anda
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Buat akun Anda secara gratis untuk mendapatkan saran keuangan yang cerdas.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-3.5 rounded-xl text-sm flex items-start gap-2.5 animate-pulse">
                  {/* Warning Icon Inline SVG */}
                  <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    {/* User Icon Inline SVG */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-white placeholder-slate-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    {/* Envelope Icon Inline SVG */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-white placeholder-slate-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password (Minimal 8 karakter)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    {/* Lock Closed Icon Inline SVG */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    minLength={8}
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-white placeholder-slate-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon Inline SVG */
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      /* Eye Icon Inline SVG */
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                    {/* Lock Closed Icon Inline SVG */}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    placeholder="Masukkan ulang password"
                    className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-3 pl-11 pr-11 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all text-white placeholder-slate-500 text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      /* Eye Slash Icon Inline SVG */
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    ) : (
                      /* Eye Icon Inline SVG */
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-300 transform active:scale-[0.99] flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    {/* Arrow Right Icon Inline SVG */}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-sm text-slate-400 mt-6">
              Sudah memiliki akun?{' '}
              <Link 
                to="/login" 
                className="text-teal-400 hover:text-teal-300 font-semibold transition-colors decoration-2 hover:underline"
              >
                Login Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
