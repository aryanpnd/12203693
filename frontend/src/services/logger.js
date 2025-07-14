import authService from './auth.js';

class Logger {
  constructor() {
    this.logURL = '/evaluation-service/logs';
  }

  async Log(stack, level, package_name, message) {
    try {
      const token = await authService.getToken();
      
      if (!token) {
        return;
      }

      const logData = {
        stack,
        level,
        package: package_name,
        message,
        timestamp: new Date().toISOString(),
      };

      await fetch(this.logURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(logData),
      });
    } catch (error) {
      // Silently fail to avoid console logs
    }
  }
}

const logger = new Logger();
export const Log = logger.Log.bind(logger);