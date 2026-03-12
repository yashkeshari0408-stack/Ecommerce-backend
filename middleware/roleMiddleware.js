const { error } = require('../utils/response');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      // auth middleware missing or token invalid
      if (!userRole) {
        return error(res, 'Unauthorized', 401);
      }

      // role not permitted
      if (!allowedRoles.includes(userRole)) {
        return error(res, 'Access denied: insufficient permissions', 403);
      }

      next();

    } catch (err) {
      return error(res, 'Authorization error', 500);
    }
  };
};

module.exports = roleMiddleware;