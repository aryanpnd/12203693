const axios = require('axios');
const config = require('./config');

class AuthService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async authenticate(credentials) {
    try {
      const response = await axios.post(config.authApiUrl, credentials);
      this.token = response.data.token;
      this.tokenExpiry = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours
      return this.token;
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }

  async getToken() {
    if (!this.token || (this.tokenExpiry && new Date() > this.tokenExpiry)) {
      const credentials = {
        email: "your-email@example.com",
        password: "your-password"
      };
      await this.authenticate(credentials);
    }
    return this.token;
  }

  isAuthenticated() {
    return this.token && (!this.tokenExpiry || new Date() < this.tokenExpiry);
  }
}

module.exports = new AuthService();
