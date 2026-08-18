const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Set it in .env before running this check.');
  process.exit(1);
}

console.log('DB URL: configured');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connection successful! Database time:', res.rows[0].now);
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in database:', tables.rows.map(r => r.table_name));

    const users = await pool.query('SELECT COUNT(*)::int as count FROM users');
    console.log('Users count:', users.rows[0].count);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end();
  }
}

test();
