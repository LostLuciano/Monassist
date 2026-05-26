import React, { useState } from 'react';

const SettingsForm: React.FC = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    dailyReminder: true,
    weeklyReport: true,
    budgetAlerts: true,
    goalReminders: true,
    reminderTime: '09:00',
    theme: 'dark',
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
