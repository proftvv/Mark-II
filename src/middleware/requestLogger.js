const logger = require('../services/logger');

function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    hasSession: !!req.session?.user,
    userId: req.session?.user?.id,
    username: req.session?.user?.username
  });

  // Capture response
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    
    // Log response
    logger.info('Outgoing response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentType: res.get('content-type'),
      userId: req.session?.user?.id
    });

    originalSend.apply(res, arguments);
  };

  next();
}

module.exports = requestLogger;
