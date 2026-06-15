/**
 * Global error handler middleware for Express.
 * Catches errors thrown or passed via next(error) in any route/middleware.
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Log the error for server-side debugging
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Only include stack trace in development
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

/**
 * Middleware to handle 404 — Route Not Found.
 * Place this AFTER all your route definitions.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export { errorHandler, notFound };
