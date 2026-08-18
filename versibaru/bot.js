const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');
const {
  MAX_IMAGE_BYTES,
  SUPPORTED_IMAGE_MIME_TYPES,
  analyzeAndRecordImageTransaction,
  formatTelegramTransactionReply,
  validateImageBuffer
} = require('./services/transactionImageAnalysis');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Professional & Clean Reply Keyboard
const mainMenuKeyboard = Markup.keyboard([
  ['Catat Transaksi', 'Kirim Bukti / Struk'],
  ['Ringkasan Hari Ini', 'Panduan & Pintasan'],
  ['Putuskan Koneksi']
]).resize();

// Helper to extract pairing code from any input string
function extractPairingCode(text) {
  if (!text) return null;
  const clean = text.trim();
  // Match patterns like MA-123456, MA_123456, or raw 6-8 character alphanumeric codes
  const match = clean.match(/(?:MA[-_])?([A-Z0-9]{5,8})/i);
  if (match) {
    return clean.toUpperCase().replace('_', '-');
  }
  return clean.toUpperCase();
}

// Bot Start Command
bot.start(async (ctx) => {
  const fullText = ctx.message?.text || '';
  const payload = ctx.payload || (fullText.split(' ')[1] || '');
  
  if (payload) {
    return handlePairing(ctx, payload);
  }
  
  ctx.reply(
    `Selamat datang di MoneyAssist Copilot.\n\n` +
    `Asisten finansial cerdas Anda untuk pencatatan otomatis transaksi, analisis struk/QRIS, dan evaluasi arus kas bulanan.\n\n` +
    `Langkah Menghubungkan Akun:\n` +
    `1. Buka web dashboard MoneyAssist\n` +
    `2. Masuk ke menu Setelan & Profil -> Integrasi Telegram\n` +
    `3. Klik 'Hubungkan Telegram' untuk membuat kode pairing\n` +
    `4. Kirimkan pesan di sini dengan format: /pair KODE_ANDA (atau cukup ketik kodenya langsung)\n\n` +
    `Setelah terhubung, Anda dapat mencatat transaksi lewat teks instan atau tangkapan layar m-banking / QRIS.`,
    mainMenuKeyboard
  );
});

// Bot Pair Command
bot.command('pair', (ctx) => {
  const text = ctx.message?.text || '';
  const parts = text.split(' ');
  const code = parts.slice(1).join(' ').trim();
  if (!code) {
    return ctx.reply('Format perintah: /pair KODE_ANDA\nContoh: /pair MA-123456');
  }
  return handlePairing(ctx, code);
});

// Master Pairing Logic
async function handlePairing(ctx, rawCode) {
  try {
    const formatted = extractPairingCode(rawCode);
    const rawClean = rawCode.trim().toUpperCase();
    const withPrefix = rawClean.startsWith('MA-') ? rawClean : `MA-${rawClean}`;

    // Search flexibly by exact code or with/without MA- prefix
    const result = await db.query(
      `SELECT id, name FROM users 
       WHERE UPPER(telegram_pairing_code) = $1 
          OR UPPER(telegram_pairing_code) = $2
          OR UPPER(REPLACE(telegram_pairing_code, '-', '')) = $3
          OR telegram_pairing_code ILIKE $4
       LIMIT 1`,
      [rawClean, withPrefix, rawClean.replace(/[^A-Z0-9]/g, ''), `%${rawClean.replace('MA-', '')}%`]
    );

    if (result.rows.length === 0) {
      return ctx.reply(
        'Kode pairing tidak ditemukan atau telah kedaluwarsa.\n\n' +
        'Silakan buka menu Setelan di web MoneyAssist, buat kode pairing baru, lalu kirimkan kembali di sini.'
      );
    }

    const user = result.rows[0];
    const telegramId = ctx.from.id.toString();

    await db.query(
      `UPDATE users SET telegram_id = $1, telegram_pairing_code = NULL WHERE id = $2`,
      [telegramId, user.id]
    );

    ctx.reply(
      `Akun MoneyAssist atas nama ${user.name} berhasil terhubung!\n\n` +
      `Mulai sekarang, setiap pesan teks transaksi atau gambar struk/screenshot yang Anda kirim akan otomatis dianalisis oleh AI dan dicatat ke akun Anda.`,
      mainMenuKeyboard
    );
  } catch (err) {
    console.error('Pairing error:', err);
    ctx.reply('Terjadi kendala saat menghubungkan akun. Silakan coba kembali.');
  }
}

