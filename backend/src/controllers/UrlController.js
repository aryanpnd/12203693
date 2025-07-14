const UrlService = require('../services/UrlService');
const { Logger } = require('../middlewares/logger');

class UrlController {
    async createShortUrl(req, res) {
        try {
            const result = await UrlService.createShortUrl(req.body);
            res.status(201).json(result);
        } catch (error) {
            await Logger.Log('backend', 'error', 'controller', `Create URL error: ${error.message}`);

            if (error.message === 'Shortcode already exists') {
                return res.status(409).json({ error: error.message });
            }

            res.status(400).json({ error: error.message });
        }
    }

    async redirect(req, res) {
        try {
            const { shortcode } = req.params;
            const metadata = {
                referrer: req.get('Referer'),
                location: 'India'
            };

            const originalUrl = await UrlService.redirectToOriginal(shortcode, metadata);
            res.redirect(302, originalUrl);
        } catch (error) {
            await Logger.Log('backend', 'error', 'controller', `Redirect error: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }

    async getStatistics(req, res) {
        try {
            const { shortcode } = req.params;
            const stats = await UrlService.getStatistics(shortcode);
            res.json(stats);
        } catch (error) {
            await Logger.Log('backend', 'error', 'controller', `Statistics error: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }
}

module.exports = new UrlController();
