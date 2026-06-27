import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by hitting backend profile endpoint
          const response = await axiosInstance.get('/auth/profile');
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (err) {
          console.error('Session restore failed:', err.message);
          // axiosInstance interceptor handles 401, but we clean up here too
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to login. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to register. Please try again.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update Profile Name handler (immediate UI sync)
  const updateProfile = async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.put('/auth/profile', { name });
      const updatedUser = response.data;

      // Update in localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Immediate UI state update without reload
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
