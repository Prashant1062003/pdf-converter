import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // All API requests will use this baseURL; proxy will forward it to the backend.
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to inject the token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
