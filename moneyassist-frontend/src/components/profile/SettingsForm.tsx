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
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Integrasi Telegram Bot</h3>
          <div className="bg-slate-950/40 border border-slate-900/60 rounded-2xl p-5 space-y-4">
            {user?.telegram_id ? (
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
                    Anda sekarang dapat langsung mengirimkan pengeluaran via chat teks ke bot Telegram.
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
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-bold mb-1">
                      <span className="w-2.5 h-2.5 bg-slate-600 rounded-full"></span>
                      Belum Terhubung
                    </div>
                    <p className="text-xs text-slate-400 font-semibold">
                      Hubungkan akun MoneyAssist Anda ke Telegram Bot untuk mencatat pengeluaran secara instan lewat chat.
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
                        Cari bot Telegram: <a href="https://t.me/MoneyAssistBot" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">@MoneyAssistBot</a> atau klik tautan tersebut.
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