// Bot Message Handler
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/') && !text.startsWith('/pair') && !text.startsWith('/start') && !text.startsWith('/disconnect')) {
    return;
  }

  try {
    const telegramId = ctx.from.id.toString();

    // 1. Check if user is already connected
    const userResult = await db.query(
      `SELECT id, name FROM users WHERE telegram_id = $1`,
      [telegramId]
    );

    // If user is NOT connected yet, check if they sent a pairing code directly as chat text!
    if (userResult.rows.length === 0) {
      const isPairingAttempt = text.toUpperCase().includes('MA-') || text.trim().length === 8 || text.trim().length === 9;
      if (isPairingAttempt || text.toLowerCase().startsWith('ma-')) {
        return handlePairing(ctx, text);
      }

      // Check if text matches any active pairing code
      const checkCode = await db.query(
        `SELECT id FROM users WHERE telegram_pairing_code IS NOT NULL AND (telegram_pairing_code ILIKE $1 OR UPPER(telegram_pairing_code) = $2)`,
        [`%${text.trim()}%`, text.trim().toUpperCase()]
      );

      if (checkCode.rows.length > 0) {
        return handlePairing(ctx, text);
      }

      return ctx.reply(
        'Akun Telegram Anda belum terhubung dengan MoneyAssist.\n\n' +
        'Silakan buka menu Setelan di dashboard web untuk mendapatkan kode pairing, lalu kirimkan ke sini dengan format:\n/pair KODE_ANDA'
      );
    }

    const user = userResult.rows[0];

    // Handle Quick Action Menu Buttons
    if (text === 'Putuskan Koneksi' || text.toLowerCase() === '/disconnect') {
      await db.query(`UPDATE users SET telegram_id = NULL WHERE id = $1`, [user.id]);
      return ctx.reply(
        'Koneksi Berhasil Diputus.\n\n' +
        'Akun MoneyAssist Anda telah terputus dari bot ini. Untuk menghubungkan kembali, buat kode pairing baru di dashboard web.',
        { reply_markup: { remove_keyboard: true } }
      );
    }

    if (text === 'Catat Transaksi') {
      return ctx.reply(
        '*Cara Pencatatan Cepat*\n\n' +
        'Cukup ketik transaksi Anda secara bebas. Contoh:\n' +
        '• "Makan siang sushi 85rb"\n' +
        '• "Beli token listrik 150.000"\n' +
        '• "Gaji project masuk 4.500.000"\n\n' +
        'AI akan mendeteksi tipe transaksi, nominal, dan kategori secara otomatis.',
        { parse_mode: 'Markdown' }
      );
    }

    if (text === 'Kirim Bukti / Struk') {
      return ctx.reply(
        '*Pencatatan Otomatis via Foto / Tangkapan Layar*\n\n' +
        'Kirimkan foto struk kasir fisik atau screenshot bukti transfer m-banking / QRIS.\n\n' +
        'Vision AI kami akan langsung mengekstrak nominal, nama merchant, dan mengklasifikasikannya ke laporan Anda.',
        { parse_mode: 'Markdown' }
      );
    }

    if (text === 'Panduan & Pintasan') {
      return ctx.reply(
        '*Fitur Pintasan & Tips MoneyAssist*\n\n' +
        '1. *Pintasan iPhone (Back-Tap)*: Ketuk 2x punggung iPhone Anda untuk otomatis screenshot dan mengirimkannya ke bot ini.\n' +
        '2. *Pencatatan Multibahasa*: AI mengenali istilah "rb", "k", "jt", "juta", "ribu".\n' +
        '3. *Dashboard Realtime*: Seluruh data langsung sinkron ke dashboard web MoneyAssist Anda.',
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

      const net = income - expense;
      const netLabel = net >= 0 ? `+Rp ${net.toLocaleString('id-ID')}` : `-Rp ${Math.abs(net).toLocaleString('id-ID')}`;

      return ctx.reply(
        `*Ringkasan Transaksi Hari Ini*\n` +
        `Tanggal: ${today}\n\n` +
        `• Pemasukan: Rp ${income.toLocaleString('id-ID')}\n` +
        `• Pengeluaran: Rp ${expense.toLocaleString('id-ID')}\n` +
        `• Arus Kas Bersih: ${netLabel}`,
        { parse_mode: 'Markdown' }
      );
    }

    // Typing indicator
    await ctx.sendChatAction('typing');

    // 2. Request Gemini Flash to parse the transaction with an intelligent wealth copilot persona
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Kamu adalah MoneyAssist Copilot, asisten keuangan pribadi yang cerdas, profesional, berwawasan luas, dan asik.
Tugas kamu adalah menganalisis pesan pengguna dari chat Telegram. Pesan bisa berupa chat biasa (konsultasi finansial, pertanyaan, sapaan) ATAU laporan transaksi (misal: "beli kopi kenangan 28k" atau "dapet bonus 1.5jt").

Gaya Bahasa:
- Bahasa Indonesia modern, profesional, cerdas, tidak kaku, dan tidak menggunakan emoji berlebihan.
- Berikan respon yang presisi dan bernilai tambah.

Jika pesan adalah CHAT BIASA (bukan laporan transaksi):
Berikan jawaban cerdas, ringkas, dan solutif seputar manajemen keuangan, budgeting 50/30/20, atau strategi menabung.
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": false,
  "reply": "<jawaban profesional>"
}

Jika pesan mengandung LAPORAN TRANSAKSI keuangan:
Tentukan tipe transaksi ("expense" atau "income") dan kategori yang paling tepat dari: "Makanan & Minuman", "Transportasi", "Belanja", "Utilitas & Tagihan", "Gaji", "Investasi", "Hiburan", "Lainnya".
Sertakan 1 kalimat insight finansial cerdas dan solutif di field 'copilot_insight' (misal: "Pengeluaran kopi harian tercatat rapi, pastikan tetap dalam alokasi budget 30% keinginan").
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": true,
  "reply": "<konfirmasi ringkas>",
  "copilot_insight": "<1 kalimat insight keuangan cerdas>",
  "transaction_data": {
    "amount": <angka nominal total bulat murni>,
    "type": "expense" | "income",
    "category": "<kategori>",
    "description": "<nama transaksi / merchant / keterangan>"
  }
}

