const db = require('./db');

async function run() {
  try {
    console.log('Altering users table to add Telegram columns...');
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS telegram_id VARCHAR(50) UNIQUE,
      ADD COLUMN IF NOT EXISTS telegram_pairing_code VARCHAR(20) UNIQUE
    `);
    console.log('Columns added successfully!');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    process.exit();
  }
}

run();
