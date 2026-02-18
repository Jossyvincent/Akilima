import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('api/auth/register', userData),
  login: (credentials) => api.post('api/auth/login', credentials),
  getMe: () => api.get('api/auth/me')
};

// Weather API
export const weatherAPI = {
  getWeather: () => api.get('api/weather'),
  getAdvisory: () => api.get('api/weather/advisory')
};

// Advisories API
export const advisoryAPI = {
  getAll: () => api.get('api/advisories'),
  getMyCrops: () => api.get('api/advisories/my-crops'),
  getCrop: (crop) => api.get(`api/advisories/${crop}`)
};

// Market Prices API
export const marketAPI = {
  getAll: () => api.get('api/market-prices'),
  getCrop: (crop) => api.get(`api/market-prices/${crop}`),
  getHistory: (crop) => api.get(`api/market-prices/${crop}/history`),
  addPrice: (priceData) => api.post('api/market-prices', priceData),
  deletePrice: (id) => api.delete(`api/market-prices/${id}`)
};

export default api;