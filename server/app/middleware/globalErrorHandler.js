export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    status: err.status,
    message: err.message,
    validationErrors: err.errors || [],
  };

  res.status(statusCode).json(response);
};
