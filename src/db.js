// Database connection - Auto-detect PostgreSQL (Neon) or MySQL
const config = require('./config');
const logger = require('./services/logger');

// Check if PostgreSQL (Neon) should be used
const usePostgres = process.env.DATABASE_URL || 
                    process.env.VERCEL || 
                    (config.db?.host && config.db.host.includes('neon.tech'));

console.log('[DB] Initializing database', {
  usePostgres,
  hasDbUrl: !!process.env.DATABASE_URL,
  isVercel: !!process.env.VERCEL
});

let pool;

if (usePostgres) {
  // Use PostgreSQL
  console.log('[DB] Using PostgreSQL (Neon)');
  logger.info('Using PostgreSQL (Neon) database');
  
  const { Pool } = require('pg');
  
  const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?sslmode=require`;

  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    },
    max: process.env.VERCEL ? 1 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // MySQL-compatible execute function
  pool.execute = async function(sql, params = []) {
    let paramIndex = 1;
    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    const client = await this.connect();
    try {
      const result = await client.query(pgSql, params);
      client.release();
      return [result.rows, result.fields];
    } catch (err) {
      client.release();
      throw err;
    }
  };

  pool.on('connect', () => {
    console.log('[DB] PostgreSQL connected');
    logger.info('PostgreSQL connection established');
  });

  pool.on('error', (err) => {
    console.error('[DB] PostgreSQL error:', err.message);
    logger.error('PostgreSQL pool error', { error: err.message });
  });

} else {
  // Use MySQL
  console.log('[DB] Using MySQL');
  logger.info('Using MySQL database');
  
  const mysql = require('mysql2/promise');

  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: false
  });

  pool.getConnection()
    .then(connection => {
      console.log('[DB] MySQL connected');
      logger.info('MySQL connection pool successful');
      connection.release();
    })
    .catch(err => {
      console.error('[DB] MySQL error:', err.message);
      logger.error('MySQL connection error', { error: err.message });
    });
}

async function query(sql, params) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (err) {
    logger.error('Database query error', { error: err.message, sql: sql });
    throw err;
  }
}

console.log('[DB] Database module initialized, pool:', !!pool);

module.exports = {
  pool,
  query
};
