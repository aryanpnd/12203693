const { Logger } = require('./logger');

const errorHandler = async (err, req, res, next) => {
  await Logger.Log('backend', 'error', 'middleware', `Unhandled error: ${err.message}`);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFoundHandler = async (req, res) => {
  await Logger.Log('backend', 'warn', 'middleware', `404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found' });
};

module.exports = { errorHandler, notFoundHandler };