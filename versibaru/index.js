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

// Start the server if run directly (local development)
if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
