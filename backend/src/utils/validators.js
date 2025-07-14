const { body, param, validationResult } = require('express-validator');

const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const validateShortcode = (shortcode) => {
    return /^[a-zA-Z0-9]{3,20}$/.test(shortcode);
};

const createUrlValidation = [
    body('url')
        .notEmpty()
        .withMessage('URL is required')
        .custom(validateUrl)
        .withMessage('Invalid URL format'),

    body('validity')
        .optional()
        .isInt({ min: 1, max: 10080 })
        .withMessage('Validity must be between 1 and 10080 minutes (1 week)'),

    body('shortcode')
        .optional()
        .custom(validateShortcode)
        .withMessage('Shortcode must be 3-20 characters long and contain only letters and numbers')
];

const shortcodeValidation = [
    param('shortcode')
        .notEmpty()
        .withMessage('Shortcode is required')
        .custom(validateShortcode)
        .withMessage('Invalid shortcode format')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

module.exports = {
    createUrlValidation,
    shortcodeValidation,
    handleValidationErrors
};