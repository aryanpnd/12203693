class AuthService {
  constructor() {
    this.baseURL = '/evaluation-service';
    this.token = null;
  }

  async getToken() {
    if (this.token) {
      return this.token;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Add your credentials here if needed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        return this.token;
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }

    return null;
  }
}

export default new AuthService();