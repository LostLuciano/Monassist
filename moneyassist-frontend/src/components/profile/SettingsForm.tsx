import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setTheme } from '../../store/uiSlice';
import { updateProfile, fetchCurrentUser } from '../../store/authSlice';
import api from '../../services/api';

interface SettingsFormProps {
  onGoToShortcuts?: () => void;
}

interface AiModelOption {
  id: string;
  label: string;
}

interface AiOptions {
  text: Record<string, AiModelOption[]>;
  vision: Record<string, AiModelOption[]>;
}

interface AiSettings {
  ai_text_provider: string;
  ai_text_model: string;
  ai_vision_provider: string;
  ai_vision_model: string;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onGoToShortcuts }) => {
  const currentTheme = useSelector((state: RootState) => state.ui.theme);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const [theme, setThemeValue] = useState(currentTheme);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [resetting, setResetting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [aiOptions, setAiOptions] = useState<AiOptions | null>(null);
  const [aiSettings, setAiSettings] = useState<AiSettings>({
    ai_text_provider: 'google',
    ai_text_model: 'gemini-3.7-flash',
    ai_vision_provider: 'google',
    ai_vision_model: 'gemini-3.7-flash'
  });
  const [savingAiSettings, setSavingAiSettings] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setThemeValue(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (user?.telegram_pairing_code && !user?.telegram_id) {
      const interval = setInterval(() => {
        dispatch(fetchCurrentUser());
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [user?.telegram_pairing_code, user?.telegram_id, dispatch]);

  useEffect(() => {
    const loadAiSettings = async () => {
      try {
        const response = await api.get('/ai/settings');
        if (response.data?.success) {
          setAiOptions(response.data.data.options);
          setAiSettings(response.data.data.settings);
        }
      } catch (err) {
        console.error('Failed to load AI settings:', err);
      }
    };

    loadAiSettings();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setTheme(theme as any));
    setMessage({ type: 'success', text: 'Tema aplikasi berhasil disimpan.' });
  };

  const handleAiProviderChange = (task: 'text' | 'vision', provider: string) => {
    const models = aiOptions?.[task]?.[provider] || [];
    const firstModel = models[0]?.id || '';
    setAiSettings(prev => ({
      ...prev,
      [task === 'text' ? 'ai_text_provider' : 'ai_vision_provider']: provider,
      [task === 'text' ? 'ai_text_model' : 'ai_vision_model']: firstModel
    }));
  };

  const handleSaveAiSettings = async () => {
    setSavingAiSettings(true);
    setMessage(null);
    try {
      const response = await api.put('/ai/settings', aiSettings);
      if (response.data?.success) {
        setAiSettings(response.data.data);
        setMessage({ type: 'success', text: 'Model AI berhasil disimpan.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal menyimpan model AI.' });
    } finally {
      setSavingAiSettings(false);
    }
  };

  const handleGenerateTelegramCode = async () => {
    setGeneratingCode(true);
    setMessage(null);
    try {
      const response = await api.post('/auth/telegram-code');
      if (response.data?.success) {
        dispatch(updateProfile({ telegram_pairing_code: response.data.pairing_code }));
        dispatch(fetchCurrentUser());
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal membuat kode pairing Telegram.' });
    } finally {
      setGeneratingCode(false);
    }
  };

  const handleManualCheckStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await dispatch(fetchCurrentUser()).unwrap();
      setMessage({
        type: res?.telegram_id ? 'success' : 'error',
        text: res?.telegram_id
          ? 'Telegram berhasil terhubung.'
          : 'Belum terhubung. Kirim perintah pairing ke bot Telegram dulu.'
      });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memeriksa status Telegram.' });
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleDisconnectTelegram = async () => {
    if (!window.confirm('Putuskan koneksi Telegram dari akun ini?')) return;

    try {
      const response = await api.post('/auth/telegram-disconnect');
      if (response.data?.success) {
        dispatch(updateProfile({ telegram_id: undefined, telegram_pairing_code: undefined }));
        dispatch(fetchCurrentUser());
        setMessage({ type: 'success', text: 'Koneksi Telegram berhasil diputus.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal memutus koneksi Telegram.' });
    }
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      const res = await api.post('/users/reset-data');
      if (res.data?.success) {
        setMessage({ type: 'success', text: 'Data transaksi dan riwayat berhasil dibersihkan.' });
        setShowResetModal(false);
        setConfirmText('');
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Gagal menghapus data.' });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {message && (
        <div className={`rounded-2xl border px-4 py-3 text-xs font-semibold ${
          message.type === 'success'
            ? 'bg-teal-500/10 border-teal-500/25 text-teal-300'
            : 'bg-rose-500/10 border-rose-500/25 text-rose-300'
        }`}>
          {message.text}
        </div>
      )}

      <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Telegram</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Bot dipakai untuk pairing akun, kirim struk, dan menerima konfirmasi transaksi dari pintasan iPhone.
          </p>
        </div>

        {user?.telegram_id ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Terhubung
                  </div>
                  <p className="mt-2 truncate text-xs text-slate-300">
                    ID Telegram: <span className="font-mono text-white">{user.telegram_id}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnectTelegram}
                  className="shrink-0 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
                >
                  Putuskan
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onGoToShortcuts}
              className="w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400"
            >
              Buka Panduan Pintasan iPhone
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              type="button"
              disabled={generatingCode}
              onClick={handleGenerateTelegramCode}
              className="w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500"
            >
              {generatingCode ? 'Membuat kode...' : 'Hubungkan Telegram'}
            </button>

            {user?.telegram_pairing_code && (
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-300">Kirim perintah ini ke bot Telegram:</p>
                  <a
                    href="https://t.me/FinMoneyAssist_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-bold text-teal-300 hover:text-teal-200"
                  >
                    @FinMoneyAssist_bot
                  </a>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-white">
                    /start {user.telegram_pairing_code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`/start ${user.telegram_pairing_code}`, 'pairing')}
                    className="shrink-0 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-teal-300"
                  >
                    {copiedField === 'pairing' ? 'Disalin' : 'Salin'}
                  </button>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    disabled={checkingStatus}
                    onClick={handleManualCheckStatus}
                    className="flex-1 rounded-xl bg-slate-800 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-700 disabled:text-slate-500"
                  >
                    {checkingStatus ? 'Memeriksa...' : 'Periksa Status'}
                  </button>
                  <button
                    type="button"
                    disabled={generatingCode}
                    onClick={handleGenerateTelegramCode}
                    className="flex-1 rounded-xl border border-slate-800 px-3 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:text-teal-300 disabled:text-slate-600"
                  >
                    Buat Ulang Kode
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Model AI</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Pilih mesin untuk chat dan scan gambar. API key tetap disimpan di backend, bukan di browser.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-white">Chat & Telegram Teks</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Dipakai untuk asisten AI, chat Telegram, dan analisis transaksi dari teks.
              </p>
            </div>
            <select
              value={aiSettings.ai_text_provider}
              onChange={(e) => handleAiProviderChange('text', e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-teal-500"
            >
              {Object.keys(aiOptions?.text || { google: [] }).map((provider) => (
                <option key={provider} value={provider}>{provider.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={aiSettings.ai_text_model}
              onChange={(e) => setAiSettings(prev => ({ ...prev, ai_text_model: e.target.value }))}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-teal-500"
            >
              {(aiOptions?.text?.[aiSettings.ai_text_provider] || []).map((model) => (
                <option key={model.id} value={model.id}>{model.label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
            <div>
              <p className="text-sm font-bold text-white">Scan Gambar / Struk</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">
                Dipakai untuk upload struk, foto Telegram, dan pintasan iPhone.
              </p>
            </div>
            <select
              value={aiSettings.ai_vision_provider}
              onChange={(e) => handleAiProviderChange('vision', e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-teal-500"
            >
              {Object.keys(aiOptions?.vision || { google: [] }).map((provider) => (
                <option key={provider} value={provider}>{provider.toUpperCase()}</option>
              ))}
            </select>
            <select
              value={aiSettings.ai_vision_model}
              onChange={(e) => setAiSettings(prev => ({ ...prev, ai_vision_model: e.target.value }))}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-teal-500"
            >
              {(aiOptions?.vision?.[aiSettings.ai_vision_provider] || []).map((model) => (
                <option key={model.id} value={model.id}>{model.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-xs leading-relaxed text-cyan-100/80">
            Rekomendasi awal: <strong>Groq GPT-OSS 120B</strong> untuk teks cepat, dan <strong>Google Gemini 3.7 Flash</strong> untuk scan gambar karena mendukung multimodal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAiSettings}
          disabled={savingAiSettings || !aiOptions}
          className="w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 sm:w-auto"
        >
          {savingAiSettings ? 'Menyimpan...' : 'Simpan Model AI'}
        </button>
      </section>

      <form onSubmit={handleSaveTheme} className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white">Tampilan</h2>
          <p className="text-xs text-slate-400 mt-1">Pilih tema aplikasi.</p>
        </div>

        <select
          value={theme}
          onChange={(e) => setThemeValue(e.target.value as any)}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-teal-500"
        >
          <option value="light">Terang</option>
          <option value="dark">Gelap</option>
          <option value="liquid-glass">Liquid Glass</option>
          <option value="auto">Sistem</option>
        </select>

        <button
          type="submit"
          className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700 sm:w-auto"
        >
          Simpan Tema
        </button>
      </form>

      <section className="bg-rose-950/15 border border-rose-500/20 rounded-2xl p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-rose-300">Mulai dari Awal</h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Bersihkan semua transaksi, target tabungan, rekomendasi, dan riwayat chat. Akun tetap aktif.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="w-full rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/20 sm:w-auto"
        >
          Hapus Semua Data
        </button>
      </section>

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-5 shadow-2xl sm:p-6">
            <h3 className="text-lg font-bold text-white">Mulai dari Awal?</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400">
              Ketik HAPUS untuk membersihkan data transaksi, target, rekomendasi, dan riwayat chat. Tindakan ini tidak bisa dibatalkan.
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="HAPUS"
              className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 font-mono text-sm text-white outline-none transition-colors focus:border-rose-500"
            />

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowResetModal(false);
                  setConfirmText('');
                }}
                className="flex-1 rounded-xl bg-slate-800 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={confirmText.trim().toUpperCase() !== 'HAPUS' || resetting}
                onClick={handleResetData}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-400 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {resetting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsForm;
