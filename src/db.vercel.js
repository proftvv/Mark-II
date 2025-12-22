// Database connection for Vercel serverless
const mysql = require('mysql2/promise');
const config = require('./config.vercel');
const logger = require('./services/logger');

let pool;

function createPool() {
  if (pool) {
    return pool;
  }

  logger.info('Creating database connection pool', {
    host: config.db.host,
    database: config.db.database,
    connectionLimit: config.db.connectionLimit,
    isVercel: !!process.env.VERCEL
  });

  pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: config.db.connectionLimit,
    connectTimeout: config.db.connectTimeout,
    acquireTimeout: config.db.acquireTimeout,
    timeout: config.db.timeout,
    // Vercel serverless optimization
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });

  // Test connection on startup (non-blocking)
  pool.getConnection()
    .then((conn) => {
      logger.info('Database connection pool established');
      conn.release();
    })
    .catch((err) => {
      logger.error('Database connection pool error', {
        error: err.message,
        code: err.code
      });
    });

  return pool;
}

// Export pool instance
module.exports = {
  pool: createPool(),
  createPool
};
