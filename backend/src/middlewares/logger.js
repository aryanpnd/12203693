const axios = require('axios');
const config = require('../config/config');
const authService = require('../config/auth');

class Logger {
  static async Log(stack, level, packageName, message) {
    try {
      const token = await authService.getToken();

      const logData = {
        stack,
        level,
        package: packageName,
        message
      };

      await axios.post(config.loggingApiUrl, logData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
    } catch (error) {
      console.error('Logging service failed:', error.message);
      console.log(`[${level.toUpperCase()}] [${stack}] [${packageName}] ${message}`);
    }
  }
}

const loggingMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    Logger.Log(
      'backend',
      'info',
      'middleware',
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

module.exports = { Logger, loggingMiddleware };
