const { Telegraf, Markup } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const mainMenuKeyboard = Markup.keyboard([
  ['📝 Catat Manual', '📸 Upload Struk'],
  ['📊 Ringkasan Hari Ini', '❓ Bantuan'],
  ['🔌 Putuskan Akun']
]).resize();
// Bot Commands
bot.start((ctx) => {
  const code = ctx.payload; // Start parameter, e.g. /start MA-123456
  if (code) {
    return handlePairing(ctx, code);
  }
  ctx.reply(
    `🤖 Halo! Selamat datang di MoneyAssist Bot.\n\n` +
    `Untuk menghubungkan akun MoneyAssist Anda:\n` +
    `1. Buka web dashboard MoneyAssist\n` +
    `2. Masuk ke halaman Profil / Pengaturan\n` +
    `3. Salin kode Telegram Pairing\n` +
    `4. Kirim ke bot ini dengan format: /pair KODE\n\n` +
    `Setelah terhubung, Anda bisa mencatat transaksi hanya dengan mengirimkan pesan teks di sini!`,
    mainMenuKeyboard
  );
});

bot.command('pair', (ctx) => {
  const parts = ctx.message.text.split(' ');
  const code = parts[1];
  if (!code) {
    return ctx.reply('Silakan sertakan kode pairing Anda. Contoh: /pair MA-123456');
  }
  return handlePairing(ctx, code);
});

async function handlePairing(ctx, code) {
  try {
    const formattedCode = code.toUpperCase().trim();
    const result = await db.query(
      `SELECT id, name FROM users WHERE telegram_pairing_code = $1`,
      [formattedCode]
    );

    if (result.rows.length === 0) {
      return ctx.reply('❌ Kode pairing tidak valid atau sudah kedaluwarsa.');
    }

    const user = result.rows[0];
    const telegramId = ctx.from.id.toString();

    await db.query(
      `UPDATE users SET telegram_id = $1, telegram_pairing_code = NULL WHERE id = $2`,
      [telegramId, user.id]
    );

    ctx.reply(
      `🎉 Akun MoneyAssist Kak ${user.name} berhasil dihubungkan! Sekarang Kakak bisa mencatat transaksi langsung dari sini.`,
      mainMenuKeyboard
    );
  } catch (err) {
    console.error('Pairing error:', err);
    ctx.reply('❌ Terjadi kesalahan saat menghubungkan akun.');
  }
}

// Bot Message Handler
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith('/')) return; // Ignore other commands

  try {
    // 1. Find user by telegram_id
    const telegramId = ctx.from.id.toString();
    const userResult = await db.query(
      `SELECT id, name FROM users WHERE telegram_id = $1`,
      [telegramId]
    );

    if (userResult.rows.length === 0) {
      return ctx.reply(
        '⚠️ Akun Anda belum terhubung.\n\n' +
        'Silakan buka halaman Profil di web MoneyAssist untuk mendapatkan kode pairing, lalu kirimkan di sini dengan format: /pair KODE_ANDA'
      );
    }

    const user = userResult.rows[0];

    // Handle Shortcuts
    if (text === '🔌 Putuskan Akun' || text.toLowerCase() === '/disconnect') {
      await db.query(`UPDATE users SET telegram_id = NULL WHERE id = $1`, [user.id]);
      return ctx.reply(
        '🔌 *Koneksi Terputus*\n\n' +
        'Akun MoneyAssist Anda telah berhasil diputus dari bot ini.\n' +
        'Jika Anda ingin menghubungkannya kembali, silakan buat kode pairing baru di dashboard web.',
        { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } }
      );
    }
    if (text === '📝 Catat Manual') {
      return ctx.reply(
        '✍️ *Cara Catat Manual*\n\n' +
        'Silakan ketik transaksi Anda seperti biasa.\n' +
        'Contoh:\n' +
        '• "Beli nasi goreng 20ribu"\n' +
        '• "Bayar token listrik 100.000"\n' +
        '• "Gaji cair 5.000.000"',
        { parse_mode: 'Markdown' }
      );
    }
    if (text === '📸 Upload Struk') {
      return ctx.reply(
        '📸 *Cara Upload Struk*\n\n' +
        'Silakan klik ikon lampiran (📎) di kiri bawah, pilih foto struk belanja Kakak, lalu kirimkan ke sini.\n\n' +
        'Sistem AI kami akan otomatis membaca nominal, kategori, dan daftar barang belanjaan Kakak!',
        { parse_mode: 'Markdown' }
      );
    }
    if (text === '❓ Bantuan') {
      return ctx.reply(
        '❓ *Bantuan MoneyAssist Bot*\n\n' +
        'Bot ini terintegrasi langsung dengan dashboard web Kakak.\n\n' +
        'Anda dapat mencatat pengeluaran/pemasukan dengan:\n' +
        '1. *Chat Bebas*: Cukup ceritakan pengeluaran Anda (misal: "tadi nongkrong habis 50rb").\n' +
        '2. *Scan Struk*: Kirimkan foto struk kasir, bot akan mencatat detailnya otomatis.\n\n' +
        'Gunakan menu tombol di bawah untuk pintasan.',
        { parse_mode: 'Markdown' }
      );
    }
    if (text === '📊 Ringkasan Hari Ini') {
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
        `📊 *Ringkasan Hari Ini (${today})*\n\n` +
        `📉 Pengeluaran: Rp ${expense.toLocaleString('id-ID')}\n` +
        `📈 Pemasukan: Rp ${income.toLocaleString('id-ID')}\n\n` +
        `Sisa Saldo Hari Ini: Rp ${(income - expense).toLocaleString('id-ID')}`,
        { parse_mode: 'Markdown' }
      );
    }

    // Inform user that bot is typing
    await ctx.sendChatAction('typing');

    // 2. Request Gemini to parse the transaction text
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Kamu adalah Asisten AI Keuangan dari MoneyAssist.
Tugas kamu adalah menganalisis pesan pengguna. Pesan pengguna bisa berupa chat biasa (pertanyaan, sapaan) ATAU laporan transaksi (misal "beli makan 50rb" atau "gaji cair 5 juta").

