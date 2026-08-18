const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('../db');

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const SUPPORTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const CATEGORY_CONFIG = {
  'Makanan & Minuman': { icon: 'coffee', color: '#f59e0b' },
  Transportasi: { icon: 'car', color: '#3b82f6' },
  Belanja: { icon: 'shopping-cart', color: '#10b981' },
  'Utilitas & Tagihan': { icon: 'zap', color: '#6366f1' },
  Gaji: { icon: 'briefcase', color: '#10b981' },
  Investasi: { icon: 'trending-up', color: '#0ea5e9' },
  Hiburan: { icon: 'film', color: '#8b5cf6' },
  Lainnya: { icon: 'tag', color: '#6b7280' }
};

function detectImageMimeType(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return null;

  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  return null;
}

function validateImageBuffer(buffer, declaredMimeType) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const error = new Error('File gambar kosong atau tidak valid.');
    error.statusCode = 400;
    throw error;
  }

  if (buffer.length > MAX_IMAGE_BYTES) {
    const error = new Error('Ukuran gambar maksimal 5MB.');
    error.statusCode = 413;
    throw error;
  }

  const detectedMimeType = detectImageMimeType(buffer);
  const normalizedDeclaredMimeType = (declaredMimeType || '').split(';')[0].trim().toLowerCase();
  const mimeType = detectedMimeType || normalizedDeclaredMimeType;

  if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
    const error = new Error('Format gambar harus JPG, PNG, atau WEBP.');
    error.statusCode = 415;
    throw error;
  }

  if (
    normalizedDeclaredMimeType &&
    SUPPORTED_IMAGE_MIME_TYPES.has(normalizedDeclaredMimeType) &&
    detectedMimeType &&
    normalizedDeclaredMimeType !== detectedMimeType
  ) {
    const error = new Error('Tipe file gambar tidak cocok dengan isi file.');
    error.statusCode = 415;
    throw error;
  }

  return mimeType;
}

function cleanJsonText(text) {
  const cleaned = String(text || '')
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start >= 0 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}

function normalizeCategory(category) {
  return CATEGORY_CONFIG[category] ? category : 'Lainnya';
}

function normalizeDate(dateValue) {
  const today = new Date().toISOString().split('T')[0];
  if (typeof dateValue !== 'string') return today;

  const trimmed = dateValue.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return today;

  const parsed = new Date(`${trimmed}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return today;

  return trimmed;
}

function normalizeAnalysis(raw) {
  const amount = Number(raw.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    const error = new Error('Nominal transaksi tidak dapat terdeteksi secara valid.');
    error.statusCode = 422;
    throw error;
  }

  const type = raw.type === 'income' ? 'income' : 'expense';
  const category = normalizeCategory(raw.category);

  return {
    amount: Math.round(amount),
    description: String(raw.description || '').trim(),
    type,
    category,
    transaction_date: normalizeDate(raw.transaction_date),
    copilot_note: String(raw.copilot_note || raw.copilot_insight || '').trim()
  };
}

async function analyzeTransactionImage({ imageBuffer, mimeType }) {
  const safeMimeType = validateImageBuffer(imageBuffer, mimeType);

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('xxxx')) {
    const error = new Error('GEMINI_API_KEY belum dikonfigurasi.');
    error.statusCode = 503;
    throw error;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
  const filePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType: safeMimeType
    }
  };

  const prompt = `Kamu adalah MoneyAssist Vision AI Copilot. Lakukan OCR dan analisis gambar bukti transaksi ini secara teliti.
Gambar bisa berupa screenshot m-banking, transfer bank, QRIS, e-wallet, struk kasir, invoice, atau bukti pembayaran lain.

Tentukan apakah transaksi ini PEMASUKAN (income) atau PENGELUARAN (expense).
Ambil nominal transaksi utama, bukan saldo, biaya admin terpisah, cashback, atau nomor referensi.
Jika ada beberapa nominal, pilih total akhir yang dibayar/diterima.

Kembalikan HANYA JSON mentah valid:
{
  "amount": <angka nominal bulat tanpa titik/koma/simbol>,
  "description": "<Nama merchant, penerima, pengirim, atau keterangan transaksi>",
  "type": "expense" | "income",
  "category": "Makanan & Minuman" | "Transportasi" | "Belanja" | "Utilitas & Tagihan" | "Gaji" | "Investasi" | "Hiburan" | "Lainnya",
  "transaction_date": "<tanggal transaksi YYYY-MM-DD>",
  "copilot_note": "<1 kalimat catatan finansial ringkas dan berguna>"
}`;

  const aiResult = await model.generateContent([prompt, filePart]);
  const jsonText = cleanJsonText(aiResult.response.text());
  return normalizeAnalysis(JSON.parse(jsonText));
}

async function getOrCreateCategoryId(userId, categoryName, type) {
  const safeCategoryName = normalizeCategory(categoryName);
  const result = await db.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2',
    [userId, safeCategoryName]
  );

  if (result.rows.length > 0) {
    return result.rows[0].id;
  }

  const config = CATEGORY_CONFIG[safeCategoryName] || CATEGORY_CONFIG.Lainnya;
  const insertResult = await db.query(
    `INSERT INTO categories (user_id, name, icon, color, type, budget_limit, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, 1000000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING id`,
    [userId, safeCategoryName, config.icon, config.color, type || 'expense']
  );

  return insertResult.rows[0].id;
}

async function recordAnalyzedTransaction(userId, analysis, fallbackDescription) {
  const txType = analysis.type === 'income' ? 'income' : 'expense';
  const dbCategoryId = await getOrCreateCategoryId(userId, analysis.category, txType);
  const description =
    analysis.description ||
    fallbackDescription ||
    (txType === 'income' ? 'Pemasukan dari gambar' : 'Pengeluaran dari gambar');

  const result = await db.query(
    `INSERT INTO transactions (user_id, category_id, type, amount, description, date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
     RETURNING *`,
    [userId, dbCategoryId, txType, analysis.amount, description, analysis.transaction_date]
  );

  return result.rows[0];
}

async function analyzeAndRecordImageTransaction({ userId, imageBuffer, mimeType, fallbackDescription }) {
  const analysis = await analyzeTransactionImage({ imageBuffer, mimeType });
  const transaction = await recordAnalyzedTransaction(userId, analysis, fallbackDescription);

  return { analysis, transaction };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatTelegramTransactionReply(analysis) {
  const typeLabel = analysis.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
  const noteText = analysis.copilot_note
    ? `\n\n<i>Catatan: ${escapeHtml(analysis.copilot_note)}</i>`
    : '';

  return (
    `<b>Transaksi Berhasil Dicatat</b>\n\n` +
    `• <b>Tipe</b>: ${typeLabel}\n` +
    `• <b>Nominal</b>: Rp ${Number(analysis.amount).toLocaleString('id-ID')}\n` +
    `• <b>Kategori</b>: ${escapeHtml(analysis.category)}\n` +
    `• <b>Keterangan</b>: ${escapeHtml(analysis.description || '-')}\n` +
    `• <b>Tanggal</b>: ${escapeHtml(analysis.transaction_date)}${noteText}`
  );
}

module.exports = {
  MAX_IMAGE_BYTES,
  SUPPORTED_IMAGE_MIME_TYPES,
  analyzeAndRecordImageTransaction,
  analyzeTransactionImage,
  formatTelegramTransactionReply,
  validateImageBuffer
};
