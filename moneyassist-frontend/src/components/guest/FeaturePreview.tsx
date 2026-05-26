import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeaturePreview: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Smart Expense Tracking',
      description: 'Kategorisasikan dan pantau pengeluaran Anda secara otomatis dengan bantuan analitik AI yang cerdas.',
      color: 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/20'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: 'Financial Health Analysis',
      description: 'Dapatkan status kesehatan keuangan secara real-time: efisien, boros, atau dalam kondisi bahaya.',
      color: 'from-teal-500/20 to-green-500/20 text-teal-400 border-teal-500/20'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Savings Goals',
      description: 'Atur dan pantau target tabungan Anda dengan diagram interaktif dan pengingat batas waktu.',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/20'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI Recommendations',
      description: 'Terima saran keuangan pribadi dan taktik penghematan pengeluaran berdasarkan kebiasaan Anda.',
      color: 'from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/20'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Smart Reminders',
      description: 'Jangan pernah melewatkan pencatatan transaksi dengan pengingat harian cerdas yang ramah.',
      color: 'from-red-500/20 to-pink-500/20 text-red-400 border-red-500/20'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      title: 'Visual Reports',
      description: 'Grafik interaktif nan premium untuk memvisualisasikan tren pengeluaran dan pemasukan Anda.',
      color: 'from-indigo-500/20 to-blue-500/20 text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <div className="py-20 px-6 bg-slate-950 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-full text-xs font-semibold uppercase tracking-wider text-teal-400 mb-4">
            Fitur Unggulan
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
            Kelola Keuangan dengan Kekuatan AI
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Segala yang Anda butuhkan untuk menguasai pengelolaan arus kas pribadi secara cerdas dan otomatis.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-6 hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} border rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="mt-20 bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden max-w-4xl mx-auto">
          {/* Inner Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px]" />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Siap Mengubah Kehidupan Finansial Anda?
            </h3>
            <p className="text-slate-400 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan pengguna yang telah menghemat jutaan rupiah menggunakan rekomendasi cerdas dari AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-300 transform active:scale-95 text-sm"
              >
                Mulai Gratis Sekarang
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/60 text-slate-300 font-semibold rounded-xl transition-all text-sm"
              >
                Masuk ke Akun
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePreview;
