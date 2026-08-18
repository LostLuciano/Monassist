# iPhone Shortcut to Telegram MoneyAssist

Dokumen ini menjelaskan alur screenshot iPhone sampai transaksi otomatis tercatat:

1. iPhone mengambil screenshot.
2. Screenshot dikirim sebagai gambar ke MoneyAssist.
3. Backend/bot memvalidasi file gambar.
4. Gemini Vision melakukan OCR dan analisis transaksi.
5. Transaksi disimpan ke database.
6. Hasil analisis dikirim kembali ke chat Telegram pengguna.

## Prasyarat Backend

Pastikan backend `versibaru` memiliki environment berikut:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=...
GEMINI_API_KEY=...
TELEGRAM_BOT_TOKEN=...
PUBLIC_API_URL=https://monassist.vercel.app/api
```

Daftarkan webhook Telegram setelah deploy:

```bash
curl https://monassist.vercel.app/api/webhook/setup
```

Webhook aktif menerima update di:

```text
POST /api/webhook/telegram
```

## Hubungkan Akun Telegram

1. Login ke dashboard MoneyAssist.
2. Buka Profil/Setelan.
3. Klik `Hubungkan Telegram` untuk membuat kode pairing.
4. Buka bot Telegram: `@FinMoneyAssist_bot`.
5. Kirim:

```text
/pair MA-XXXXXX
```

Setelah berhasil, kolom `users.telegram_id` terisi. Bot hanya memproses gambar dari Telegram ID yang sudah terhubung.

## Opsi A: Shortcut Mengirim Langsung ke Bot Telegram

Ini jalur paling sesuai dengan konsep "user mengirim gambar ke bot", karena `bot.on('photo')` atau `bot.on('document')` akan menerima gambar dari akun Telegram pengguna.

1. Install aplikasi Telegram di iPhone dan pastikan chat dengan `@FinMoneyAssist_bot` sudah pernah dibuka.
2. Buka aplikasi `Pintasan` atau `Shortcuts`.
3. Buat shortcut baru bernama `MoneyAssist Screenshot`.
4. Tambahkan aksi `Ambil Tangkapan Layar` atau `Take Screenshot`.
5. Tambahkan aksi Telegram untuk mengirim foto/file/pesan ke chat.
6. Isi penerima dengan `@FinMoneyAssist_bot` atau pilih chat MoneyAssist dari daftar Telegram.
7. Set input gambar ke hasil aksi `Take Screenshot`.
8. Matikan `Show When Run` jika opsi itu tersedia.
9. Simpan shortcut.

Aktifkan Back Tap:

1. Buka `Settings`.
2. Masuk ke `Accessibility`.
3. Masuk ke `Touch`.
4. Pilih `Back Tap`.
5. Pilih `Double Tap` atau `Triple Tap`.
6. Pilih shortcut `MoneyAssist Screenshot`.

Tes:

1. Buka screenshot bukti transfer, QRIS, e-wallet, invoice, atau struk.
2. Ketuk belakang iPhone sesuai konfigurasi.
3. Bot akan membalas `Menganalisis gambar transaksi Anda...`.
4. Jika valid, bot membalas `Transaksi Berhasil Dicatat` beserta nominal, kategori, keterangan, dan tanggal.

## Opsi B: Shortcut Personal via Endpoint MoneyAssist

Gunakan opsi ini kalau aksi Telegram di Shortcuts iPhone tidak tersedia atau tidak stabil. Alurnya tetap mengirim hasil analisis balik ke Telegram, tetapi screenshot masuk melalui endpoint backend:

```text
POST /api/shortcuts/upload?token=<telegram_id>
```

Shortcut personal bisa diunduh dari dashboard saat Telegram sudah terhubung, atau langsung lewat:

```text
https://monassist.vercel.app/api/shortcuts/download?token=<telegram_id>
```

Shortcut ini membuat request `POST` dengan body `Form`:

```text
photo: <hasil Take Screenshot sebagai file>
```

Backend menerima file, memvalidasi gambar, menjalankan Gemini Vision, menyimpan transaksi, lalu mengirim hasil ke `users.telegram_id`.

## Validasi Gambar

Backend menerima:

- JPG
- PNG
- WEBP
- Maksimal 5MB

Bot menerima dua bentuk kiriman Telegram:

- `photo`: gambar biasa dari Telegram
- `document`: gambar yang dikirim sebagai file/original quality

File non-gambar, gambar kosong, gambar terlalu besar, atau MIME yang tidak cocok dengan isi file akan ditolak sebelum masuk ke Gemini.

## Catatan Penting

Jangan memakai endpoint Telegram Bot API `sendPhoto` dari iPhone Shortcut dengan token bot. Request seperti itu membuat bot mengirim foto ke pengguna, bukan pengguna mengirim foto ke bot, sehingga handler `bot.on('photo')` tidak berjalan. Token bot juga tidak boleh disimpan di iPhone, frontend, atau file shortcut publik.
