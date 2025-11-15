// services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  constructor(apiKey = null) {
    this.apiKey = apiKey || localStorage.getItem('trustgrid_api_key');
    this.baseURL = API_BASE_URL;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    if (apiKey) {
      localStorage.setItem('trustgrid_api_key', apiKey);
    }
  }

  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('trustgrid_api_key');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request:', { url, method: options.method || 'GET' });

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
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
        
        // If we get a 401, clear the stored API key as it's likely invalid
        if (response.status === 401) {
          this.clearApiKey();
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Network/API Error:', error);
      throw error;
    }
  }

  // Organization endpoints
  async registerOrganization(orgData) {
    return this.request('/api/v1/org/register', {
      method: 'POST',
      body: orgData,
    });
  }

  async loginOrganization(loginData) {
    if (loginData.api_key) {
      // API Key login
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };

      const body = new URLSearchParams();
      body.append('api_key', loginData.api_key);

      const response = await this.request('/api/v1/org/login-api-key', {
        method: 'POST',
        headers,
        body: body.toString(),
      });

      // Store the API key for future requests
      this.setApiKey(loginData.api_key);

      return response;
    } else {
      // Organization credentials login
      const response = await this.request('/api/v1/org/login', {
        method: 'POST',
        body: loginData,
      });

      // Store the API key from the response for future requests
      // The login endpoint returns an api_key field
      if (response.api_key) {
        this.setApiKey(response.api_key);
        console.log('API key stored for future requests');
      } else {
        console.warn('No API key returned from login response');
      }

      return response;
    }
  }

  async getOrganizationDetails() {
    return this.request('/api/v1/org/me');
  }

  async updateOrgPolicy(policyData) {
    return this.request('/api/v1/org/policy', {
      method: 'POST',
      body: policyData,
    });
  }

  async getComplianceLogs() {
    return this.request('/api/v1/org/log');
  }

  // API Key endpoints
  async getApiKeys() {
    return this.request('/api/v1/org/api-keys');
  }

  async createApiKey(name) {
    return this.request('/api/v1/org/api-keys', {
      method: 'POST',
      body: { name: name },
    });
  }

  async revokeApiKey(keyId) {
    return this.request(`/api/v1/org/api-keys/${keyId}/revoke`, {
      method: 'POST',
    });
  }

  // Data request endpoints
  async requestDataAccess(requestData) {
    return this.request('/api/v1/request-data', {
      method: 'POST',
      body: requestData,
    });
  }

  // Verification endpoints
  async submitVerification(formData) {
    const headers = {};
    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }
    // Don't set Content-Type for FormData - let browser set it with boundary
    
    const response = await fetch(`${this.baseURL}/api/v1/org/submit-for-verification`, {
      method: 'POST',
      headers,
      body: formData // Send FormData directly
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    return response.json();
  }

  // Citizen endpoints
  async registerCitizen(userData) {
    return this.request('/api/v1/citizen/register', {
      method: 'POST',
      body: userData,
    });
  }

  async loginCitizen(userData) {
    return this.request('/api/v1/citizen/login', {
      method: 'POST',
      body: userData,
    });
  }

  async getCitizenRequests(userId) {
    return this.request(`/api/v1/citizen/${userId}/requests`);
  }

  async respondToRequest(responseData) {
    return this.request('/api/v1/citizen/respond', {
      method: 'POST',
      body: responseData,
    });
  }

  async getCitizenLog(userId) {
    return this.request(`/api/v1/citizen/${userId}/log`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiService();
