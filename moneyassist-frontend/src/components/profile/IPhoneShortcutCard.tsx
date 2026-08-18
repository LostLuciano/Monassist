import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { API_BASE_URL } from '../../utils/constants';

interface IPhoneShortcutCardProps {
  onGoToSettings?: () => void;
}

const IPhoneShortcutCard: React.FC<IPhoneShortcutCardProps> = ({ onGoToSettings }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isTelegramConnected = Boolean(user?.telegram_id);
  const telegramBotUrl = 'https://t.me/FinMoneyAssist_bot';
  const shortcutToken = String(user?.telegram_id || '');
  const shortcutDownloadUrl = `${API_BASE_URL}/shortcuts/download?token=${encodeURIComponent(shortcutToken)}`;
  const directServerUrl = `${API_BASE_URL}/shortcuts/upload?token=${encodeURIComponent(shortcutToken)}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/80 pb-6">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73.99.08 2.03-.49 2.65-1.23z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Pintasan Otomatis iPhone (Double-Tap)</h2>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Telegram Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Ambil screenshot dari iPhone, kirim sebagai gambar, lalu MoneyAssist mencatat transaksi dan mengirim hasilnya ke Telegram.
            </p>
          </div>
        </div>

        {/* Telegram Connection Badge */}
        <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-2.5 shrink-0 ${
          isTelegramConnected
            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
            : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isTelegramConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
          <div className="text-xs">
            <span className="text-[10px] text-slate-400 block font-bold">Status Telegram:</span>
            <span className="font-bold">{isTelegramConnected ? `Terhubung (ID: ${user?.telegram_id})` : 'Belum Terhubung'}</span>
          </div>
        </div>
      </div>

      {/* IF NOT CONNECTED TO TELEGRAM: SHOW ACCESS LOCK */}
      {!isTelegramConnected ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-400 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Hubungkan Akun Telegram Terlebih Dahulu</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fitur Pintasan iPhone membutuhkan akun Telegram yang sudah terhubung agar bot dapat mengenali dan mencatat transaksi ke akun Anda.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={onGoToSettings}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-teal-500/20"
            >
              Buka Tab Setelan & Hubungkan Telegram
            </button>
          </div>
        </div>
      ) : (
        /* IF TELEGRAM IS CONNECTED: SHOW READY-TO-USE SHORTCUT & BACK-TAP GUIDE */
        <div className="space-y-6">
          
          {/* Primary generated shortcut */}
          <div className="bg-gradient-to-r from-teal-950/50 via-slate-900/90 to-cyan-950/50 border border-teal-500/40 rounded-3xl p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-2xl shadow-teal-950/40">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-teal-300 uppercase tracking-wider">Pintasan Personal</span>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Tanpa Token Bot</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Pasang Pintasan Upload Server
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pintasan ini mengambil screenshot, mengirimnya ke backend MoneyAssist, lalu hasil analisis otomatis dikirim balik ke chat Telegram Anda.
              </p>
            </div>

            <a
              href={shortcutDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2.5 shrink-0 shadow-xl shadow-teal-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73.99.08 2.03-.49 2.65-1.23z" />
              </svg>
              <span>Unduh Pintasan Personal</span>
            </a>
          </div>

          {/* 3 Simple Setup Steps */}
          <div className="space-y-4 pt-1">
            <h3 className="text-sm font-bold text-white">Panduan Aktivasi Cepat (3 Langkah):</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Step 1 */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">1</div>
                <h4 className="text-xs font-bold text-white">Unduh Pintasan</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Ketuk <strong>"Unduh Pintasan Personal"</strong> di iPhone, lalu pilih <strong>Tambahkan Pintasan</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">2</div>
                <h4 className="text-xs font-bold text-white">Buka Pengaturan Aksesibilitas</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Buka <strong>Pengaturan</strong> iPhone &gt; <strong>Aksesibilitas</strong> &gt; <strong>Sentuh</strong> &gt; pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">3</div>
                <h4 className="text-xs font-bold text-white">Pilih Ketuk Dua Kali</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pilih <strong>Ketuk Dua Kali</strong> &gt; gulir ke daftar pintasan dan centang <strong className="text-teal-300 font-mono">MoneyAssist scan</strong>.
                </p>
              </div>

            </div>
          </div>

          {/* Endpoint Details */}
          <div className="border-t border-slate-800/80 pt-5 space-y-3">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-white block mb-1">Mode Telegram langsung:</span>
              Jika Anda membuat pintasan manual, gunakan aksi Telegram untuk mengirim hasil screenshot ke{' '}
              <a href={telegramBotUrl} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:underline">
                @FinMoneyAssist_bot
              </a>
              . Bot akan menerima gambar lewat webhook dan memprosesnya dengan alur analisis yang sama.
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Endpoint Khusus Akun Anda</span>
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ID Telegram: {user?.telegram_id}
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between font-mono text-xs text-slate-400">
              <span className="truncate mr-3 text-teal-300">{directServerUrl}</span>
              <button
                type="button"
                onClick={() => handleCopy(directServerUrl, 'endpoint')}
                className="text-[10px] bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded text-teal-400 font-sans font-bold transition-colors shrink-0"
              >
                {copiedField === 'endpoint' ? 'Disalin ✓' : 'Salin URL'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default IPhoneShortcutCard;
