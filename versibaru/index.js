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

// Main router
const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

// Fallback status check route
app.get('/', (req, res) => {
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
