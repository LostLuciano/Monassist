import React from 'react';
import { useNavigate } from 'react-router-dom';
import Auth3DScene from '../auth/Auth3DScene';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-slate-950 text-slate-100 overflow-hidden min-h-screen flex items-center pt-24 pb-16">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Call-To-Action (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
              AI-Powered Financial Assistant
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white">
              Kuasai Masa Depan
              <span className="block bg-gradient-to-r from-teal-400 via-cyan-400 to-cyan-300 bg-clip-text text-transparent mt-1">
                Finansial Anda
              </span>
            </h1>
            
            <p className="text-slate-400 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Pelacakan transaksi otomatis, analisis pengeluaran berbasis AI, serta saran finansial pribadi untuk membantu Anda menabung lebih banyak setiap bulan.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-300 font-semibold transform hover:-translate-y-0.5 text-sm"
              >
                Mulai Secara Gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 rounded-xl transition-all font-semibold text-sm"
              >
                Masuk ke Akun
              </button>
            </div>

            {/* Stats Bento style */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0 border-t border-slate-900 mt-8">
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">10K+</div>
                <div className="text-slate-500 text-xs mt-1">Pengguna Aktif</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">Rp2M+</div>
                <div className="text-slate-500 text-xs mt-1">Uang Ditabung</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-extrabold text-white">4.9★</div>
                <div className="text-slate-500 text-xs mt-1">Rating Aplikasi</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Scene + Overlaid Widgets (lg:col-span-5) */}
          <div className="lg:col-span-5 relative w-full flex flex-col justify-center items-center">
            
            {/* The 3D Scene Container - Compact on Mobile, Full on Desktop */}
            <div className="w-full h-[280px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden relative border border-slate-900 bg-slate-900/20 backdrop-blur-sm">
              <Auth3DScene />
            </div>

            {/* Floating Glassmorphic Widgets overlaid below or on top of 3D Scene */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Card 1 */}
              <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-teal-500/20 transition-all">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Status Keuangan</div>
                    <div className="text-sm font-extrabold text-white">Efisien & Sehat</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Tabungan Bulan Ini</span>
                  <span className="font-bold text-emerald-400">+Rp12,5 Jt</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-5 hover:border-cyan-500/20 transition-all">
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Target Tabungan</div>
                    <div className="text-sm font-extrabold text-white">75% Tercapai</div>
                  </div>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-1.5 rounded-full shadow-lg shadow-teal-500/20" style={{ width: '75%' }} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;
