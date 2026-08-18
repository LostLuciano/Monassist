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

  const telegramWebhookUrl = 'https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto';

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
              <h2 className="text-lg font-bold text-white">Panduan Pintasan iPhone (Double-Tap Otomatis)</h2>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Background Screenshot
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Cukup tambahkan 2 tindakan singkat di aplikasi Pintasan iPhone untuk mencatat transaksi otomatis saat Double-Tap.
            </p>
          </div>
        </div>

        {/* Telegram ID Status */}
        <div className="bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="text-xs">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">ID Telegram Anda:</span>
            <span className="text-white font-mono font-bold">{user?.telegram_id || 'Belum Terhubung'}</span>
          </div>
          {user?.telegram_id && (
            <button
              type="button"
              onClick={() => handleCopy(user.telegram_id!.toString(), 'chat_id')}
              className="px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-xs font-bold rounded-xl transition-colors shrink-0"
            >
              {copiedField === 'chat_id' ? 'Disalin ✓' : 'Salin ID'}
            </button>
          )}
        </div>
      </div>

      {/* Security Note on iOS Unsigned Files */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-amber-300">Catatan Keamanan iOS</h4>
          <p className="text-slate-400 leading-relaxed">
            iOS versi baru memblokir file shortcut pihak ketiga yang diunduh langsung via browser (*"Pengimporan file pintasan yang tidak ditandatangani tidak didukung"*). Anda cukup menambahkan <strong>2 tindakan</strong> berikut langsung di aplikasi Pintasan iPhone yang saat ini terbuka.
          </p>
        </div>
      </div>

      {/* 2 Simple Actions Guide */}
      <div className="space-y-4 pt-1">
        <h3 className="text-sm font-bold text-white">Langkah Pembuatan di Layar Pintasan iPhone Anda:</h3>

        <div className="space-y-4">
          
          {/* Tindakan 1 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tindakan 1: Ambil Tangkapan Layar</h4>
            </div>
            <p className="text-xs text-slate-400 pl-8 leading-relaxed">
              Di kolom pencarian bawah layar Pintasan iPhone (kolom <em>"Cari tindakan"</em>), ketik <strong className="text-teal-300">Ambil Tangkapan Layar</strong> (atau <em>Take Screenshot</em>) lalu ketuk untuk memasukkannya.
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
                Di kolom pencarian bawah, ketik <strong className="text-cyan-300">Dapatkan Isi URL</strong> lalu ketuk dan atur seperti ini:
              </p>

              {/* URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">URL Telegram (Tempel di kolom URL)</label>
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
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tambahkan 2 Bidang Formulir:</span>
                
                {/* Field 1: chat_id */}
                <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs">
                  <div className="font-mono text-slate-300">
                    <span className="text-teal-400 font-bold">chat_id</span>: <span className="text-white font-bold">{user?.telegram_id || 'ID Telegram Anda'}</span>
                  </div>
                  {user?.telegram_id && (
                    <button
                      type="button"
                      onClick={() => handleCopy(user.telegram_id!.toString(), 'chat_id')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-teal-400 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      {copiedField === 'chat_id' ? 'Disalin ✓' : 'Salin ID'}
                    </button>
                  )}
                </div>

                {/* Field 2: photo */}
                <div className="bg-slate-900 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                  <span className="text-cyan-400 font-bold">photo</span>: <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">Tangkapan Layar (Pilih Variabel)</span>
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
              <p>2. Gulir ke paling bawah &gt; pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.</p>
              <p>3. Pilih <strong>Ketuk Dua Kali (Double Tap)</strong> &gt; centang pintasan yang baru saja Anda buat.</p>
              <p className="text-[11px] text-teal-300 bg-teal-500/10 border border-teal-500/20 p-2.5 rounded-xl mt-2">
                Selesai! Sekarang saat Anda melakukan Double Tap di casing iPhone, screenshot akan terkirim otomatis ke bot Telegram di latar belakang.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default IPhoneShortcutCard;
