const UrlModel = require('../models/UrlModel');
const config = require('../config/config');
const { Logger } = require('../middlewares/logger');

class UrlService {
  async createShortUrl(urlData) {
    try {
      const { url, validity = config.defaultValidityMinutes, shortcode } = urlData;

      if (shortcode && UrlModel.exists(shortcode)) {
        await Logger.Log('backend', 'warn', 'service', `Shortcode collision: ${shortcode}`);
        throw new Error('Shortcode already exists');
      }

      const urlRecord = UrlModel.create({ url, validity, shortcode });
      
      await Logger.Log('backend', 'info', 'service', `Short URL created: ${urlRecord.shortcode}`);
      
      return {
        shortLink: `${config.baseUrl}/${urlRecord.shortcode}`,
        expiry: urlRecord.expiry
      };
    } catch (error) {
      await Logger.Log('backend', 'error', 'service', `Error creating short URL: ${error.message}`);
      throw error;
    }
  }

  async redirectToOriginal(shortcode, metadata) {
    try {
      const urlRecord = UrlModel.findByShortcode(shortcode);
      
      if (!urlRecord) {
        await Logger.Log('backend', 'warn', 'service', `Shortcode not found: ${shortcode}`);
        throw new Error('Shortcode not found or expired');
      }

      if (UrlModel.isExpired(urlRecord)) {
        await Logger.Log('backend', 'warn', 'service', `Expired shortcode accessed: ${shortcode}`);
        throw new Error('Shortcode not found or expired');
      }

      const clickData = {
        timestamp: new Date().toISOString(),
        referrer: metadata.referrer || 'direct',
        location: metadata.location || 'Unknown'
      };

      UrlModel.addClick(shortcode, clickData);
      
      await Logger.Log('backend', 'info', 'service', `Redirect: ${shortcode} -> ${urlRecord.originalUrl}`);
      
      return urlRecord.originalUrl;
    } catch (error) {
      await Logger.Log('backend', 'error', 'service', `Error redirecting: ${error.message}`);
      throw error;
    }
  }

  async getStatistics(shortcode) {
    try {
      const urlRecord = UrlModel.findByShortcode(shortcode);
      
      if (!urlRecord) {
        await Logger.Log('backend', 'warn', 'service', `Statistics requested for non-existent shortcode: ${shortcode}`);
        throw new Error('Shortcode not found');
      }

      await Logger.Log('backend', 'info', 'service', `Statistics retrieved for: ${shortcode}`);
      
      return {
        originalUrl: urlRecord.originalUrl,
        shortcode: urlRecord.shortcode,
        createdAt: urlRecord.createdAt,
        expiry: urlRecord.expiry,
        clicks: urlRecord.clicks,
        clickData: urlRecord.clickData
      };
    } catch (error) {
      await Logger.Log('backend', 'error', 'service', `Error getting statistics: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new UrlService();
