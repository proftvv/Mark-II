const { sendError } = require('../utils/errorCodes');
const { isLocalIp, logAdminAction } = require('../utils/roleValidation');

function adminOnly(req, res, next) {
  // Skip IP check on Vercel - rely on authentication instead
  if (!process.env.VERCEL && !isLocalIp(req)) {
    logAdminAction(req, 'UNAUTHORIZED_IP_ACCESS', { 
      endpoint: req.path,
      method: req.method
    });
    return sendError(res, 'AUTHZ.IP_RESTRICTED');
  }
  return next();
}

module.exports = adminOnly;

