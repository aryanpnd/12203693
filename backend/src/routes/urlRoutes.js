const express = require('express');

const UrlController = require('../controllers/UrlController');
const { 
  createUrlValidation, 
  shortcodeValidation, 
  handleValidationErrors 
} = require('../utils/validators');

const router = express.Router();

router.post('/shorturls', 
  createUrlValidation,
  handleValidationErrors,
  UrlController.createShortUrl
);

router.get('/shorturls/:shortcode', 
  shortcodeValidation,
  handleValidationErrors,
  UrlController.getStatistics
);

router.get('/:shortcode', 
  shortcodeValidation,
  handleValidationErrors,
  UrlController.redirect
);

module.exports = router;