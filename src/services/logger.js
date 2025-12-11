const fs = require('fs');
const path = require('path');
const config = require('../config');

// Ensure logs directory exists
const LOG_DIR = path.join(__dirname, '../../logs');
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const LOG_FILE = path.join(LOG_DIR, 'app.log');

function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}\n`;

    // Console'a yaz
    if (level === 'error') {
        console.error(logEntry);
    } else {
        console.log(logEntry);
    }

    // Dosyaya yaz
    fs.appendFile(LOG_FILE, logEntry, (err) => {
        if (err) console.error('Log file write error:', err);
    });
}

module.exports = {
    info: (msg, meta) => log('info', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta)
};
