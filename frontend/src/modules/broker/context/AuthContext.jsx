import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const isAdminApp = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
  const tokenKey = isAdminApp ? 'admin_token' : 'token';
  const userKey = isAdminApp ? 'admin_user' : 'user';

  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem(userKey);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem(tokenKey);
    
    if (!token) {
      setUser(null);
      localStorage.removeItem(userKey);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/auth/me');
      if (response.success) {
        setUser(response.data);
        localStorage.setItem(userKey, JSON.stringify(response.data));
      } else {
        // Only log out if it's an auth error, not a random server 500
        const msg = (response.message || '').toLowerCase();
        if (msg.includes('authorized') || msg.includes('expired') || msg.includes('invalid') || msg.includes('token') || msg.includes('found') || msg.includes('blocked')) {
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(userKey);
          setUser(null);
        }
      }
    } catch (err) {
      // Network error or server down, don't remove token/user, just keep cached state
      console.error("Auth check failed due to network error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleAuthError = () => {
      logout();
    };

    window.addEventListener('auth-error', handleAuthError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success) {
        localStorage.setItem('token', response.token); // Broker login always sets normal token
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const sendLoginOTP = async (email) => {
    try {
      const response = await api.post('/auth/login/send-otp', { email });
      return response;
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const loginWithOTP = async (email, otp) => {
    try {
      const response = await api.post('/auth/login/verify-otp', { email, otp });
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'OTP verification failed' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const verifyOTP = async (email, otp, password) => {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp, password });
      if (response.success) {
        localStorage.setItem('token', response.token);
        // Note: verify-otp might not return user data in response, let checkAuth handle it or update manually
        await checkAuth(); 
        return { success: true };
      }
      return { success: false, message: response.message || 'OTP verification failed' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  const updateUser = (newData) => {
    setUser(newData);
    localStorage.setItem(userKey, JSON.stringify(newData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem('registration_draft');
  };

  const adminLogin = async (email, password) => {
    try {
      const response = await api.post('/auth/admin/login', { email, password });
      if (response.success) {
        localStorage.setItem('admin_token', response.token); // Admin login always sets admin_token
        localStorage.setItem('admin_user', JSON.stringify(response.data));
        setUser(response.data);
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Invalid admin credentials' };
    } catch (err) {
      return { success: false, message: 'Server connection failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, sendLoginOTP, loginWithOTP, register, verifyOTP, logout, adminLogin, loading, checkAuth, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