Jika pesan adalah CHAT BIASA (bukan laporan transaksi):
Berikan jawaban yang ramah, profesional, dan membantu seputar keuangan.
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": false,
  "reply": "<jawaban natural kamu>"
}

Jika pesan mengandung LAPORAN TRANSAKSI keuangan:
Ekstrak datanya dengan kategori: "Makanan & Minuman", "Transportasi", "Belanja", "Utilitas & Tagihan", "Gaji", "Investasi", "Hiburan", atau "Lainnya".
Format kembalian (WAJIB JSON mentah):
{
  "is_transaction": true,
  "reply": "<pesan konfirmasi ramah>",
  "transaction_data": {
    "amount": <angka nominal bulat>,
    "type": "expense" | "income",
    "category": "<kategori>",
    "description": "<keterangan singkat>"
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
      // It's a normal chat
      return ctx.reply(parsed.reply);
    }

    // It is a transaction
    const txData = parsed.transaction_data;
    if (!txData || !txData.amount || isNaN(txData.amount)) {
      return ctx.reply('⚠️ Maaf, saya tidak dapat mendeteksi nominal transaksi dari pesan tersebut. Mohon sertakan angka nominal yang jelas.');
    }

    // 3. Resolve category ID in DB
    const dbCategoryId = await getDbCategoryId(user.id, txData.category, txData.type);

    // 4. Save transaction to database
    const today = new Date().toISOString().split('T')[0];
    const insertResult = await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [user.id, dbCategoryId, txData.type, txData.amount, txData.description || 'Transaksi Telegram', today]
    );

    const icon = txData.type === 'income' ? '📈' : '📉';
    ctx.reply(
      `${parsed.reply}\n\n` +
      `✅ ${icon} Transaksi Berhasil Dicatat!\n` +
      `• Nominal: Rp ${txData.amount.toLocaleString('id-ID')}\n` +
      `• Kategori: ${txData.category}\n` +
      `• Keterangan: ${txData.description || 'Transaksi Telegram'}`
    );

  } catch (error) {
    console.error('Telegram bot handling error:', error);
    ctx.reply('❌ Maaf, terjadi kesalahan saat memproses transaksi Kakak. Coba lagi dengan format nominal yang lebih jelas.');
  }
});

// Bot Photo Handler (Scan Struk Belanja)
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
        '⚠️ Akun Anda belum terhubung.\n\n' +
        'Silakan buka halaman Profil di web MoneyAssist untuk mendapatkan kode pairing, lalu kirimkan di sini dengan format: /pair KODE_ANDA'
      );
    }

    const user = userResult.rows[0];

    // Inform user that bot is processing
    await ctx.reply('🔍 Sedang menganalisis struk belanja Kakak...');
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

    // 2. Request Gemini to parse the receipt image
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const filePart = {
      inlineData: {
        data: buffer.toString('base64'),
        mimeType: 'image/jpeg'
      }
    };

    const prompt = `Analisis gambar struk belanja ini dan berikan data JSON terstruktur dengan format berikut:
{
  "amount": <angka nominal total belanja saja, contoh: 58500>,
  "description": "<Nama Toko>\\n\\nDaftar Belanja:\\n- <Barang 1> (Rp <Harga>)\\n- <Barang 2> (Rp <Harga>)\\n(Sertakan semua barang yang ada di struk beserta harganya menggunakan format baris baru \\\\n)",
  "type": "expense",
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
      return ctx.reply('⚠️ Maaf, saya tidak dapat mendeteksi nominal total dari struk tersebut. Mohon pastikan foto struk cukup jelas dan nominal total terlihat.');
    }

    // 3. Resolve category ID in DB
    const dbCategoryId = await getDbCategoryId(user.id, geminiJson.category || 'Lainnya', 'expense');

    // 4. Save transaction to database
    await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        user.id,
        dbCategoryId,
        'expense',
        geminiJson.amount,
        geminiJson.description || 'Scan Struk Telegram',
        geminiJson.transaction_date || new Date().toISOString().split('T')[0]
      ]
    );

    ctx.reply(
      `✅ Resi Belanja Berhasil Dicatat!\n\n` +
      `• Nominal: Rp ${geminiJson.amount.toLocaleString('id-ID')}\n` +
      `• Kategori: ${geminiJson.category || 'Lainnya'}\n` +
      `• Rincian Belanja:\n${geminiJson.description}`
    );

  } catch (error) {
    console.error('Telegram receipt scan error:', error);
    ctx.reply('❌ Gagal menganalisis struk. Pastikan file berupa foto struk belanja yang jelas.');
  }
});

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
