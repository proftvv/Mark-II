// Vercel-specific configuration for serverless
const path = require('path');
require('dotenv').config();

function env(key, fallback) {
  return process.env[key] || fallback;
}

const config = {
  port: Number(env('APP_PORT', 3000)),
  host: env('APP_HOST', '0.0.0.0'),
  sessionSecret: env('SESSION_SECRET', 'change-me-in-production'),
  
  // Vercel deployment: use /tmp for temporary storage
  storageRoot: process.env.VERCEL 
    ? '/tmp/raporlar' 
    : env('STORAGE_ROOT', 'Z:\\\\MARK-II\\\\raporlar'),
  
  adminIps: env('ADMIN_IPS', '127.0.0.1,::1')
    .split(',')
    .map(ip => ip.trim())
    .filter(Boolean),
  
  docPrefix: env('DOC_PREFIX', 'P'),
  
  db: {
    host: env('DB_HOST', 'localhost'),
    port: Number(env('DB_PORT', 3306)),
    user: env('DB_USER', 'root'),
    password: env('DB_PASSWORD', ''),
    database: env('DB_NAME', 'report_mark2'),
    // Vercel serverless optimization
    connectionLimit: process.env.VERCEL ? 1 : 10,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 10000
  },
  
  // Storage type: 'local' | 'vercel-blob' | 's3'
  storageType: env('STORAGE_TYPE', 'local'),
  
  // Vercel Blob Storage config
  blobToken: env('BLOB_READ_WRITE_TOKEN', ''),
  
  // AWS S3 config (alternative)
  s3: {
    accessKeyId: env('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY', ''),
    region: env('AWS_REGION', 'us-east-1'),
    bucket: env('AWS_S3_BUCKET', '')
  }
};

// Setup paths
config.paths = {
  templates: path.join(config.storageRoot, 'templates'),
  generated: path.join(config.storageRoot, 'generated'),
  uploads: path.join(config.storageRoot, 'uploads')
};

module.exports = config;
