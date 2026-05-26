import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/guest/HeroSection';
import FeaturePreview from '../components/guest/FeaturePreview';
import AIChat from '../components/guest/AIChat';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      
      {/* Responsive Navbar */}
      <nav className="bg-slate-950/80 border-b border-slate-900/60 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/25">
                <span className="text-white font-extrabold text-lg">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                MoneyAssist
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
              <button 
                onClick={() => scrollToSection('features')} 
                className="hover:text-teal-400 transition-colors font-medium"
              >
                Fitur Utama
              </button>
              <button 
                onClick={() => scrollToSection('ai-chat')} 
                className="hover:text-teal-400 transition-colors font-medium"
              >
                Coba AI Chat
              </button>
            </div>

            {/* Navigation Action Buttons (Highly Compact & Responsive) */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/login')}
                className="px-3.5 py-2 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors font-semibold"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-300 transform active:scale-95 shrink-0"
              >
                Mulai Gratis
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section (Includes 3D Canvas) */}
      <HeroSection />

      {/* Integrated AI Chat Section (No Pop-ups!) */}
      <section id="ai-chat" className="py-20 px-6 bg-slate-950 relative border-t border-slate-900/60">
        {/* Glow ambient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column: AI Promo text */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-400">
              Uji Coba Langsung
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Tanya AI Keuangan Kami
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Cobalah asisten AI secara langsung. Dapatkan rekomendasi dan tips mengelola arus kas bulanan secara cerdas dan efisien tanpa perlu membuka pop-up atau jendela baru.
            </p>
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
              <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Percakapan terenkripsi & privat.</span>
            </div>
          </div>

          {/* Right Column: Chat Sandbox Interface */}
          <div className="lg:col-span-7 w-full">
            <AIChat />
          </div>

        </div>
      </section>

      {/* Feature Preview Section */}
      <div id="features">
        <FeaturePreview />
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/80 text-slate-500 py-12 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">M</span>
                </div>
                <span className="text-lg font-bold text-white">MoneyAssist</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Asisten keuangan cerdas berbasis kecerdasan buatan untuk masa depan yang mapan.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Produk</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Fitur Utama</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Keamanan</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Perusahaan</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Kebijakan</h3>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Privasi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ketentuan Layanan</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-900/60 mt-8 pt-8 text-center text-xs text-slate-600">
            <p>&copy; 2026 MoneyAssist. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
