import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const IPhoneShortcutCard: React.FC = () => {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeOption, setActiveOption] = useState<'telegram' | 'direct'>('telegram');

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const telegramWebhookUrl = 'https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto';
  const directApiUrl = `https://monassist.vercel.app/api/shortcuts/upload?token=${token || user?.id || ''}`;

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      
      {/* Top Banner & Quick Install Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-slate-800/80 pb-6">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73.99.08 2.03-.49 2.65-1.23z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Pintasan iPhone (Double-Tap Otomatis)</h2>
              <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full">
                Background Automation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Kirim tangkapan layar transaksi secara hening di latar belakang hanya dengan mengetuk 2x punggung iPhone.
            </p>
          </div>
        </div>

        {/* Action Button: Direct Open in Shortcuts App */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="shortcuts://create-shortcut"
            className="px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Buka & Buat Pintasan di iPhone</span>
          </a>
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-gradient-to-r from-teal-950/30 via-slate-900/50 to-cyan-950/30 border border-teal-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="text-xs space-y-1">
          <h4 className="font-bold text-white">Cara Kerja di Latar Belakang (Background Execution)</h4>
          <p className="text-slate-400 leading-relaxed">
            Saat Anda mengetuk 2x punggung iPhone setelah selesai transfer atau belanja, iPhone akan mengambil screenshot di latar belakang dan langsung mengirimkannya ke Bot Telegram MoneyAssist tanpa perlu membuka aplikasi apa pun. Bot akan langsung mencatat transaksi dan memberi Anda notifikasi!
          </p>
        </div>
      </div>

      {/* Method Selector */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveOption('telegram')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
              activeOption === 'telegram'
                ? 'bg-slate-800 text-teal-400 border-teal-500/30 shadow-sm'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Metode 1: Bot Telegram (Rekomendasi)
          </button>
          <button
            type="button"
            onClick={() => setActiveOption('direct')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all border ${
              activeOption === 'direct'
                ? 'bg-slate-800 text-teal-400 border-teal-500/30 shadow-sm'
                : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            Metode 2: Direct MoneyAssist API
          </button>
        </div>

        {/* Step-by-step interactive configuration */}
        <div className="space-y-5 pt-2">
          
          {/* Step 1 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">1</span>
              <h3 className="text-sm font-bold text-white">Buka Aplikasi Pintasan (Shortcuts)</h3>
            </div>
            <p className="text-xs text-slate-400 pl-8 leading-relaxed">
              Klik tombol di atas atau buka aplikasi <strong>Pintasan</strong> di iPhone, ketuk <strong>+</strong> dan beri nama: <code className="bg-slate-900 px-2 py-0.5 rounded text-teal-300 font-mono">Scan MoneyAssist</code>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">2</span>
              <h3 className="text-sm font-bold text-white">Tambahkan 2 Tindakan Saja:</h3>
            </div>
            
            <div className="pl-8 space-y-4">
              
              {/* Action 1 */}
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Tindakan 1:</span>
                <p className="text-xs font-bold text-white">Ambil Tangkapan Layar <span className="text-slate-500 font-normal">(Take Screenshot)</span></p>
              </div>

              {/* Action 2 */}
              <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3.5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Tindakan 2: Dapatkan Isi URL (Get Contents of URL)</span>
                
                {/* Endpoint URL Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">URL Endpoint</label>
                  <div className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl font-mono text-xs text-teal-300">
                    <span className="truncate mr-2">
                      {activeOption === 'telegram' ? telegramWebhookUrl : directApiUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeOption === 'telegram' ? telegramWebhookUrl : directApiUrl, 'url')}
                      className="px-3 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-xs font-sans font-bold rounded-lg shrink-0 transition-colors"
                    >
                      {copiedField === 'url' ? 'Disalin ✓' : 'Salin URL'}
                    </button>
                  </div>
                </div>

                {/* Method & Request Body Configuration */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Metode (Method):</span>
                    <span className="font-bold text-white">POST</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 block">Badan Permintaan (Body):</span>
                    <span className="font-bold text-white">Formulir (Form)</span>
                  </div>
                </div>

                {/* Form Keys */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Bidang Formulir (Form Fields):</span>
                  
                  {activeOption === 'telegram' ? (
                    <>
                      {/* Key 1: chat_id */}
                      <div className="flex items-center justify-between bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs">
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

                      {/* Key 2: photo */}
                      <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                        <span className="text-cyan-400 font-bold">photo</span>: <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">Tangkapan Layar (File)</span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs font-mono text-slate-300">
                      <span className="text-cyan-400 font-bold">photo</span>: <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">Tangkapan Layar (File)</span>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold text-xs flex items-center justify-center">3</span>
              <h3 className="text-sm font-bold text-white">Hubungkan ke Ketuk Bagian Belakang (Back Tap)</h3>
            </div>
            <div className="pl-8 text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>1. Buka aplikasi <strong>Pengaturan (Settings)</strong> di iPhone.</p>
              <p>2. Masuk ke <strong>Aksesibilitas (Accessibility)</strong> &gt; <strong>Sentuh (Touch)</strong>.</p>
              <p>3. Gulir ke paling bawah &gt; pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.</p>
              <p>4. Pilih <strong>Ketuk Dua Kali (Double Tap)</strong> &gt; pilih <strong className="text-teal-400">Scan MoneyAssist</strong>.</p>
              <p className="text-[11px] text-teal-300 bg-teal-500/10 border border-teal-500/20 p-2.5 rounded-xl mt-2">
                Selesai! Sekarang kapan saja Anda melakukan transaksi, cukup ketuk 2x punggung iPhone Anda untuk mencatatnya secara otomatis di latar belakang.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default IPhoneShortcutCard;
