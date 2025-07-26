const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken(); // Get token properly
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }), // Add Bearer prefix
        ...options.headers,
      },
      ...options,
    };

    console.log('Making API request to:', url); // Debug log
    console.log('Token being sent:', token ? 'Present' : 'Missing'); // Debug log

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error:', data); // Debug log
        throw new Error(data.message || 'Something went wrong');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    return this.request('/auth/test');
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Dashboard endpoints (these require authentication)
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async getUserProfile() {
    return this.request('/dashboard/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/dashboard/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadProfileImage(formData) {
    return this.request('/dashboard/profile/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }
}

export default new ApiService();
