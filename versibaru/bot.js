const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Professional, Clean Reply Keyboard
const mainMenuKeyboard = Markup.keyboard([
  ['Catat Transaksi', 'Kirim Bukti / Struk'],
  ['Ringkasan Hari Ini', 'Panduan & Bantuan'],
  ['Putuskan Koneksi']
]).resize();

// Bot Start Command
bot.start((ctx) => {
  const code = ctx.payload; // Parameter from deep link, e.g. /start MA-123456
  if (code) {
    return handlePairing(ctx, code);
  }
  ctx.reply(
    `Selamat datang di MoneyAssist Bot.\n\n` +
    `Asisten keuangan cerdas untuk mencatat transaksi dan menganalisis arus kas Anda secara otomatis.\n\n` +
    `Cara Menghubungkan Akun:\n` +
    `1. Buka web dashboard MoneyAssist\n` +
    `2. Masuk ke halaman Setelan & Profil -> Integrasi Telegram\n` +
    `3. Klik 'Hubungkan Telegram' untuk mendapatkan kode pairing\n` +
    `4. Kirimkan pesan di sini dengan format: /pair KODE_ANDA\n\n` +
    `Setelah terhubung, Anda dapat mencatat transaksi lewat teks atau tangkapan layar m-banking / struk belanja.`,
    mainMenuKeyboard
  );
});

// Bot Pair Command
bot.command('pair', (ctx) => {
  const parts = ctx.message.text.split(' ');
  const code = parts[1];
  if (!code) {
    return ctx.reply('Format salah. Gunakan perintah: /pair KODE_ANDA\nContoh: /pair MA-123456');
  }
  return handlePairing(ctx, code);
});

// Handle Pairing Logic
async function handlePairing(ctx, code) {
  try {
    const formattedCode = code.toUpperCase().trim();
    const result = await db.query(
      `SELECT id, name FROM users WHERE telegram_pairing_code = $1`,
      [formattedCode]
    );

    if (result.rows.length === 0) {
      return ctx.reply('Kode pairing tidak valid atau telah kedaluwarsa. Silakan buat kode baru di dashboard web MoneyAssist.');
    }

    const user = result.rows[0];
    const telegramId = ctx.from.id.toString();

    await db.query(
      `UPDATE users SET telegram_id = $1, telegram_pairing_code = NULL WHERE id = $2`,
      [telegramId, user.id]
    );

    ctx.reply(
      `Akun MoneyAssist atas nama ${user.name} berhasil terhubung.\n\n` +
      `Anda sekarang dapat langsung mencatat pengeluaran atau pemasukan via obrolan teks maupun tangkapan layar transfer/QRIS/struk.`,
      mainMenuKeyboard
    );
  } catch (err) {
    console.error('Pairing error:', err);
    ctx.reply('Terjadi kesalahan saat memproses koneksi akun. Silakan coba kembali beberapa saat lagi.');
  }
}

