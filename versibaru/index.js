const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) || origin.startsWith('http://localhost:');
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.warn(`CORS Warning: Origin ${origin} not in allowed list, but allowed for development`);
      return callback(null, true);
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '12mb' }));

// Main router
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Favicon handler to avoid 404 console errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Root status check & web app landing redirect
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.send(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>MoneyAssist API Server</title>
          <link rel="icon" href="data:,">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #020617; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(45, 212, 191, 0.2); border-radius: 24px; padding: 36px; max-width: 480px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(16px); }
            .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(20, 184, 166, 0.1); color: #2dd4bf; border: 1px solid rgba(45, 212, 191, 0.3); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
            .dot { width: 8px; height: 8px; border-radius: 50%; background: #2dd4bf; box-shadow: 0 0 8px #2dd4bf; }
            h1 { font-size: 24px; font-weight: 800; margin: 0 0 8px; background: linear-gradient(to right, #ffffff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px; }
            .btn { display: inline-block; background: linear-gradient(to right, #14b8a6, #06b6d4); color: white; text-decoration: none; padding: 12px 28px; border-radius: 12px; font-weight: 700; font-size: 14px; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 10px 25px -5px rgba(20, 184, 166, 0.3); }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(20, 184, 166, 0.5); }
            .meta { margin-top: 24px; font-size: 11px; color: #64748b; font-family: monospace; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge"><span class="dot"></span> Backend API Online</div>
            <h1>MoneyAssist Server</h1>
            <p>Ini adalah server backend API & Telegram Bot MoneyAssist. Untuk menggunakan aplikasi web, dashboard keuangan, dan analitik AI, silakan buka aplikasi web utama.</p>
            <a href="https://moneyassist.netlify.app" class="btn">🚀 Buka Web MoneyAssist</a>
            <div class="meta">PostgreSQL (Neon) • Express.js • Gemini Vision AI</div>
          </div>
        </body>
      </html>
    `);
  }

  res.json({
    status: 'success',
    message: 'MoneyAssist Node.js API is online!',
    framework: 'Express.js',
    database: 'PostgreSQL (Neon Tech)'
  });
});

const bot = require('./bot');

// Telegram Webhook Setup Route
app.get('/api/webhook/setup', async (req, res) => {
  try {
    const host = req.get('host');
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const url = `${protocol}://${host}/api/webhook/telegram`;
    await bot.telegram.setWebhook(url);
    res.json({ success: true, message: `Webhook set to ${url}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Telegram Webhook Receiver Route
app.post('/api/webhook/telegram', async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(200).send('Error but OK');
  }
});

// Start the server if run directly (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    
    // Launch Telegram Bot in Polling mode ONLY if explicitly configured in .env (for local dev)
    if (process.env.TELEGRAM_POLLING === 'true') {
      bot.launch()
        .then(() => console.log('🤖 Telegram Bot online in Polling mode.'))
        .catch(err => console.error('❌ Failed to start Telegram Bot in Polling mode:', err));
    } else {
      console.log('🤖 Telegram Bot runs in Webhook mode. Visit /api/webhook/setup to register webhook.');
    }
  });
}

module.exports = app;
