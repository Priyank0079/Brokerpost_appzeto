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

  const adminLogin = async (email, password) => {
    return await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, adminLogin, loading, checkAuth, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
