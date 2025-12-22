// Quick migration runner for role column
const mysql = require('mysql2/promise');
require('dotenv').config();

async function addRoleColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'report_mark2'
  });

  try {
    console.log('Connected to database');

    // Add role column
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' NOT NULL
        AFTER password_hash
      `);
      console.log('✓ Added role column');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('⊘ Role column already exists');
      } else {
        throw err;
      }
    }

    // Update proftvv to admin
    const [result] = await connection.execute(`
      UPDATE users SET role = 'admin' WHERE username = 'proftvv'
    `);
    console.log(`✓ Updated ${result.affectedRows} user(s) to admin`);

    // Show current users
    const [users] = await connection.execute(`
      SELECT id, username, custom_id, role, created_at FROM users
    `);
    console.log('\nCurrent users:');
    console.table(users);

  } finally {
    await connection.end();
  }
}

addRoleColumn()
  .then(() => {
    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  });
