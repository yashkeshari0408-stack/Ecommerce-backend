const { error } = require('../utils/response');

const errorMiddleware = (err, req, res, next) => {
  console.error(err);   // log for debugging

  return error(res, err.message || 'Server error', 500);
};

module.exports = errorMiddleware;