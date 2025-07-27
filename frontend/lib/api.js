const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('Making API request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('API Error Response:', data);
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      
      // Provide more specific error messages
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Make sure backend is running on port 5000.');
      }
      
      throw error;
    }
  }

  // ==================== AUTH ENDPOINTS ====================
  async login(credentials) {
    console.log('Login request:', credentials);
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
    return Promise.resolve({ success: true });
  }

  // ==================== REGISTRATION ENDPOINTS ====================
async getRegistrationDropdownData() {
  try {
    console.log('Fetching registration dropdown data...');
    const response = await this.request('/registration/dropdown-data');
    
    // Ensure we always return the expected structure
    return {
      success: response.success || false,
      data: {
        states: response.data?.states || [],
        cities: response.data?.cities || [],
        departments: response.data?.departments || [],
        qualifications: response.data?.qualifications || []
      }
    };
  } catch (error) {
    console.error('Failed to fetch dropdown data:', error);
    
    // Return safe fallback structure
    return {
      success: false,
      data: {
        states: [],
        cities: [],
        departments: [],
        qualifications: []
      },
      error: error.message
    };
  }
}

  async getCitiesByState(stateId) {
    console.log('Fetching cities for state:', stateId);
    return this.request(`/registration/cities/${stateId}`);
  }

  async checkEmailAvailability(email) {
    console.log('Checking email availability:', email);
    return this.request('/registration/check-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async registerUser(userData) {
    console.log('Registration request:', userData);
    return this.request('/registration/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getRegistrationStats() {
    return this.request('/registration/stats');
  }

  // ==================== DASHBOARD ENDPOINTS ====================
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
    // Note: For file uploads, we don't set Content-Type header
    const token = this.getToken();
    const url = `${this.baseURL}/dashboard/profile/image`;
    
    console.log('Uploading profile image to:', url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it automatically
        },
        body: formData, // FormData object
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'File upload failed');
      }
      
      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // ==================== USER MANAGEMENT ENDPOINTS ====================
  async getAllUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = `/dashboard/users${queryParams ? `?${queryParams}` : ''}`;
    return this.request(endpoint);
  }

  async getUserById(userId) {
    return this.request(`/dashboard/users/${userId}`);
  }

  async updateUser(userId, userData) {
    return this.request(`/dashboard/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/dashboard/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ==================== MASTER DATA ENDPOINTS ====================
  async getStates() {
    return this.request('/master/states');
  }

  async getCitiesByStateId(stateId) {
    return this.request(`/master/cities/${stateId}`);
  }

  async getDepartments() {
    return this.request('/master/departments');
  }

  async getQualifications() {
    return this.request('/master/qualifications');
  }

  // ==================== REPORTS ENDPOINTS ====================
  async getDailyReport(date) {
    return this.request(`/reports/daily?date=${date}`);
  }

  async getRegistrationReport(startDate, endDate) {
    return this.request(`/reports/registration?startDate=${startDate}&endDate=${endDate}`);
  }

  async getMasterReport(type) {
    return this.request(`/reports/master?type=${type}`);
  }

  // ==================== UTILITY METHODS ====================
  async testConnection() {
    return this.request('/auth/test');
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Server is not responding');
    }
  }

  async databaseHealthCheck() {
    try {
      const response = await fetch(`${this.baseURL.replace('/api', '')}/api/health/db`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Database health check failed:', error);
      throw new Error('Database connection failed');
    }
  }

  // ==================== AUTHENTICATION HELPERS ====================
  isAuthenticated() {
    return !!this.getToken();
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  getCurrentUserRole() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role');
    }
    return null;
  }

  // ==================== ERROR HANDLING HELPERS ====================
  handleAuthError() {
    // Clear invalid tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
    
    // Redirect to login (you might want to handle this in your components)
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
}

export default new ApiService();
