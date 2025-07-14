const { v4: uuidv4 } = require('uuid');

class UrlModel {
  constructor() {
    this.urls = new Map();
  }

  create(urlData) {
    const id = uuidv4();
    const shortcode = urlData.shortcode || this.generateShortcode();
    const now = new Date();
    const expiry = new Date(now.getTime() + (urlData.validity * 60 * 1000));

    const urlRecord = {
      id,
      shortcode,
      originalUrl: urlData.url,
      createdAt: now.toISOString(),
      expiry: expiry.toISOString(),
      clicks: 0,
      clickData: []
    };

    this.urls.set(shortcode, urlRecord);
    return urlRecord;
  }

  findByShortcode(shortcode) {
    return this.urls.get(shortcode);
  }

  exists(shortcode) {
    return this.urls.has(shortcode);
  }

  isExpired(urlRecord) {
    return new Date() > new Date(urlRecord.expiry);
  }

  addClick(shortcode, clickData) {
    const urlRecord = this.urls.get(shortcode);
    if (urlRecord) {
      urlRecord.clicks += 1;
      urlRecord.clickData.push(clickData);
      return urlRecord;
    }
    return null;
  }

  generateShortcode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    if (this.exists(result)) {
      return this.generateShortcode();
    }
    
    return result;
  }

  cleanup() {
    const now = new Date();
    for (const [shortcode, urlRecord] of this.urls.entries()) {
      if (new Date(urlRecord.expiry) < now) {
        this.urls.delete(shortcode);
      }
    }
  }
}

module.exports = new UrlModel();
