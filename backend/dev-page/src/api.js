const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // API Key management
  async getApiKeys() {
    return this.request('/api/v1/org/api-keys');
  }

  async createApiKey(name) {
    return this.request('/api/v1/org/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async revokeApiKey(keyId) {
    return this.request(`/api/v1/org/api-keys/${keyId}/revoke`, {
      method: 'POST',
    });
  }
}

export default new ApiClient();