Teks input pengguna: "${text}"`;

    const aiResult = await model.generateContent(prompt);
    let jsonText = aiResult.response.text().trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\n|```$/g, '');
    }

    const parsed = JSON.parse(jsonText);

    if (!parsed.is_transaction) {
      return ctx.reply(parsed.reply);
    }

    const txData = parsed.transaction_data;
    if (!txData || !txData.amount || isNaN(txData.amount)) {
      return ctx.reply('Nominal transaksi tidak dapat terdeteksi secara valid. Mohon sertakan angka nominal yang jelas.');
    }

    // 3. Save to database
    const dbCategoryId = await getDbCategoryId(user.id, txData.category, txData.type);
    const today = new Date().toISOString().split('T')[0];

    await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user.id, dbCategoryId, txData.type, txData.amount, txData.description || 'Transaksi Telegram', today]
    );

    const typeLabel = txData.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
    const insightText = parsed.copilot_insight ? `\n\n<i>💡 Insight: ${parsed.copilot_insight}</i>` : '';

    await ctx.reply(
      `<b>Transaksi Berhasil Dicatat</b>\n\n` +
      `• <b>Tipe</b>: ${typeLabel}\n` +
      `• <b>Nominal</b>: Rp ${Number(txData.amount).toLocaleString('id-ID')}\n` +
      `• <b>Kategori</b>: ${txData.category}\n` +
      `• <b>Keterangan</b>: ${txData.description || '-'}\n` +
      `• <b>Tanggal</b>: ${today}${insightText}`,
      { parse_mode: 'HTML' }
    );

  } catch (error) {
    console.error('Telegram bot handling error:', error);
    ctx.reply('Maaf, terjadi kendala saat memproses transaksi. Mohon ulangi dengan format nominal yang jelas.');
  }
});

