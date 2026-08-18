import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setTheme } from '../../store/uiSlice';
import { updateProfile } from '../../store/authSlice';
import api from '../../services/api';

const SettingsForm: React.FC = () => {
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [generatingCode, setGeneratingCode] = useState(false);
  const [showIPhoneModal, setShowIPhoneModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleGenerateTelegramCode = async () => {
    setGeneratingCode(true);
    try {
      const response = await api.post('/auth/telegram-code');
      if (response.data?.success) {
        dispatch(updateProfile({ telegram_pairing_code: response.data.pairing_code }));
      }
    } catch (err: any) {
      console.error(err);
      alert('Gagal membuat kode pairing.');
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    if (window.confirm('Apakah Anda yakin ingin memutus koneksi Telegram?')) {
      try {
        const response = await api.post('/auth/telegram-disconnect');
        if (response.data?.success) {
          dispatch(updateProfile({ telegram_id: undefined, telegram_pairing_code: undefined }));
          alert('Koneksi Telegram berhasil diputus!');
        }
      } catch (err: any) {
        console.error(err);
        alert('Gagal memutus koneksi Telegram.');
      }
    }
  };

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dailyReminder: true,
    weeklyReport: true,
    budgetAlerts: true,
    goalReminders: true,
    reminderTime: '09:00',
    theme: currentTheme,
    dataSharing: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      dispatch(setTheme(settings.theme as any));
      setMessage({ type: 'success', text: 'Setelan Anda berhasil disimpan!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan setelan' });
    }
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-teal-500' : 'bg-slate-950 border border-slate-850'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8">
      <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-teal-500 rounded-full"></span>
        Setelan & Preferensi
      </h2>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-xs font-semibold border ${
          message.type === 'success' 
            ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Notifications Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Notifikasi</h3>
          <div className="divide-y divide-slate-850 space-y-4">
            
            <div className="flex items-center justify-between py-3 first:pt-0">
              <div>
                <p className="text-sm font-bold text-white">Notifikasi Email</p>
                <p className="text-xs text-slate-500 mt-0.5">Terima laporan dan pembaruan berkala via email</p>
              </div>
              <ToggleSwitch
                enabled={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-white">Notifikasi Push</p>
                <p className="text-xs text-slate-500 mt-0.5">Dapatkan notifikasi langsung di perangkat Anda</p>
              </div>
              <ToggleSwitch
                enabled={settings.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-white">Pengingat Harian</p>
                <p className="text-xs text-slate-500 mt-0.5">Ingatkan saya untuk mencatat pengeluaran setiap hari</p>
              </div>
              <ToggleSwitch
                enabled={settings.dailyReminder}
                onChange={() => handleToggle('dailyReminder')}
              />
            </div>

            {settings.dailyReminder && (
              <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-white">Waktu Pengingat</p>
                  <p className="text-xs text-slate-500 mt-0.5">Pilih jam untuk mengirimkan pengingat harian</p>
                </div>
                <input
                  type="time"
                  name="reminderTime"
                  value={settings.reminderTime}
                  onChange={handleChange}
                  className="px-4 py-2 bg-slate-950 border border-slate-855 rounded-xl focus:outline-none focus:border-teal-500 text-white text-sm w-full sm:w-auto"
                />
              </div>
            )}

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-bold text-white">Pemberitahuan Anggaran</p>
                <p className="text-xs text-slate-500 mt-0.5">Kirim peringatan ketika pengeluaran mendekati batas anggaran</p>
              </div>
              <ToggleSwitch
                enabled={settings.budgetAlerts}
                onChange={() => handleToggle('budgetAlerts')}
              />
            </div>

          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Tampilan</h3>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Tema Aplikasi
            </label>
            <select
              name="theme"
              value={settings.theme}
              onChange={handleChange}
              className="w-full md:w-64 px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl focus:outline-none focus:border-teal-500 text-white text-sm"
            >
              <option value="light">Terang</option>
              <option value="dark">Gelap (Glassmorphic)</option>
              <option value="liquid-glass">Liquid Glass (Premium)</option>
              <option value="auto">Sistem</option>
            </select>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Privasi & Data</h3>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-bold text-white">Bagikan Data Anonim</p>
              <p className="text-xs text-slate-500 mt-0.5">Bantu kami meningkatkan kualitas layanan AI secara anonim</p>
            </div>
            <ToggleSwitch
              enabled={settings.dataSharing}
              onChange={() => handleToggle('dataSharing')}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Keamanan</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-white border border-slate-850 rounded-xl text-xs font-bold transition-all"
            >
              Ganti Kata Sandi
            </button>
            <button
              type="button"
              className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-white border border-slate-850 rounded-xl text-xs font-bold transition-all"
            >
              Aktifkan Autentikasi 2-Faktor (2FA)
            </button>
          </div>
        </div>

        {/* Telegram Integration Section */}
        <div className="space-y-4 pt-4 border-t border-slate-850">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Integrasi Telegram & Pintasan</h3>
            <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
              ⚡ AI Automation
            </span>
          </div>

          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-5 space-y-5">
            {user?.telegram_id ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-1">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      Terhubung ke Telegram
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      ID Akun Telegram Anda: <code className="bg-slate-900 px-2 py-0.5 rounded text-white font-mono">{user.telegram_id}</code>
                    </p>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      Anda dapat langsung mengirimkan chat teks atau foto struk ke bot Telegram.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDisconnectTelegram}
                    className="py-2 px-4 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-xl text-xs font-bold transition-all shrink-0 align-self-start sm:align-self-center"
                  >
                    Putuskan Koneksi
                  </button>
                </div>

                {/* iPhone Double-Tap Shortcut Feature Card */}
                <div className="bg-gradient-to-br from-teal-950/40 to-slate-900/80 border border-teal-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-teal-500/5">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20 shrink-0 mt-0.5 sm:mt-0">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73.99.08 2.03-.49 2.65-1.23z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-white">Pintasan iPhone (Double-Tap Screenshot)</h4>
                        <span className="text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full">
                          Fitur Cepat
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Ketuk 2x punggung iPhone untuk otomatis screenshot layar & kirim ke Bot Telegram MoneyAssist.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowIPhoneModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Konfigurasi Pintasan</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-1">
                      <span className="w-2.5 h-2.5 bg-slate-600 rounded-full"></span>
                      Belum Terhubung
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      Hubungkan akun MoneyAssist Anda ke Telegram Bot untuk mencatat pengeluaran secara instan lewat chat & Pintasan iPhone.
                    </p>
                  </div>
                  {!user?.telegram_pairing_code && (
                    <button
                      type="button"
                      disabled={generatingCode}
                      onClick={handleGenerateTelegramCode}
                      className="py-2.5 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 disabled:from-slate-800 disabled:to-slate-800 text-white rounded-xl text-xs font-bold transition-all shrink-0 shadow-md shadow-teal-500/5"
                    >
                      {generatingCode ? 'Membuat...' : 'Hubungkan Telegram'}
                    </button>
                  )}
                </div>

                {user?.telegram_pairing_code && (
                  <div className="border-t border-slate-900/60 pt-4 space-y-3">
                    <p className="text-xs font-bold text-slate-300">
                      Langkah-langkah Menghubungkan:
                    </p>
                    <ol className="text-xs text-slate-400 font-semibold space-y-2 list-decimal list-inside pl-1">
                      <li>
                        Cari bot Telegram: <a href="https://t.me/FinMoneyAssist_bot" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">@FinMoneyAssist_bot</a> atau klik tautan tersebut.
                      </li>
                      <li>
                        Kirim perintah berikut ke bot:
                        <div className="mt-2 bg-slate-950 border border-slate-855 p-3 rounded-xl flex items-center justify-between font-mono text-white text-xs select-all">
                          <span>/start {user.telegram_pairing_code}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`/start ${user.telegram_pairing_code}`);
                              alert('Perintah disalin ke papan klip!');
                            }}
                            className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-800 px-2 py-1 rounded text-teal-400 hover:text-teal-300 font-sans font-bold"
                          >
                            Salin
                          </button>
                        </div>
                      </li>
                      <li>
                        Bot akan membalas jika akun berhasil dihubungkan!
                      </li>
                    </ol>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        disabled={generatingCode}
                        onClick={handleGenerateTelegramCode}
                        className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors"
                      >
                        {generatingCode ? 'Membuat Ulang...' : 'Buat Ulang Kode'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* INTERACTIVE IPHONE SHORTCUT MODAL */}
        {showIPhoneModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 shadow-md">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 3.5c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.71-.93 2.73.99.08 2.03-.49 2.65-1.23z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Panduan Pintasan iPhone (Back-Tap)</h3>
                    <p className="text-xs text-slate-400">Setup Double Tap Screenshot ke Bot Telegram</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIPhoneModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Step 1: Create Shortcut */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 font-bold text-xs flex items-center justify-center">1</span>
                  <h4 className="text-sm font-bold text-white">Buka Aplikasi Pintasan (Shortcuts) di iPhone</h4>
                </div>
                <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                  Buka aplikasi bawaan <strong className="text-slate-200">Pintasan (Shortcuts)</strong> di iPhone Anda, lalu ketuk tanda tambah (<strong className="text-teal-400">+</strong>) di kanan atas untuk membuat pintasan baru. Beri nama misalnya: <code className="bg-slate-950 px-2 py-0.5 rounded text-teal-300 font-mono">Scan MoneyAssist</code>.
                </p>
              </div>

              {/* Step 2: Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 font-bold text-xs flex items-center justify-center">2</span>
                  <h4 className="text-sm font-bold text-white">Tambahkan 2 Tindakan Berikut:</h4>
                </div>
                
                <div className="pl-8 space-y-3">
                  {/* Action 1 */}
                  <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-teal-400">Tindakan 1:</span>
                    <p className="text-xs font-semibold text-white">Ambil Tangkapan Layar <span className="text-slate-500">(Take Screenshot)</span></p>
                  </div>

                  {/* Action 2 */}
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-3">
                    <span className="text-[11px] font-bold text-cyan-400">Tindakan 2: Dapatkan Isi URL (Get Contents of URL)</span>
                    
                    {/* URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">URL Endpoint Telegram</label>
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg font-mono text-xs text-teal-300">
                        <span className="truncate mr-2">https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto</span>
                        <button
                          type="button"
                          onClick={() => handleCopy('https://api.telegram.org/bot7845347209:AAHTR5Fm-w2qQy46v65v_v9i-yU9N8Qz6zI/sendPhoto', 'url')}
                          className="px-2 py-1 bg-teal-500/20 hover:bg-teal-500/30 text-teal-400 text-[10px] font-sans font-bold rounded shrink-0 transition-colors"
                        >
                          {copiedField === 'url' ? 'Disalin! ✓' : 'Salin URL'}
                        </button>
                      </div>
                    </div>

                    {/* Method & Body */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Metode (Method):</span>
                        <span className="font-bold text-white">POST</span>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500 block">Badan (Body):</span>
                        <span className="font-bold text-white">Formulir (Form)</span>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">2 Bidang Formulir (Form Fields):</span>
                      
                      {/* Field 1: chat_id */}
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs">
                        <div className="font-mono text-slate-300">
                          <span className="text-teal-400 font-bold">chat_id</span>: <span className="text-white">{user?.telegram_id || 'ID Telegram Anda'}</span>
                        </div>
                        {user?.telegram_id && (
                          <button
                            type="button"
                            onClick={() => handleCopy(user.telegram_id!.toString(), 'chat_id')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-teal-400 text-[10px] font-bold rounded transition-colors"
                          >
                            {copiedField === 'chat_id' ? 'Disalin! ✓' : 'Salin ID'}
                          </button>
                        )}
                      </div>

                      {/* Field 2: photo */}
                      <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono text-slate-300">
                        <span className="text-cyan-400 font-bold">photo</span>: <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded">Tangkapan Layar (File)</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Step 3: Back Tap Config */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 font-bold text-xs flex items-center justify-center">3</span>
                  <h4 className="text-sm font-bold text-white">Aktifkan Double Tap di Pengaturan iPhone</h4>
                </div>
                <div className="pl-8 text-xs text-slate-400 space-y-1.5">
                  <p>1. Buka <strong>Pengaturan (Settings)</strong> iPhone.</p>
                  <p>2. Masuk ke <strong>Aksesibilitas (Accessibility)</strong> &gt; <strong>Sentuh (Touch)</strong>.</p>
                  <p>3. Gulir paling bawah &gt; pilih <strong>Ketuk Bagian Belakang (Back Tap)</strong>.</p>
                  <p>4. Pilih <strong>Ketuk Dua Kali (Double Tap)</strong> &gt; gulir ke bawah dan pilih pintasan <strong className="text-teal-400">Scan MoneyAssist</strong>.</p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowIPhoneModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl font-bold text-xs shadow-lg shadow-teal-500/20 transition-all"
                >
                  Saya Mengerti & Selesai
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className="space-y-4 pt-4 border-t border-red-500/20">
          <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider">Zona Berbahaya</h3>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="py-2.5 px-4 bg-slate-950 hover:bg-slate-850 text-slate-400 border border-slate-850 rounded-xl text-xs font-bold transition-all"
            >
              Ekspor Semua Data
            </button>
            <button
              type="button"
              className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-xl text-xs font-bold transition-all"
            >
              Hapus Akun Permanen
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-slate-850">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-teal-500/10"
          >
            Simpan Setelan
          </button>
        </div>

      </form>
    </div>
  );
};

export default SettingsForm;
