const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

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
    `Setelah terhubung, Anda bisa mencatat transaksi hanya dengan mengirimkan pesan teks di sini!`
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

    ctx.reply(`🎉 Akun MoneyAssist Kak ${user.name} berhasil dihubungkan! Sekarang Kakak bisa mencatat transaksi langsung dari sini.`);
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

    // Inform user that bot is typing
    await ctx.sendChatAction('typing');

    // 2. Request Gemini to parse the transaction text
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Kamu adalah parser data transaksi MoneyAssist.
Tugas kamu adalah mengekstrak nominal, jenis (pemasukan atau pengeluaran), kategori utama, dan keterangan singkat dari teks input pengguna.
Gunakan kategori berikut:
- Makanan & Minuman
- Transportasi
- Belanja
- Utilitas & Tagihan
- Gaji
- Investasi
- Hiburan
- Lainnya

Kembalikan data HANYA dalam format JSON mentah (raw JSON) tanpa pembungkus markdown (\`\`\`json) atau teks lainnya:
{
  "amount": <angka nominal>,
  "type": "expense" | "income",
  "category": "<kategori di atas>",
  "description": "<keterangan singkat>"
}

Teks input: "${text}"`;

    const aiResult = await model.generateContent(prompt);
    let jsonText = aiResult.response.text().trim();
    
    // Clean up potential markdown wrapper from response
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\n|```$/g, '');
    }

    const txData = JSON.parse(jsonText);

    if (!txData.amount || isNaN(txData.amount)) {
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
      `✅ ${icon} Transaksi Berhasil Dicatat!\n\n` +
      `• Nominal: Rp ${txData.amount.toLocaleString('id-ID')}\n` +
      `• Kategori: ${txData.category}\n` +
      `• Keterangan: ${txData.description || 'Transaksi Telegram'}`
    );

  } catch (error) {
    console.error('Telegram bot handling error:', error);
    ctx.reply('❌ Maaf, terjadi kesalahan saat memproses transaksi Kakak. Coba lagi dengan format nominal yang lebih jelas.');
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
