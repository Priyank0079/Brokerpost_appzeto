import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.success) {
        setUser(response.data);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const updateUser = (newData) => {
    setUser(newData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const register = async (userData) => {
    try {
      // Mocking registration for instant dashboard access as requested by user
      const mockUser = {
        _id: 'mock_id_' + Date.now(),
        name: userData.fullName,
        firstName: userData.fullName.split(' ')[0],
        email: userData.email,
        role: 'Broker',
        companyName: userData.companyName,
        operatingCity: userData.city,
        isVerified: true
      };
      
      localStorage.setItem('token', 'mock_token');
      setUser(mockUser);
      return { success: true, user: mockUser };
    } catch (err) {
      return { success: false, message: 'Registration failed' };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Invalid admin credentials' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, register, logout, adminLogin, loading, checkAuth, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
