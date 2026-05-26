const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper to sign JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'super_secret_jwt_key_moneyassist', {
    expiresIn: '24h'
  });
};

// Helper for paginated response
const getPaginatedResponse = (items, total, page, limit) => {
  const lastPage = Math.ceil(total / limit);
  return {
    success: true,
    data: items,
    pagination: {
      total: parseInt(total),
      per_page: parseInt(limit),
      current_page: parseInt(page),
      last_page: lastPage,
      from: (page - 1) * limit + 1,
      to: Math.min(page * limit, total)
    }
  };
};

// ==========================================
// 1. AUTHENTICATION ROUTE (/api/auth)
// ==========================================

// POST /auth/register
router.post('/auth/register', async (req, res) => {
  const client = await db.pool.connect();
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({ success: false, message: 'Nama, email, dan password wajib diisi.' });
    }

    await client.query('BEGIN');

    // Check if email already exists
    const checkEmail = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(422).json({ success: false, message: 'Email sudah terdaftar.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const userResult = await client.query(
      `INSERT INTO users (name, email, password, currency, language, theme, created_at, updated_at) 
       VALUES ($1, $2, $3, 'IDR', 'id', 'dark', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, name, email, currency, language, theme`,
      [name, email, hashedPassword]
    );

    const user = userResult.rows[0];

    // Seed default categories for this user
    const defaultCategories = [
      { name: 'Gaji', icon: 'briefcase', color: '#10b981', type: 'income' },
      { name: 'Investasi', icon: 'trending-up', color: '#0ea5e9', type: 'income' },
      { name: 'Makanan & Minuman', icon: 'coffee', color: '#f59e0b', type: 'expense', budget: 1500000.00 },
      { name: 'Utilitas & Tagihan', icon: 'zap', color: '#6366f1', type: 'expense', budget: 1000000.00 },
      { name: 'Sewa & Rumah', icon: 'home', color: '#ec4899', type: 'expense', budget: 1500000.00 },
      { name: 'Hiburan', icon: 'film', color: '#8b5cf6', type: 'expense', budget: 500000.00 }
    ];

    for (const cat of defaultCategories) {
      await client.query(
        `INSERT INTO categories (user_id, name, icon, color, type, budget_limit, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        [user.id, cat.name, cat.icon, cat.color, cat.type, cat.budget || null]
      );
    }

    await client.query('COMMIT');

    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      token,
      user
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Registrasi gagal: ' + error.message });
  } finally {
    client.release();
  }
});

// POST /auth/login
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ success: false, message: 'Email dan password wajib diisi.' });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak cocok dengan data kami.' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Kredensial tidak cocok dengan data kami.' });
    }

    const token = generateToken(user.id);
    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        currency: user.currency,
        language: user.language,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login gagal: ' + error.message });
  }
});

// POST /auth/logout
router.post('/auth/logout', auth, (req, res) => {
  res.json({ success: true, message: 'Logout berhasil.' });
});

// GET /auth/me
router.get('/auth/me', auth, (req, res) => {
  res.json(req.user);
});

// PUT /auth/profile
router.put('/auth/profile', auth, async (req, res) => {
  try {
    const { name, phone, currency, language, theme, bio, notifications_enabled } = req.body;
    
    const result = await db.query(
      `UPDATE users 
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           currency = COALESCE($3, currency),
           language = COALESCE($4, language),
           theme = COALESCE($5, theme),
           bio = COALESCE($6, bio),
           notifications_enabled = COALESCE($7, notifications_enabled),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING id, name, email, phone, avatar_url, bio, currency, language, theme, notifications_enabled`,
      [name, phone, currency, language, theme, bio, notifications_enabled, req.user.id]
    );

    res.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil: ' + error.message });
  }
});

// POST /auth/change-password
router.post('/auth/change-password', auth, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(422).json({ success: false, message: 'Password saat ini dan password baru wajib diisi.' });
    }

    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [req.user.id]);
    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(422).json({ success: false, message: 'Password saat ini salah.' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    await db.query('UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [hashedPassword, req.user.id]);

    res.json({ success: true, message: 'Password berhasil diperbarui.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengubah password: ' + error.message });
  }
});


// ==========================================
// 2. CATEGORIES ROUTE (/api/categories)
// ==========================================

// GET /categories
router.get('/categories', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [req.user.id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /categories
router.post('/categories', auth, async (req, res) => {
  try {
    const { name, icon, color, type, budget_limit, description } = req.body;
    if (!name || !type) {
      return res.status(422).json({ success: false, message: 'Nama dan tipe kategori wajib diisi.' });
    }

    const result = await db.query(
      `INSERT INTO categories (user_id, name, icon, color, type, budget_limit, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.user.id, name, icon || 'tag', color || '#6b7280', type, budget_limit || null, description || null]
    );

    res.status(201).json({
      success: true,
      message: 'Kategori berhasil dibuat',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /categories/:id
router.get('/categories/:id', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /categories/:id
router.put('/categories/:id', auth, async (req, res) => {
  try {
    const { name, icon, color, type, budget_limit, description } = req.body;
    
    // Verify ownership
    const check = await db.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    const result = await db.query(
      `UPDATE categories
       SET name = COALESCE($1, name),
           icon = COALESCE($2, icon),
           color = COALESCE($3, color),
           type = COALESCE($4, type),
           budget_limit = COALESCE($5, budget_limit),
           description = COALESCE($6, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, icon, color, type, budget_limit, description, req.params.id]
    );

    res.json({ success: true, message: 'Kategori berhasil diperbarui', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /categories/:id
router.delete('/categories/:id', auth, async (req, res) => {
  try {
    const check = await db.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// 3. TRANSACTIONS ROUTE (/api/transactions)
// ==========================================

// GET /transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const { category_id, type, start_date, end_date, search, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let queryParams = [req.user.id];
    let queryConditions = ['user_id = $1'];
    let paramIndex = 2;

    if (category_id) {
      queryConditions.push(`category_id = $${paramIndex}`);
      queryParams.push(category_id);
      paramIndex++;
    }

    if (type) {
      queryConditions.push(`type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    if (start_date && end_date) {
      queryConditions.push(`date BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
      queryParams.push(start_date, end_date);
      paramIndex += 2;
    }

    if (search) {
      queryConditions.push(`description ILIKE $${paramIndex}`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = queryConditions.join(' AND ');
    
    // Get total count
    const countResult = await db.query(`SELECT COUNT(*) FROM transactions WHERE ${whereClause}`, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // Get items
    const query = `SELECT * FROM transactions WHERE ${whereClause} ORDER BY date DESC, id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    const itemsResult = await db.query(query, [...queryParams, limit, offset]);

    res.json(getPaginatedResponse(itemsResult.rows, total, page, limit));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /transactions
router.post('/transactions', auth, async (req, res) => {
  try {
    const { category_id, type, amount, description, date, receipt_url, tags, notes } = req.body;
    if (!category_id || !type || !amount || !description || !date) {
      return res.status(422).json({ success: false, message: 'Field wajib tidak boleh kosong.' });
    }

    // Verify category ownership
    const catCheck = await db.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [category_id, req.user.id]);
    if (catCheck.rows.length === 0) {
      return res.status(422).json({ success: false, message: 'Kategori tidak valid.' });
    }

    const result = await db.query(
      `INSERT INTO transactions (user_id, category_id, type, amount, description, date, receipt_url, tags, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.user.id, category_id, type, amount, description, date, receipt_url || null, tags ? JSON.stringify(tags) : null, notes || null]
    );

    res.status(201).json({
      success: true,
      message: 'Transaksi berhasil dicatat',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /transactions/statistics
router.get('/transactions/statistics', auth, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // Default to current month
    const start = start_date || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    const end = end_date || new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

    const statsResult = await db.query(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
       FROM transactions
       WHERE user_id = $1 AND date BETWEEN $2 AND $3`,
      [req.user.id, start, end]
    );

    const income = parseFloat(statsResult.rows[0].income);
    const expense = parseFloat(statsResult.rows[0].expense);
    const balance = income - expense;

    res.json({
      success: true,
      message: 'Statistik transaksi berhasil diambil',
      data: {
        income,
        expense,
        balance,
        period: { start, end }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /transactions/:id
router.get('/transactions/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /transactions/:id
router.put('/transactions/:id', auth, async (req, res) => {
  try {
    const { category_id, type, amount, description, date, receipt_url, tags, notes } = req.body;
    
    const check = await db.query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    if (category_id) {
      const catCheck = await db.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [category_id, req.user.id]);
      if (catCheck.rows.length === 0) {
        return res.status(422).json({ success: false, message: 'Kategori tidak valid.' });
      }
    }

    const result = await db.query(
      `UPDATE transactions
       SET category_id = COALESCE($1, category_id),
           type = COALESCE($2, type),
           amount = COALESCE($3, amount),
           description = COALESCE($4, description),
           date = COALESCE($5, date),
           receipt_url = COALESCE($6, receipt_url),
           tags = COALESCE($7, tags),
           notes = COALESCE($8, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [category_id, type, amount, description, date, receipt_url, tags ? JSON.stringify(tags) : null, notes, req.params.id]
    );

    res.json({ success: true, message: 'Transaksi berhasil diperbarui', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /transactions/:id
router.delete('/transactions/:id', auth, async (req, res) => {
  try {
    const check = await db.query('SELECT id FROM transactions WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    await db.query('DELETE FROM transactions WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Transaksi berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// 4. SAVINGS GOALS ROUTE (/api/goals)
// ==========================================

// GET /goals
router.get('/goals', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM savings_goals WHERE user_id = $1', [req.user.id]);
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(
      'SELECT * FROM savings_goals WHERE user_id = $1 ORDER BY deadline ASC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    res.json(getPaginatedResponse(result.rows, total, page, limit));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /goals
router.post('/goals', auth, async (req, res) => {
  try {
    const { name, description, target_amount, deadline, category, icon, color, priority } = req.body;
    if (!name || !target_amount || !deadline) {
      return res.status(422).json({ success: false, message: 'Nama, target dana, dan tenggat waktu wajib diisi.' });
    }

    const result = await db.query(
      `INSERT INTO savings_goals (user_id, name, description, target_amount, current_amount, deadline, category, icon, color, priority, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 0.00, $5, $6, $7, $8, $9, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [req.user.id, name, description || null, target_amount, deadline, category || null, icon || 'shield', color || '#10b981', priority || 'medium']
    );

    res.status(201).json({ success: true, message: 'Target tabungan berhasil dibuat', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /goals/statistics
router.get('/goals/statistics', auth, async (req, res) => {
  try {
    const user = req.user.id;
    const countResult = await db.query(
      `SELECT 
        COUNT(*) as total_goals,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed_goals,
        COALESCE(SUM(target_amount), 0) as total_target,
        COALESCE(SUM(current_amount), 0) as total_saved
       FROM savings_goals
       WHERE user_id = $1`,
      [user]
    );

    const totalGoals = parseInt(countResult.rows[0].total_goals);
    const completedGoals = parseInt(countResult.rows[0].completed_goals);
    const totalTarget = parseFloat(countResult.rows[0].total_target);
    const totalSaved = parseFloat(countResult.rows[0].total_saved);

    res.json({
      success: true,
      message: 'Statistik tabungan berhasil diambil',
      data: {
        total_goals: totalGoals,
        completed_goals: completedGoals,
        total_target: totalTarget,
        total_saved: totalSaved,
        completion_rate: totalGoals > 0 ? parseFloat(((completedGoals / totalGoals) * 100).toFixed(2)) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /goals/:id
router.get('/goals/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Target tabungan tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /goals/:id
router.put('/goals/:id', auth, async (req, res) => {
  try {
    const { name, description, target_amount, current_amount, deadline, category, icon, color, priority, status } = req.body;
    
    const check = await db.query('SELECT id FROM savings_goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    const result = await db.query(
      `UPDATE savings_goals
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           target_amount = COALESCE($3, target_amount),
           current_amount = COALESCE($4, current_amount),
           deadline = COALESCE($5, deadline),
           category = COALESCE($6, category),
           icon = COALESCE($7, icon),
           color = COALESCE($8, color),
           priority = COALESCE($9, priority),
           status = COALESCE($10, status),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [name, description, target_amount, current_amount, deadline, category, icon, color, priority, status, req.params.id]
    );

    res.json({ success: true, message: 'Target tabungan berhasil diperbarui', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /goals/:id
router.delete('/goals/:id', auth, async (req, res) => {
  try {
    const check = await db.query('SELECT id FROM savings_goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    await db.query('DELETE FROM savings_goals WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Target tabungan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /goals/:id/progress
router.post('/goals/:id/progress', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(422).json({ success: false, message: 'Jumlah progress valid diperlukan.' });
    }

    const check = await db.query('SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Target tabungan tidak ditemukan.' });
    }

    const goal = check.rows[0];
    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    const status = newAmount >= parseFloat(goal.target_amount) ? 'completed' : goal.status;

    const result = await db.query(
      `UPDATE savings_goals 
       SET current_amount = $1, status = $2, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $3 
       RETURNING *`,
      [newAmount, status, req.params.id]
    );

    res.json({ success: true, message: 'Progress tabungan berhasil ditambahkan', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ==========================================
// 5. CHAT / AI ROUTE (/api/chat)
// ==========================================

// GET /chat/history
router.get('/chat/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM chat_messages WHERE user_id = $1', [req.user.id]);
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(
      'SELECT id, message, response, type, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    res.json(getPaginatedResponse(result.rows, total, page, limit));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /chat/send
router.post('/chat/send', auth, async (req, res) => {
  try {
    const { message, type = 'general' } = req.body;
    if (!message) {
      return res.status(422).json({ success: false, message: 'Pesan wajib diisi.' });
    }

    // Get user context
    const incomeResult = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'income'", [req.user.id]);
    const expenseResult = await db.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND type = 'expense'", [req.user.id]);
    const goalsResult = await db.query("SELECT COUNT(*) FROM savings_goals WHERE user_id = $1 AND status = 'active'", [req.user.id]);

    const userContext = {
      total_income: parseFloat(incomeResult.rows[0].total),
      total_expense: parseFloat(expenseResult.rows[0].total),
      active_goals: parseInt(goalsResult.rows[0].count)
    };

    let aiResponse = '';

    // Check for Gemini API key
    if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('xxxx')) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `Kamu adalah MoneyAssist, asisten keuangan pribadi bertenaga AI.
Tugas kamu adalah membantu pengguna mengelola uang, merencanakan target tabungan, dan memberikan keputusan keuangan yang bijak.
Berikan saran yang bersahabat, profesional, dan dapat langsung diterapkan.
Context saat ini:
- Total Pemasukan: Rp${userContext.total_income.toLocaleString('id-ID')}
- Total Pengeluaran: Rp${userContext.total_expense.toLocaleString('id-ID')}
- Target Tabungan Aktif: ${userContext.active_goals}

Tipe bantuan: ${type}.
Pesan Pengguna: ${message}`;

        const result = await model.generateContent(systemPrompt);
        aiResponse = result.response.text();
      } catch (geminiError) {
        console.error('Gemini API Error, falling back to mock:', geminiError.message);
        aiResponse = getMockChatResponse(message, type);
      }
    } else {
      aiResponse = getMockChatResponse(message, type);
    }

    // Save chat message
    const saveResult = await db.query(
      `INSERT INTO chat_messages (user_id, message, response, type, context, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, message, response, type, created_at`,
      [req.user.id, message, aiResponse, type, JSON.stringify(userContext)]
    );

    res.status(201).json({
      success: true,
      message: 'Pesan terkirim',
      data: saveResult.rows[0]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mendapatkan respons AI: ' + error.message });
  }
});

// GET /chat/:id
router.get('/chat/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM chat_messages WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Pesan tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /chat/:id
router.delete('/chat/:id', auth, async (req, res) => {
  try {
    const check = await db.query('SELECT id FROM chat_messages WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }
    await db.query('DELETE FROM chat_messages WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Pesan berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /chat (Clear history)
router.delete('/chat', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM chat_messages WHERE user_id = $1', [req.user.id]);
    res.json({ success: true, message: 'Riwayat chat berhasil dikosongkan.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mock Chat Responses
function getMockChatResponse(message, type) {
  const responses = {
    general: "Terima kasih atas pesan Anda! Saya siap membantu Anda mengelola keuangan dengan lebih baik. Berdasarkan kondisi saat ini, disarankan untuk mengevaluasi pengeluaran bulanan dan menyisihkan dana darurat minimal 20%. Ada hal khusus yang ingin Anda tanyakan?",
    financial: "Analisis keuangan Anda menunjukkan rasio pengeluaran yang cukup tinggi pada kategori hiburan. Cobalah metode anggaran 50/30/20 (50% kebutuhan, 30% keinginan, 20% tabungan) untuk menyeimbangkan keuangan Anda.",
    goal: "Membuat rencana tabungan adalah awal yang sangat baik! Saya sarankan untuk membagi target besar Anda menjadi milestone mingguan/bulanan agar terasa lebih ringan dan mudah dipantau.",
    transaction: "Saya telah menganalisis daftar transaksi Anda. Sebagian besar pengeluaran Anda terkonsentrasi pada utilitas dan makanan. Anda dapat memantau batas anggaran kategori tersebut agar tidak melebihi batas limit bulanan."
  };
  return responses[type] || responses.general;
}


// ==========================================
// 6. RECOMMENDATIONS ROUTE (/api/recommendations)
// ==========================================

// GET /recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await db.query('SELECT COUNT(*) FROM recommendations WHERE user_id = $1', [req.user.id]);
    const total = parseInt(countResult.rows[0].count);

    const result = await db.query(
      'SELECT * FROM recommendations WHERE user_id = $1 ORDER BY priority DESC, created_at DESC LIMIT $2 OFFSET $3',
      [req.user.id, limit, offset]
    );

    res.json(getPaginatedResponse(result.rows, total, page, limit));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /recommendations/generate
router.post('/recommendations/generate', auth, async (req, res) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // Get transactions of the past 3 months
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    const dateStr = threeMonthsAgo.toISOString().split('T')[0];

    const transResult = await client.query(
      "SELECT * FROM transactions WHERE user_id = $1 AND date >= $2 AND type = 'expense'",
      [req.user.id, dateStr]
    );

    const transactions = transResult.rows;
    const totalExpense = transactions.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const monthlyExpense = totalExpense / 3;

    const incResult = await client.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = $1 AND date >= $2 AND type = 'income'",
      [req.user.id, dateStr]
    );
    const monthlyIncome = parseFloat(incResult.rows[0].total) / 3;

    // Group expenses by category
    const catExpenses = {};
    let highestCategoryAmount = 0;
    let highestCategoryId = null;

    transactions.forEach(t => {
      catExpenses[t.category_id] = (catExpenses[t.category_id] || 0) + parseFloat(t.amount);
      if (catExpenses[t.category_id] > highestCategoryAmount) {
        highestCategoryAmount = catExpenses[t.category_id];
        highestCategoryId = t.category_id;
      }
    });

    const highestCategoryPercentage = totalExpense > 0 ? (highestCategoryAmount / totalExpense) * 100 : 0;
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

    // Fetch highest category name
    let highestCategoryName = 'Makan & Minum';
    if (highestCategoryId) {
      const catResult = await client.query('SELECT name FROM categories WHERE id = $1', [highestCategoryId]);
      if (catResult.rows.length > 0) {
        highestCategoryName = catResult.rows[0].name;
      }
    }

    const recommendations = [];

    if (highestCategoryPercentage > 40) {
      recommendations.push({
        title: 'Kurangi Pengeluaran Kategori Tertinggi',
        description: `Pengeluaran Anda untuk kategori ${highestCategoryName} mencakup ${highestCategoryPercentage.toFixed(1)}% dari total pengeluaran. Cobalah pangkas 20% untuk menghemat anggaran.`,
        type: 'spending_reduction',
        priority: 'high',
        potential_savings: highestCategoryAmount * 0.2,
        implementation_difficulty: 'medium'
      });
    }

    if (savingsRate < 10) {
      recommendations.push({
        title: 'Tingkatkan Rasio Menabung',
        description: `Tingkat menabung Anda saat ini adalah ${savingsRate.toFixed(1)}%. Targetkan minimal 20% pemasukan bulanan untuk tabungan atau investasi.`,
        type: 'savings_increase',
        priority: 'high',
        potential_savings: (monthlyIncome * 0.1) || 500000,
        implementation_difficulty: 'medium'
      });
    }

    if (monthlyExpense > monthlyIncome * 0.8) {
      recommendations.push({
        title: 'Optimalisasi Anggaran Bulanan',
        description: `Total pengeluaran rutin Anda mencapai ${(monthlyExpense / (monthlyIncome || 1) * 100).toFixed(0)}% dari pemasukan. Evaluasi kembali barang-barang non-kebutuhan.`,
        type: 'budget_optimization',
        priority: 'high',
        potential_savings: monthlyExpense * 0.15,
        implementation_difficulty: 'high'
      });
    }

    // Fallback if no specific condition met
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Pertahankan Pola Pengeluaran Sehat',
        description: 'Keuangan Anda relatif stabil. Pindahkan sebagian saldo mengendap Anda ke instrumen reksa dana atau deposito untuk bunga tinggi.',
        type: 'investment',
        priority: 'medium',
        potential_savings: 200000,
        implementation_difficulty: 'easy'
      });
    }

    const savedRecommendations = [];
    for (const rec of recommendations) {
      const dbRec = await client.query(
        `INSERT INTO recommendations (user_id, title, description, type, priority, potential_savings, implementation_difficulty, status, data, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [req.user.id, rec.title, rec.description, rec.type, rec.priority, rec.potential_savings, rec.implementation_difficulty, JSON.stringify(rec)]
      );
      savedRecommendations.push(dbRec.rows[0]);
    }

    await client.query('COMMIT');
    res.status(201).json({
      success: true,
      message: 'Rekomendasi berhasil dibuat',
      data: savedRecommendations
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: 'Gagal membuat rekomendasi: ' + error.message });
  } finally {
    client.release();
  }
});

// GET /recommendations/statistics
router.get('/recommendations/statistics', auth, async (req, res) => {
  try {
    const statsResult = await db.query(
      `SELECT 
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END), 0) as accepted,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END), 0) as completed,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN potential_savings ELSE 0 END), 0) as total_savings
       FROM recommendations
       WHERE user_id = $1`,
      [req.user.id]
    );

    const total = parseInt(statsResult.rows[0].total);
    const accepted = parseInt(statsResult.rows[0].accepted);
    const completed = parseInt(statsResult.rows[0].completed);
    const totalSavings = parseFloat(statsResult.rows[0].total_savings);

    res.json({
      success: true,
      message: 'Statistik rekomendasi berhasil diambil',
      data: {
        total_recommendations: total,
        accepted,
        completed,
        total_savings: totalSavings,
        completion_rate: total > 0 ? parseFloat(((completed / total) * 100).toFixed(2)) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /recommendations/:id
router.get('/recommendations/:id', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM recommendations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Rekomendasi tidak ditemukan.' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /recommendations/:id/status
router.put('/recommendations/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(422).json({ success: false, message: 'Status tidak valid.' });
    }

    const check = await db.query('SELECT id FROM recommendations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    const result = await db.query(
      `UPDATE recommendations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    res.json({ success: true, message: 'Status rekomendasi berhasil diperbarui', data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /recommendations/:id
router.delete('/recommendations/:id', auth, async (req, res) => {
  try {
    const check = await db.query('SELECT id FROM recommendations WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Akses ditolak.' });
    }

    await db.query('DELETE FROM recommendations WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Rekomendasi berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
