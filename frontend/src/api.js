const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://trust-grid.onrender.com';

class ApiClient {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', { url, method: options.method || 'GET', body: options.body });
    
    const headers = {
      ...options.headers,
    };

    // Only add Content-Type if not multipart/form-data
    if (!options.body || !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('API Response:', { status: response.status, url });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Details:', { status: response.status, statusText: response.statusText, body: errorText });
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        return response.text();
      }
    } catch (error) {
      console.error('Network/API Error:', error);
      throw error;
    }
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

  // Organization authentication
  async registerOrganization(orgName) {
    return this.request('/api/v1/org/register', {
      method: 'POST',
      body: JSON.stringify({ org_name: orgName }),
    });
  }

  async loginOrganization(apiKey) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    const body = new URLSearchParams();
    body.append('api_key', apiKey);
    
    return this.request('/api/v1/org/login', {
      method: 'POST',
      headers,
      body: body.toString(),
    });
  }

  async getOrganizationDetails() {
    return this.request('/api/v1/org/me');
  }

  // Organization verification and policy
  async submitForVerification(formData) {
    return this.request('/api/v1/org/submit-for-verification', {
      method: 'POST',
      body: formData,
    });
  }

  async updateOrgPolicy(policyText) {
    return this.request('/api/v1/org/policy', {
      method: 'POST',
      body: JSON.stringify({ policy_text: policyText }),
    });
  }

  // Data requests and compliance
  async requestDataAccess(userId, dataType, purpose) {
    return this.request('/api/v1/request-data', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, data_type: dataType, purpose }),
    });
  }

  async getOrgComplianceLog() {
    return this.request('/api/v1/org/log');
  }

  // Citizen API functions
  async registerCitizen(username, password) {
    return this.request('/api/v1/citizen/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async loginCitizen(username, password) {
    return this.request('/api/v1/citizen/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getPendingRequests(userId) {
    return this.request(`/api/v1/citizen/${userId}/requests`);
  }

  async respondToRequest(requestId, decision) {
    return this.request('/api/v1/citizen/respond', {
      method: 'POST',
      body: JSON.stringify({ request_id: requestId, decision }),
    });
  }

  async getCitizenTransparencyLog(userId) {
    return this.request(`/api/v1/citizen/${userId}/log`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiClient();

