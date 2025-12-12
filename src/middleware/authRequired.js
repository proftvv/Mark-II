const { sendError } = require('../utils/errorCodes');

function authRequired(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return sendError(res, 'AUTH.NO_SESSION');
}

module.exports = authRequired;

