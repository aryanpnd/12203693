import axios from 'axios';
import { Log } from './logger.js';

const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        Log('frontend', 'info', 'api', `Making ${config.method.toUpperCase()} request to ${config.url}`);
        return config;
      },
      (error) => {
        Log('frontend', 'error', 'api', `Request error: ${error.message}`);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        Log('frontend', 'info', 'api', `Successful response from ${response.config.url}`);
        return response;
      },
      (error) => {
        Log('frontend', 'error', 'api', `Response error: ${error.message}`);
        return Promise.reject(error);
      }
    );
  }

  async createShortUrl(urlData) {
    try {
      const response = await this.client.post('/shorturls', urlData);
      Log('frontend', 'info', 'api', 'Short URL created successfully');
      return response.data;
    } catch (error) {
      Log('frontend', 'error', 'api', `Failed to create short URL: ${error.message}`);
      throw error;
    }
  }

  async getUrlStats(shortcode) {
    try {
      const response = await this.client.get(`/shorturls/${shortcode}`);
      Log('frontend', 'info', 'api', `Retrieved stats for shortcode: ${shortcode}`);
      return response.data;
    } catch (error) {
      Log('frontend', 'error', 'api', `Failed to get stats for ${shortcode}: ${error.message}`);
      throw error;
    }
  }
}

export default new ApiService();