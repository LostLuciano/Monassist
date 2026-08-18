import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface IPhoneShortcutCardProps {
  onGoToSettings?: () => void;
}

const IPhoneShortcutCard: React.FC<IPhoneShortcutCardProps> = ({ onGoToSettings }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isTelegramConnected = Boolean(user?.telegram_id);
  const telegramWebhookUrl = 'https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto';

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
                Background Automation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Kirim tangkapan layar transaksi secara otomatis ke Bot Telegram hanya dengan mengetuk 2x punggung iPhone.
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
              Fitur Pintasan iPhone mengirimkan tangkapan layar ke bot Telegram Anda. Anda perlu menghubungkan akun Telegram Anda terlebih dahulu agar bot dapat mengenali dan mencatat transaksi ke akun Anda.
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
          
          {/* Quick Launch Button */}
          <div className="bg-gradient-to-r from-teal-950/40 via-slate-900/80 to-cyan-950/40 border border-teal-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Pintasan Siap Dipasang</span>
                <span className="text-[10px] font-bold bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">ID Terpasang: {user?.telegram_id}</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">Pasang Pintasan ke Aplikasi Shortcuts iPhone</h4>
              <p className="text-xs text-slate-400">
                Klik tombol untuk langsung membuka aplikasi Pintasan di iPhone Anda.
              </p>
            </div>

            <a
              href="shortcuts://create-shortcut"
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-teal-500/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Buka Aplikasi Shortcuts di iPhone</span>
            </a>
          </div>

          {/* Step by step Setup Guide */}
          <div className="space-y-4 pt-1">
            <h3 className="text-sm font-bold text-white">Panduan Pembuatan Pintasan (Hanya 2 Tindakan Singkat):</h3>

            <div className="space-y-4">
              
              {/* Tindakan 1 */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tindakan 1: Ambil Tangkapan Layar</h4>
                </div>
                <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                  Di aplikasi Pintasan iPhone, ketik <strong className="text-teal-300 font-semibold">Ambil Tangkapan Layar</strong> (atau <em>Take Screenshot</em>) di kolom pencarian bawah lalu pilih.
                </p>
              </div>

              {/* Tindakan 2 */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tindakan 2: Dapatkan Isi URL (Get Contents of URL)</h4>
                </div>
                
                <div className="pl-8 space-y-3.5">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ketik <strong className="text-cyan-300 font-semibold">Dapatkan Isi URL</strong> lalu atur konfigurasinya:
                  </p>

                  {/* URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">URL Endpoint Bot Telegram</label>
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl font-mono text-xs text-teal-300">
                      <span className="truncate mr-2">{telegramWebhookUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(telegramWebhookUrl, 'url')}
                        className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-xs font-sans font-bold rounded-lg shrink-0 transition-colors"
                      >
                        {copiedField === 'url' ? 'Disalin ✓' : 'Salin URL'}
                      </button>
                    </div>
                  </div>

                  {/* Method & Body */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Metode (Method):</span>
                      <span className="font-bold text-white">POST</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">Badan Permintaan (Body):</span>
                      <span className="font-bold text-white">Formulir (Form)</span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Tambahkan 2 Baris Bidang Formulir:</span>
                    
                    {/* Field 1: chat_id */}
                    <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs">
                      <div className="font-mono text-slate-300">
                        <span className="text-teal-400 font-bold">chat_id</span>: <span className="text-white font-bold">{user?.telegram_id}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(user!.telegram_id!.toString(), 'chat_id')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-teal-400 text-[10px] font-bold rounded-lg transition-colors"
                      >
                        {copiedField === 'chat_id' ? 'Disalin ✓' : 'Salin ID'}
                      </button>
                    </div>

                    {/* Field 2: photo */}
                    <div className="bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                      <span className="text-cyan-400 font-bold">photo</span>: <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">Tangkapan Layar (Pilih Variabel Tindakan 1)</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Langkah 3: Back Tap */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">3</span>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Aktifkan di Pengaturan Ketuk Belakang (Back Tap)</h4>
                </div>
                <div className="pl-8 text-xs text-slate-400 space-y-1.5 leading-relaxed">
                  <p>1. Buka <strong>Pengaturan</strong> iPhone &gt; <strong>Aksesibilitas</strong> &gt; <strong>Sentuh</strong>.</p>
                  <p>2. Gulir paling bawah &gt; pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.</p>
                  <p>3. Pilih <strong>Ketuk Dua Kali (Double Tap)</strong> &gt; centang pintasan yang Anda buat.</p>
                  <p className="text-[11px] text-teal-300 bg-teal-500/10 border border-teal-500/20 p-2.5 rounded-xl mt-2">
                    Selesai! Sekarang saat Anda melakukan Double Tap di casing iPhone, screenshot akan terkirim otomatis ke bot Telegram di latar belakang.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default IPhoneShortcutCard;
