// src/services/api.js
// Centralized API service for making HTTP requests
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dw_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear storage and redirect
      localStorage.removeItem('dw_token');
      localStorage.removeItem('dw_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/api/auth/signup', { name, email, password }),
  logout: () => api.post('/api/auth/logout'),
};

export const planService = {
  getAll: () => api.get('/api/plans'),
  getById: (id) => api.get(`/api/plans/${id}`),
  create: (planData) => api.post('/api/plans', planData),
  update: (id, planData) => api.put(`/api/plans/${id}`, planData),
  delete: (id) => api.delete(`/api/plans/${id}`),
};

export const templateService = {
  getAll: () => api.get('/api/templates'),
  getById: (id) => api.get(`/api/templates/${id}`),
};

export const aiService = {
  getSuggestions: (input) => api.post('/api/ai/suggest', { input }),
  getAnalytics: (userId) => api.get(`/api/ai/analytics/${userId}`),
  getOptimizations: (planId) => api.get(`/api/ai/optimizations/${planId}`),
};

export default api;

