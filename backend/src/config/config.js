const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  baseUrl: process.env.BASE_URL || 'http://localhost:8000',
  loggingApiUrl: process.env.LOGGING_API_URL || 'http://20.244.56.144/evaluation-service/logs',
  authApiUrl: process.env.AUTH_API_URL || 'http://20.244.56.144/evaluation-service/auth',
  defaultValidityMinutes: parseInt(process.env.DEFAULT_VALIDITY_MINUTES) || 30
};