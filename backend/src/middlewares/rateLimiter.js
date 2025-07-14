const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

const shortUrlLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Too many URL shortening requests'
);

const redirectLimiter = createRateLimiter(
  1 * 60 * 1000, // 1 minute
  60, // 60 requests per minute
  'Too many redirect requests'
);

module.exports = { shortUrlLimiter, redirectLimiter };
