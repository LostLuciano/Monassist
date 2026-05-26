const jwt = require('jsonwebtoken');
const db = require('../db');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token tidak disediakan.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_moneyassist');
    
    // Fetch user from DB
    const userResult = await db.query(
      'SELECT id, name, email, phone, avatar_url, bio, currency, language, theme, notifications_enabled FROM users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan atau token tidak valid.'
      });
    }

    // Attach user object to request
    req.user = userResult.rows[0];
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token kedaluwarsa atau tidak valid.',
      errors: error.message
    });
  }
};

module.exports = auth;
