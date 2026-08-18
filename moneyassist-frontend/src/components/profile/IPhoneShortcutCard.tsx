import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const IPhoneShortcutCard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const autoInstallUrl = `https://monassist.vercel.app/api/shortcuts/download?chat_id=${user?.telegram_id || ''}`;
  const telegramWebhookUrl = 'https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto">
      
      {/* Top Banner */}
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
                Instalasi 1-Klik
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Pasang alur kerja otomatis ke iPhone Anda tanpa perlu mengetik tindakan atau URL manual.
            </p>
          </div>
        </div>

        {/* 1-Click Install Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={autoInstallUrl}
            download="Scan_MoneyAssist.shortcut"
            className="px-5 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Pasang Pintasan Otomatis (1-Klik)</span>
          </a>
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-gradient-to-r from-teal-950/30 via-slate-900/60 to-cyan-950/30 border border-teal-500/20 rounded-2xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Cara Kerja di Latar Belakang (Silent Background):</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed pl-6">
          Ketika Anda mengetuk 2x bagian belakang casing iPhone setelah selesai transaksi, iPhone akan <strong>mengambil tangkapan layar secara hening</strong> dan <strong>mengirimkannya langsung ke Bot Telegram MoneyAssist</strong> di latar belakang. AI akan menganalisis struk/transfer dan langsung membalas konfirmasi catatan ke Telegram Anda!
        </p>
      </div>

      {/* 3 Step Visual Guide */}
      <div className="space-y-4 pt-2">
        <h3 className="text-sm font-bold text-white">Panduan Aktivasi Cepat (3 Langkah):</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Step 1 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">1</div>
            <h4 className="text-xs font-bold text-white">Unduh & Tambahkan Pintasan</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Klik tombol hijau <strong>"Pasang Pintasan Otomatis"</strong> di atas melalui Safari iPhone. Saat muncul konfirmasi, ketuk <strong>Tambahkan Pintasan</strong>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">2</div>
            <h4 className="text-xs font-bold text-white">Buka Pengaturan Aksesibilitas</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Di iPhone Anda, buka <strong>Pengaturan</strong> &gt; <strong>Aksesibilitas</strong> &gt; <strong>Sentuh</strong> &gt; gulir ke paling bawah pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="w-7 h-7 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">3</div>
            <h4 className="text-xs font-bold text-white">Pilih Ketuk Dua Kali</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Pilih <strong>Ketuk Dua Kali (Double Tap)</strong>, lalu gulir ke bagian Pintasan dan centang <strong className="text-teal-300 font-mono">Scan MoneyAssist</strong>.
            </p>
          </div>

        </div>
      </div>

      {/* Manual Inspection Info */}
      <div className="border-t border-slate-800/80 pt-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400">Rincian Teknis Endpoint (Otomatis Terkonfigurasi)</span>
          {user?.telegram_id && (
            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              ID Telegram Terisi: {user.telegram_id}
            </span>
          )}
        </div>

        <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between font-mono text-xs text-slate-400">
          <span className="truncate mr-3 text-teal-300">{telegramWebhookUrl}</span>
          <button
            type="button"
            onClick={() => handleCopy(telegramWebhookUrl, 'url')}
            className="text-[10px] bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded text-teal-400 font-sans font-bold transition-colors shrink-0"
          >
            {copiedField === 'url' ? 'Disalin ✓' : 'Salin URL'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default IPhoneShortcutCard;
