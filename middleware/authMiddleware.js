const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // no header
    if (!authHeader) {
      return error(res, 'No token provided', 401);
    }

    // wrong format
    if (!authHeader.startsWith('Bearer ')) {
     return error(res, 'Invalid token format', 401);
    }

    const token = authHeader.split(' ')[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();

  } catch (err) {
    return error(res, 'Invalid or expired token', 401);

  }
};

module.exports = authMiddleware;