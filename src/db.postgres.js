// PostgreSQL connection for Neon/Vercel
const { Pool } = require('pg');
const logger = require('./services/logger');

// Neon connection string formatı:
// postgresql://user:password@host/database?sslmode=require
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  },
  max: process.env.VERCEL ? 1 : 10, // Serverless optimization
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.on('connect', () => {
  logger.info('PostgreSQL connection established');
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool error', { error: err.message });
});

// MySQL-compatible execute function wrapper for PostgreSQL
pool.execute = async function(sql, params = []) {
  // PostgreSQL uses $1, $2, etc. instead of ?
  // Convert ? to $1, $2, $3...
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  const client = await this.connect();
  try {
    const result = await client.query(pgSql, params);
    client.release();
    // Return in MySQL format: [rows, fields]
    return [result.rows, result.fields];
  } catch (err) {
    client.release();
    throw err;
  }
};

module.exports = { pool };
