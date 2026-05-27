const { Pool } = require('pg');
require('dotenv').config();

console.log('DB URL:', process.env.DATABASE_URL);

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

    const users = await pool.query('SELECT id, name, email FROM users');
    console.log('Users count:', users.rows.length);
    console.log('Users list:', users.rows);
  } catch (err) {
    console.error('Database connection error:', err);
  } finally {
    await pool.end();
  }
}

test();