async function getConnectedTelegramUser(ctx) {
  const telegramId = ctx.from.id.toString();
  const userResult = await db.query(
    `SELECT id, name FROM users WHERE telegram_id = $1`,
    [telegramId]
  );

  return userResult.rows[0] || null;
}

async function downloadTelegramImage(ctx, fileId, declaredMimeType) {
  const fileUrl = await ctx.telegram.getFileLink(fileId);
  const response = await fetch(fileUrl.href);

  if (!response.ok) {
    const error = new Error(`Gagal mengunduh file Telegram: HTTP ${response.status}`);
    error.statusCode = 502;
    throw error;
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const responseMimeType = response.headers.get('content-type') || declaredMimeType || 'image/jpeg';
  const mimeType = validateImageBuffer(buffer, responseMimeType);

  return { buffer, mimeType };
}

async function handleTelegramImageTransaction(ctx, imageSource) {
  try {
    const user = await getConnectedTelegramUser(ctx);

    if (!user) {
      return ctx.reply(
        'Akun Telegram Anda belum terhubung dengan MoneyAssist.\n\n' +
        'Silakan buka menu Setelan di dashboard web untuk mendapatkan kode pairing, lalu kirimkan di sini dengan format:\n/pair KODE_ANDA'
      );
    }

    await ctx.reply('Menganalisis gambar transaksi Anda...');
    await ctx.sendChatAction('typing');

    const { buffer, mimeType } = await downloadTelegramImage(
      ctx,
      imageSource.fileId,
      imageSource.mimeType
    );
    const fallbackDescription = imageSource.kind === 'document'
      ? 'Transaksi dari dokumen Telegram'
      : 'Transaksi dari foto Telegram';
    const { analysis } = await analyzeAndRecordImageTransaction({
      userId: user.id,
      imageBuffer: buffer,
      mimeType,
      fallbackDescription
    });

    await ctx.reply(
      formatTelegramTransactionReply(analysis),
      { parse_mode: 'HTML' }
    );

  } catch (error) {
    console.error('Telegram vision scan error:', error);
    const statusCode = error.statusCode || 500;
    if (statusCode === 413 || statusCode === 415 || statusCode === 422 || statusCode === 400) {
      return ctx.reply(error.message);
    }
    ctx.reply('Gagal memproses gambar transaksi. Pastikan gambar cukup terang dan terbaca dengan baik.');
  }
}

// Bot Photo Handler (Scan Struk & Screenshot Transaksi)
bot.on('photo', async (ctx) => {
  const photos = ctx.message.photo || [];
  const largestPhoto = photos[photos.length - 1];

  if (!largestPhoto) {
    return ctx.reply('Foto tidak ditemukan. Kirim ulang gambar struk atau screenshot transaksi.');
  }

  if (largestPhoto.file_size && largestPhoto.file_size > MAX_IMAGE_BYTES) {
    return ctx.reply('Ukuran gambar maksimal 5MB.');
  }

  return handleTelegramImageTransaction(ctx, {
    kind: 'photo',
    fileId: largestPhoto.file_id,
    mimeType: 'image/jpeg'
  });
});

// Bot Document Handler (for images sent as files/original quality)
bot.on('document', async (ctx) => {
  const document = ctx.message.document;

  if (!document) {
    return ctx.reply('Dokumen tidak ditemukan. Kirim ulang gambar struk atau screenshot transaksi.');
  }

  const mimeType = (document.mime_type || '').toLowerCase();
  if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
    return ctx.reply('Dokumen harus berupa gambar JPG, PNG, atau WEBP.');
  }

  if (document.file_size && document.file_size > MAX_IMAGE_BYTES) {
    return ctx.reply('Ukuran gambar maksimal 5MB.');
  }

  return handleTelegramImageTransaction(ctx, {
    kind: 'document',
    fileId: document.file_id,
    mimeType
  });
});

// Category resolver
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
