const app = require('./app');
const config = require('./config/config');
const { Logger } = require('./middlewares/logger');
const UrlModel = require('./models/UrlModel');

const server = app.listen(config.port, async () => {
  await Logger.Log('backend', 'info', 'server', `Server started on port ${config.port}`);
  console.log(`🚀 URL Shortener Service running on port ${config.port}`);
  console.log(`📋 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Base URL: ${config.baseUrl}`);
});

setInterval(() => {
  UrlModel.cleanup();
}, 60 * 60 * 1000);

process.on('SIGTERM', async () => {
  await Logger.Log('backend', 'info', 'server', 'Server shutting down...');
  server.close(() => {
    console.log('💤 Server shut down gracefully');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  await Logger.Log('backend', 'info', 'server', 'Server interrupted');
  server.close(() => {
    console.log('💤 Server shut down gracefully');
    process.exit(0);
  });
});

