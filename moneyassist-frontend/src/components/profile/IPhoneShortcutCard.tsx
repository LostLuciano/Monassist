import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { API_BASE_URL } from '../../utils/constants';

interface IPhoneShortcutCardProps {
  onGoToSettings?: () => void;
}

const IPhoneShortcutCard: React.FC<IPhoneShortcutCardProps> = ({ onGoToSettings }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isTelegramConnected = Boolean(user?.telegram_id);
  const shortcutToken = encodeURIComponent(user?.telegram_id || '');
  const shortcutDownloadUrl = `${API_BASE_URL}/shortcuts/download?token=${shortcutToken}`;

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-slate-950">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M11 18h2" />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-white">Pintasan iPhone</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Double Tap ambil screenshot bukti transaksi, MoneyAssist baca nominal dan tanggal, lalu catat otomatis.
          </p>
        </div>
      </div>

      {!isTelegramConnected ? (
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 space-y-3">
          <div>
            <p className="text-sm font-bold text-amber-200">Telegram belum terhubung</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              Hubungkan Telegram dulu supaya shortcut tahu transaksi ini masuk ke akun yang benar.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToSettings}
            className="w-full rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400"
          >
            Hubungkan Telegram
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Siap dipasang
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              Shortcut ini langsung kirim screenshot ke MoneyAssist. Telegram dipakai untuk mengenali akun dan mengirim hasil verifikasi.
            </p>
            <p className="mt-2 truncate text-xs text-slate-400">
              Terhubung ke ID Telegram <span className="font-mono text-white">{user?.telegram_id}</span>
            </p>
          </div>

          <a
            href={shortcutDownloadUrl}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400"
          >
            Unduh Pintasan Personal
          </a>

          <div className="space-y-3">
            {[
              'Kalau pernah pasang versi lama, hapus dulu shortcut Scan MoneyAssist di aplikasi Pintasan.',
              'Ketuk Unduh Pintasan Personal, buka file di iPhone, lalu pilih Tambahkan Pintasan.',
              'Masuk ke Pengaturan > Aksesibilitas > Sentuh > Ketuk Bagian Belakang.',
              'Pilih Ketuk Dua Kali, lalu pilih Scan MoneyAssist.',
              'Saat melihat bukti transfer, e-wallet, m-banking, atau struk, ketuk 2x belakang iPhone dan tunggu hasil verifikasi di Telegram.'
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-black text-teal-300">
                  {index + 1}
                </span>
                <p className="text-xs leading-relaxed text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default IPhoneShortcutCard;
