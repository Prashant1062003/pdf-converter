import api from './api';

// Login function
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('authToken', response.data.token); // Store token in localStorage
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Signup function
export const signup = async (details) => {
  try {
    const response = await api.post('/auth/signup', details);
    localStorage.setItem('authToken', response.data.token); // Store token in localStorage
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Signup failed');
  }
};

// Verify token function (checks if token is still valid)
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verifyToken');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Token verification failed');
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('authToken'); // Remove the token from localStorage
};
