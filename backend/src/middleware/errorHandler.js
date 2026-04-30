/**
 * Centralized error handling middleware
 * Provides consistent error responses and logging
 */

const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  console.error('[ERROR]', {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    status: err.status || 500,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Extract error details
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send error response
  res.status(status).json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    }
  });
};

/**
 * Async error wrapper - catches errors in async route handlers
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
