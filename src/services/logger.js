const fs = require('fs');
const path = require('path');

// Vercel serverless: only use /tmp for logs (ephemeral)
const LOG_DIR = process.env.VERCEL ? '/tmp/logs' : path.join(__dirname, '../../logs');
let LOG_FILE = null;

// Only create log directory if not on Vercel or use /tmp
try {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    LOG_FILE = path.join(LOG_DIR, 'app.log');
} catch (err) {
    // If mkdir fails (read-only filesystem), just use console
    console.warn('Cannot create log directory, using console only:', err.message);
}

function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}\n`;

    // Console'a yaz (always)
    if (level === 'error') {
        console.error(logEntry);
    } else {
        console.log(logEntry);
    }

    // Dosyaya yaz (only if LOG_FILE is available)
    if (LOG_FILE) {
        fs.appendFile(LOG_FILE, logEntry, (err) => {
            if (err) console.error('Log file write error:', err);
        });
    }
}

module.exports = {
    info: (msg, meta) => log('info', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta)
};
