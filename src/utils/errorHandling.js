export const asyncHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

export const globalErrorHandling = (error, req, res, next) =>
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message,
    ...(process.env.STATUS == "DEV" && { stack: error.stack }),
  });
