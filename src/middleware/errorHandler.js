const logger = require('../services/logger');

function errorHandler(err, req, res, next) {
  // Log the error with full context
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    path: req.path,
    body: req.body,
    query: req.query,
    params: req.params,
    userId: req.session?.user?.id,
    username: req.session?.user?.username
  });

  // Send JSON error response
  res.status(err.status || 500).json({
    error: err.message || '[S-999] Beklenmeyen sunucu hatası',
    code: err.code || 'S-999',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
}

module.exports = errorHandler;
