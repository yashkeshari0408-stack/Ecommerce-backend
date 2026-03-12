exports.success = (res, data, message = 'Success', code = 200) => {
  res.status(code).json({
    success: true,
    message,
    data,
  });
};

exports.error = (res, message = 'Error', code = 400) => {
  res.status(code).json({
    success: false,
    message,
  });
};