// Bot Message Handler
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return; // Ignore other slash commands

  try {
    // 1. Find user by telegram_id
    const telegramId = ctx.from.id.toString();
    const userResult = await db.query(
      `SELECT id, name FROM users WHERE telegram_id = $1`,
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply(
        'Akun Telegram Anda belum terhubung dengan MoneyAssist.\n\n' +
        'Silakan buka menu Setelan di dashboard web untuk mendapatkan kode pairing, lalu kirimkan ke sini dengan format: /pair KODE_ANDA'
      );
    }

    const user = userResult.rows[0];

    // Handle Quick Action Buttons
    if (text === 'Putuskan Koneksi' || text.toLowerCase() === '/disconnect') {
      await db.query(`UPDATE users SET telegram_id = NULL WHERE id = $1`, [user.id]);
      return ctx.reply(
        'Koneksi Berhasil Diputus.\n\n' +
        'Akun MoneyAssist Anda telah terputus dari bot ini. Untuk menghubungkan kembali, silakan buat kode pairing baru di dashboard web.',
        { reply_markup: { remove_keyboard: true } }
      );
    }

    if (text === 'Catat Transaksi') {
      return ctx.reply(
        '*Format Pencatatan Manual*\n\n' +
        'Ketik nominal dan keterangan transaksi Anda secara bebas. Contoh:\n' +
        '• "Makan siang 35rb"\n' +
        '• "Beli bensin motor 50.000"\n' +
        '• "Gaji freelance 2.500.000"\n\n' +
        'AI akan otomatis mendeteksi tipe transaksi, nominal, dan kategorinya.',
        { parse_mode: 'Markdown' }
      );
    }

    if (text === 'Kirim Bukti / Struk') {
      return ctx.reply(
        '*Pencatatan Otomatis via Foto / Screenshot*\n\n' +
        'Kirimkan foto struk belanja fisik atau tangkapan layar (screenshot) bukti transfer m-banking / QRIS.\n\n' +
        'Vision AI kami akan mengekstrak nominal, nama merchant, dan kategori secara otomatis.',
        { parse_mode: 'Markdown' }
      );
    }

    if (text === 'Panduan & Bantuan') {
      return ctx.reply(
        '*Panduan MoneyAssist Bot*\n\n' +
        '1. *Catat Cepat*: Kirim pesan teks pengeluaran/pemasukan Anda.\n' +
        '2. *Scan Struk / Bukti Transfer*: Kirim gambar/screenshot untuk pencatatan otomatis.\n' +
        '3. *Pintasan iPhone*: Anda dapat mengonfigurasi Back-Tap di iPhone agar screenshot langsung terkirim ke bot ini.\n' +
        '4. *Ringkasan Harian*: Periksa total pemasukan dan pengeluaran hari ini.',
        { parse_mode: 'Markdown' }
      );
    }

    if (text === 'Ringkasan Hari Ini') {
      const today = new Date().toISOString().split('T')[0];
      const sumResult = await db.query(
        `SELECT type, SUM(amount) as total FROM transactions WHERE user_id = $1 AND date = $2 GROUP BY type`,
        [user.id, today]
      );
      
      let income = 0;
      let expense = 0;
      sumResult.rows.forEach(r => {
        if (r.type === 'income') income = parseFloat(r.total) || 0;
        if (r.type === 'expense') expense = parseFloat(r.total) || 0;
      });

      return ctx.reply(
        `*Ringkasan Transaksi Hari Ini*\n` +
        `Tanggal: ${today}\n\n` +
        `• Total Pemasukan: Rp ${income.toLocaleString('id-ID')}\n` +
        `• Total Pengeluaran: Rp ${expense.toLocaleString('id-ID')}\n` +
        `• Arus Kas Bersih: Rp ${(income - expense).toLocaleString('id-ID')}`,
        { parse_mode: 'Markdown' }
      );
    }

    // Inform user that bot is typing
    await ctx.sendChatAction('typing');

    // 2. Request Gemini to parse the transaction text
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Kamu adalah Asisten AI Keuangan profesional dari MoneyAssist.
Tugas kamu adalah menganalisis pesan pengguna. Pesan pengguna bisa berupa chat biasa (pertanyaan finansial, konsultasi) ATAU laporan transaksi (misal: "beli kopi 25rb" atau "gaji masuk 8jt").

Aturan Bahasa: Gunakan bahasa Indonesia profesional, ringkas, dan jelas tanpa emoji berlebihan.

Jika pesan adalah CHAT BIASA (bukan laporan transaksi):
Berikan jawaban ringkas, informatif, dan profesional.
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": false,
  "reply": "<jawaban profesional>"
}

