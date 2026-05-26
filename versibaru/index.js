const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
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
