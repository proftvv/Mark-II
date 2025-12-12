const { sendError } = require('../utils/errorCodes');
const { isLocalIp, logAdminAction } = require('../utils/roleValidation');

function adminOnly(req, res, next) {
  if (!isLocalIp(req)) {
    logAdminAction(req, 'UNAUTHORIZED_IP_ACCESS', { 
      endpoint: req.path,
      method: req.method
    });
    return sendError(res, 'AUTHZ.IP_RESTRICTED');
  }
  return next();
}

module.exports = adminOnly;