Jika pesan mengandung LAPORAN TRANSAKSI keuangan:
Tentukan tipe transaksi ("expense" atau "income") dan kategori: "Makanan & Minuman", "Transportasi", "Belanja", "Utilitas & Tagihan", "Gaji", "Investasi", "Hiburan", atau "Lainnya".
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": true,
  "reply": "<konfirmasi singkat>",
  "transaction_data": {
    "amount": <angka nominal bulat murni>,
    "type": "expense" | "income",
    "category": "<kategori>",
    "description": "<keterangan transaksi singkat>"
  }
}

Teks input: "${text}"`;

    const aiResult = await model.generateContent(prompt);
    let jsonText = aiResult.response.text().trim();
    
    // Clean up potential markdown wrapper from response
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\n|```$/g, '');
    }

    const parsed = JSON.parse(jsonText);

    if (!parsed.is_transaction) {
      return ctx.reply(parsed.reply);
    }

    // It is a transaction
    const txData = parsed.transaction_data;
    if (!txData || !txData.amount || isNaN(txData.amount)) {
      return ctx.reply('Nominal transaksi tidak terdeteksi secara valid. Mohon sertakan angka nominal yang jelas.');
    }

    // 3. Resolve category ID in DB
    const dbCategoryId = await getDbCategoryId(user.id, txData.category, txData.type);

    // 4. Save transaction to database
    const today = new Date().toISOString().split('T')[0];
    await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user.id, dbCategoryId, txData.type, txData.amount, txData.description || 'Transaksi Telegram', today]
    );

    const typeLabel = txData.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    ctx.reply(
      `*Transaksi Berhasil Dicatat*\n\n` +
      `• Tipe: ${typeLabel}\n` +
      `• Nominal: Rp ${Number(txData.amount).toLocaleString('id-ID')}\n` +
      `• Kategori: ${txData.category}\n` +
      `• Keterangan: ${txData.description || 'Transaksi Telegram'}\n` +
      `• Tanggal: ${today}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error('Telegram bot handling error:', error);
    ctx.reply('Maaf, terjadi kendala saat memproses transaksi Anda. Mohon ulangi dengan format yang jelas.');
  }
});

// Bot Photo Handler (Scan Struk & Screenshot Transaksi)
bot.on('photo', async (ctx) => {
  try {
    // 1. Find user by telegram_id
    const telegramId = ctx.from.id.toString();
    const userResult = await db.query(
      `SELECT id, name FROM users WHERE telegram_id = $1`,
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply(
        'Akun Telegram Anda belum terhubung dengan MoneyAssist.\n\n' +
        'Silakan buka menu Setelan di dashboard web untuk mendapatkan kode pairing, lalu kirimkan di sini dengan format: /pair KODE_ANDA'
      );
    }

    const user = userResult.rows[0];

    // Inform user that bot is processing
    await ctx.reply('Menganalisis dokumen / gambar transaksi Anda...');
    await ctx.sendChatAction('typing');

    // Get the largest photo size
    const photos = ctx.message.photo;
    const largestPhoto = photos[photos.length - 1];
    const fileId = largestPhoto.file_id;

    // Get download URL from Telegram
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    // Download the image buffer
    const response = await fetch(fileUrl.href);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Request Gemini to parse the image/screenshot
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const filePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/jpeg'
      }
    };

    const prompt = `Analisis gambar ini secara teliti dan profesional. Gambar ini bisa berupa:
1. Tangkapan Layar (Screenshot) dari aplikasi Mobile Banking (BCA, Livin by Mandiri, BRImo, BNI, Seabank, Bank Jago, Jenius, dll).
2. Screenshot E-Wallet (GoPay, OVO, ShopeePay, DANA, LinkAja, AstraPay, dll).
3. Bukti Transfer Masuk/Keluar, QRIS Pembayaran, Struk Kasir / Resi Belanja, Tagihan/Invoice, Slip Gaji, atau Mutasi Rekening.

Tentukan apakah ini adalah PEMASUKAN (income) atau PENGELUARAN (expense).
Ekstrak dan berikan data JSON terstruktur dengan format berikut:
{
  "amount": <angka nominal total transaksi murni tanpa titik/koma/simbol mata uang, contoh: 58500>,
  "description": "<Nama Merchant / Toko / Pengirim / Penerima / Keterangan Transaksi>",
  "type": "expense" | "income",
  "category": "Makanan & Minuman" | "Transportasi" | "Belanja" | "Utilitas & Tagihan" | "Gaji" | "Investasi" | "Hiburan" | "Lainnya",
  "transaction_date": "<tanggal transaksi dalam format YYYY-MM-DD>"
}
Kembalikan HANYA string JSON mentah tanpa markdown, tanpa penjelasan tambahan.`;

    const aiResult = await model.generateContent([prompt, filePart]);
    let jsonText = aiResult.response.text().trim();

    // Clean JSON from code blocks if any
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\n|```$/g, '');
    }

    const geminiJson = JSON.parse(jsonText);

    if (!geminiJson.amount || isNaN(geminiJson.amount)) {
      return ctx.reply('Nominal transaksi tidak dapat terdeteksi dari gambar. Pastikan gambar tangkapan layar atau struk belanja terbaca dengan jelas.');
    }

    const txType = geminiJson.type === 'income' ? 'income' : 'expense';

    // 3. Resolve category ID in DB
    const dbCategoryId = await getDbCategoryId(user.id, geminiJson.category || 'Lainnya', txType);

    // 4. Save transaction to database
    const today = new Date().toISOString().split('T')[0];
    const txDate = geminiJson.transaction_date || today;

    await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        user.id,
        dbCategoryId,
        txType,
        geminiJson.amount,
        geminiJson.description || (txType === 'income' ? 'Pemasukan (Tangkapan Layar)' : 'Pengeluaran (Tangkapan Layar)'),
        txDate
      ]
    );

    const typeLabel = txType === 'income' ? 'Pemasukan' : 'Pengeluaran';
    ctx.reply(
      `*Transaksi Berhasil Dicatat*\n\n` +
      `• Tipe: ${typeLabel}\n` +
      `• Nominal: Rp ${Number(geminiJson.amount).toLocaleString('id-ID')}\n` +
      `• Kategori: ${geminiJson.category || 'Lainnya'}\n` +
      `• Keterangan: ${geminiJson.description || '-'}\n` +
      `• Tanggal: ${txDate}`,
      { parse_mode: 'Markdown' }
    );

  } catch (error) {
    console.error('Telegram receipt/screenshot scan error:', error);
    ctx.reply('Gagal menganalisis gambar. Pastikan foto atau tangkapan layar transaksi terlihat jelas dan coba kirim kembali.');
  }
});

// Helper function to resolve category ID from database
async function getDbCategoryId(userId, catName, type) {
  const result = await db.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2',
    [userId, catName]
  );
  
  if (result.rows.length > 0) {
    return result.rows[0].id;
  }
  
  let icon = 'tag';
  let color = '#6b7280';
  if (catName.includes('Makanan')) { icon = 'coffee'; color = '#f59e0b'; }
  else if (catName.includes('Transport')) { icon = 'car'; color = '#3b82f6'; }
  else if (catName.includes('Belanja')) { icon = 'shopping-cart'; color = '#10b981'; }
  else if (catName.includes('Tagihan') || catName.includes('Utilitas')) { icon = 'zap'; color = '#6366f1'; }
  else if (catName.includes('Gaji')) { icon = 'briefcase'; color = '#10b981'; }
  else if (catName.includes('Invest')) { icon = 'trending-up'; color = '#0ea5e9'; }
  else if (catName.includes('Hiburan')) { icon = 'film'; color = '#8b5cf6'; }

  const insertResult = await db.query(
    `INSERT INTO categories (user_id, name, icon, color, type, budget_limit, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 1000000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id`,
    [userId, catName, icon, color, type || 'expense']
  );
  
  return insertResult.rows[0].id;
}

module.exports = bot;
