const db = require('./db');

async function syncSequences() {
  const tables = [
    'users',
    'categories',
    'transactions',
    'savings_goals',
    'chat_messages',
    'recommendations',
    'reminders'
  ];

  console.log('Starting sequence synchronization...');

  for (const table of tables) {
    try {
      // Get the current max ID
      const maxIdRes = await db.query(`SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}`);
      const maxId = parseInt(maxIdRes.rows[0].max_id);
      
      console.log(`Table "${table}": Current Max ID is ${maxId}`);

      if (maxId > 0) {
        // Reset the sequence to the current max ID
        // The next val returned will be maxId + 1
        const seqNameRes = await db.query(`SELECT pg_get_serial_sequence($1, 'id') as seq_name`, [table]);
        const seqName = seqNameRes.rows[0].seq_name;

        if (seqName) {
          await db.query(`SELECT setval($1, $2)`, [seqName, maxId]);
          console.log(`✅ Table "${table}": Successfully set sequence "${seqName}" to ${maxId}.`);
        } else {
          // If pg_get_serial_sequence returns null, try resetting by sequence name pattern
          const altSeqName = `${table}_id_seq`;
          await db.query(`SELECT setval($1, $2)`, [altSeqName, maxId]);
          console.log(`✅ Table "${table}": Successfully set sequence "${altSeqName}" to ${maxId} (fallback).`);
        }
      } else {
        // If table is empty, reset sequence to 1
        const seqNameRes = await db.query(`SELECT pg_get_serial_sequence($1, 'id') as seq_name`, [table]);
        const seqName = seqNameRes.rows[0].seq_name || `${table}_id_seq`;
        await db.query(`SELECT setval($1, 1, false)`, [seqName]);
        console.log(`ℹ️ Table "${table}": Empty table, reset sequence to 1.`);
      }
    } catch (err) {
      console.error(`❌ Table "${table}": Failed to sync sequence:`, err.message);
    }
  }

  console.log('Sequence synchronization completed.');
  process.exit();
}

syncSequences();
