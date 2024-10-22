// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create the Auth Context
const AuthContext = createContext();

// Hook to use the Auth Context
export const useAuth = () => useContext(AuthContext);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on initial render
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios
        .get('/api/auth/verifyToken', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const { data } = await axios.post('/api/auth/login', credentials);
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Signup function
  const signup = async (details) => {
    try {
      const { data } = await axios.post('/api/auth/signup', details);
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      navigate('/home');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  // AuthContext value
  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
