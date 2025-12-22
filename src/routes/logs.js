const express = require('express');
const fs = require('fs');
const path = require('path');
const logger = require('../services/logger');
const { adminOnly } = require('./auth');

const router = express.Router();

const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Parse log line
function parseLogLine(line) {
  // Format: [2025-12-22T12:23:00.889Z] [INFO] Server started successfully {"host":"0.0.0.0","port":3000}
  const match = line.match(/^\[([^\]]+)\] \[([^\]]+)\] (.+?)( \{.*\})?$/);
  if (!match) return null;

  const [, timestamp, level, message, metaStr] = match;
  let meta = {};
  
  try {
    if (metaStr && metaStr.trim()) {
      meta = JSON.parse(metaStr.trim());
    }
  } catch (e) {
    // If meta parsing fails, just ignore it
  }

  return {
    timestamp,
    level: level.toLowerCase(),
    message,
    meta
  };
}

// Get logs with filtering (admin only)
router.get('/', adminOnly, async (req, res) => {
  try {
    const { level, search, startDate, endDate, limit = 1000 } = req.query;

    // Check if log file exists
    if (!fs.existsSync(LOG_FILE)) {
      return res.json({ logs: [], total: 0 });
    }

    // Read log file
    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());

    // Parse and filter logs
    let logs = lines
      .map(parseLogLine)
      .filter(log => log !== null)
      .reverse(); // Most recent first

    // Apply filters
    if (level) {
      logs = logs.filter(log => log.level === level.toLowerCase());
    }

    if (search) {
      const searchLower = search.toLowerCase();
      logs = logs.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        JSON.stringify(log.meta).toLowerCase().includes(searchLower)
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      logs = logs.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      logs = logs.filter(log => new Date(log.timestamp) <= end);
    }

    // Apply limit
    const total = logs.length;
    logs = logs.slice(0, parseInt(limit));

    logger.info('Logs fetched', { 
      total, 
      returned: logs.length, 
      filters: { level, search, startDate, endDate, limit },
      requestedBy: req.session.user.username 
    });

    return res.json({ 
      logs, 
      total,
      returned: logs.length 
    });
  } catch (err) {
    logger.error('Error fetching logs', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[LOG-001] Loglar yüklenemedi: ${err.message}` });
  }
});

// Get log statistics (admin only)
router.get('/stats', adminOnly, async (req, res) => {
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return res.json({ 
        total: 0, 
        byLevel: { info: 0, warn: 0, error: 0 },
        fileSize: 0
      });
    }

    const content = fs.readFileSync(LOG_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim());
    const logs = lines.map(parseLogLine).filter(log => log !== null);

    const stats = {
      total: logs.length,
      byLevel: {
        info: logs.filter(l => l.level === 'info').length,
        warn: logs.filter(l => l.level === 'warn').length,
        error: logs.filter(l => l.level === 'error').length
      },
      fileSize: fs.statSync(LOG_FILE).size,
      oldestLog: logs.length > 0 ? logs[logs.length - 1].timestamp : null,
      newestLog: logs.length > 0 ? logs[0].timestamp : null
    };

    return res.json(stats);
  } catch (err) {
    logger.error('Error fetching log stats', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[LOG-002] İstatistikler yüklenemedi: ${err.message}` });
  }
});

// Clear logs (admin only) - DANGEROUS
router.delete('/clear', adminOnly, async (req, res) => {
  try {
    if (fs.existsSync(LOG_FILE)) {
      // Backup current logs before clearing
      const backupFile = path.join(LOG_DIR, `app.log.backup.${Date.now()}`);
      fs.copyFileSync(LOG_FILE, backupFile);
      
      // Clear the file
      fs.writeFileSync(LOG_FILE, '');
      
      logger.warn('Logs cleared', { 
        backupFile,
        clearedBy: req.session.user.username 
      });

      return res.json({ 
        success: true, 
        message: 'Loglar temizlendi',
        backup: backupFile 
      });
    } else {
      return res.json({ 
        success: true, 
        message: 'Log dosyası zaten boş' 
      });
    }
  } catch (err) {
    logger.error('Error clearing logs', { error: err.message, stack: err.stack });
    return res.status(500).json({ error: `[LOG-003] Loglar temizlenemedi: ${err.message}` });
  }
});

module.exports = router;
