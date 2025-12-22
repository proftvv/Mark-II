// Run database migrations
const fs = require('fs');
const path = require('path');
const { pool } = require('../src/db');

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log('Found migrations:', files);

  for (const file of files) {
    console.log(`\nRunning migration: ${file}`);
    const sqlPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    // Split by semicolon and filter empty statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await pool.execute(statement);
        console.log(`  ✓ Executed statement`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`  ⊘ Column already exists, skipping`);
        } else if (err.code === 'ER_DUP_KEYNAME') {
          console.log(`  ⊘ Index already exists, skipping`);
        } else {
          console.error(`  ✗ Error:`, err.message);
          throw err;
        }
      }
    }
    console.log(`✓ Completed: ${file}`);
  }

  console.log('\n✅ All migrations completed!');
  await pool.end();
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
