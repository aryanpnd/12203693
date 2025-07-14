const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/config');
const { loggingMiddleware } = require('./middlewares/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const { shortUrlLimiter, redirectLimiter } = require('./middlewares/rateLimiter');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined'));
app.use(loggingMiddleware);

app.use('/shorturls', shortUrlLimiter);
app.use('/:shortcode', redirectLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

app.use('/', urlRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
