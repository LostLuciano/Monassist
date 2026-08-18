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

  const telegramId = user?.telegram_id?.toString() || '';
  const isTelegramConnected = Boolean(telegramId);
  const icloudShortcutUrl = 'https://www.icloud.com/shortcuts/bd0b081e7eb843148c45a9505852d6be';
  const uploadEndpointUrl = `${API_BASE_URL}/shortcuts/upload?token=${encodeURIComponent(telegramId)}`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyText = (fieldName: string, defaultText = 'Salin') => (
    copiedField === fieldName ? 'Disalin' : defaultText
  );

  return (
    <section className="bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500 text-slate-950">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              Siap dibuat
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              ID Telegram sudah terhubung: <span className="font-mono text-white">{telegramId}</span>. Pakai tautan iCloud jika terbuka, atau buat manual supaya tidak kena error impor file.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4">
            <p className="text-sm font-bold text-amber-200">Kalau muncul "Pintasan Tidak Dapat Dibuka"</p>
            <p className="mt-2 text-xs leading-relaxed text-amber-100/80">
              Jangan pakai file unduhan <code className="rounded bg-slate-950/70 px-1.5 py-0.5">.shortcut</code> dari Safari atau Files. iPhone sering menolak impor seperti itu. Buka lewat iCloud, atau ikuti cara manual di bawah.
            </p>
          </div>

          <a
            href={icloudShortcutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-teal-500 px-4 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-teal-400"
          >
            Buka Tautan iCloud
          </a>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">Endpoint MoneyAssist</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Salin URL ini untuk tindakan Dapatkan Isi URL di aplikasi Pintasan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(uploadEndpointUrl, 'endpoint')}
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-teal-300 transition-colors hover:bg-slate-800"
              >
                {copyText('endpoint', 'Salin Endpoint')}
              </button>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-3">
              <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-teal-300">{uploadEndpointUrl}</span>
              <button
                type="button"
                onClick={() => handleCopy(uploadEndpointUrl, 'endpoint-url')}
                className="shrink-0 rounded-lg bg-slate-800 px-2.5 py-1.5 text-[10px] font-bold text-teal-300"
              >
                {copyText('endpoint-url', 'Salin')}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              'Buka aplikasi Pintasan di iPhone, ketuk +, lalu beri nama Scan MoneyAssist.',
              'Ketuk Tambah Tindakan, cari Ambil Tangkapan Layar atau Take Screenshot, lalu pilih tindakan itu.',
              'Tambah tindakan Dapatkan Isi URL atau Get Contents of URL, lalu tempel endpoint MoneyAssist.',
              'Di tindakan Get Contents of URL, buka Tampilkan Lebih Banyak. Pilih Method POST dan Request Body Form.',
              'Tambah field Form bertipe File dengan nama photo, lalu isi nilainya dengan hasil Tangkapan Layar.',
              'Jalankan sekali dari aplikasi Pintasan dan pilih Izinkan saat iPhone meminta akses screenshot atau internet. Telegram harus menerima preview gambar lebih dulu, lalu pesan hasil analisis transaksi.',
              'Buka Pengaturan > Aksesibilitas > Sentuh > Ketuk Bagian Belakang > Ketuk Dua Kali, lalu pilih Scan MoneyAssist.'
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-black text-teal-300">
                  {index + 1}
                </span>
                <p className="text-xs leading-relaxed text-slate-300">{step}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
            <p className="text-sm font-bold text-white">Checklist isi tindakan</p>
            <div className="mt-3 space-y-2 text-xs leading-relaxed text-slate-400">
              <p><span className="font-bold text-teal-300">1.</span> Ambil Tangkapan Layar</p>
              <p><span className="font-bold text-teal-300">2.</span> Dapatkan Isi URL: endpoint MoneyAssist</p>
              <p><span className="font-bold text-teal-300">3.</span> Method: POST</p>
              <p><span className="font-bold text-teal-300">4.</span> Body: Form, field File <code className="rounded bg-slate-900 px-1.5 py-0.5 text-cyan-300">photo</code></p>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
            <p className="text-sm font-bold text-cyan-100">Cara cek kalau masih gagal</p>
            <p className="mt-2 text-xs leading-relaxed text-cyan-100/75">
              Di aplikasi Pintasan, jalankan manual dengan tombol Play. Kalau Telegram tidak menerima preview gambar, biasanya field <code className="rounded bg-slate-950/70 px-1.5 py-0.5">photo</code> belum bertipe File atau nilainya belum memakai hasil Ambil Tangkapan Layar.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default IPhoneShortcutCard;
