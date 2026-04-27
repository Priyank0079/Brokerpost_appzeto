import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('broker_session');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Auto-update legacy admin name if found in existing session
      if (parsedUser.name === 'System Admin') {
        parsedUser.name = 'Amit Sharma';
        parsedUser.role = 'Verified Broker';
        parsedUser.avatar = 'https://i.pravatar.cc/150?u=amit';
        localStorage.setItem('broker_session', JSON.stringify(parsedUser));
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = (mobile, otp) => {
    // Specific dummy credentials as requested
    if (mobile === '9111966732' && otp === '1234') {
      const userData = {
        name: 'Amit Sharma',
        mobile: mobile,
        email: 'amit@brokerspost.com',
        avatar: 'https://i.pravatar.cc/150?u=amit',
        role: 'Verified Broker',
        id: 'BPS-AMIT-2026',
        status: 'Active'
      };
      setUser(userData);
      localStorage.setItem('broker_session', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: 'Invalid Mobile or OTP' };
  };

  const register = (formData) => {
    // Simulate registration
    const userData = {
      ...formData,
      status: 'Pending Approval',
      avatar: 'https://i.pravatar.cc/150?u=new',
      role: 'New Broker'
    };
    // For now we just log them in after registration but with pending status
    setUser(userData);
    localStorage.setItem('broker_session', JSON.stringify(userData));
    return { success: true };
  };

  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('broker_session', JSON.stringify(updatedUser));
    return { success: true };
  };

  const adminLogin = (email, password) => {
    if (email === 'admin@gmail.com' && password === '123456') {
      const adminData = {
        name: 'Amit Sharma',
        mobile: '9111966732',
        email: email,
        avatar: 'https://i.pravatar.cc/150?u=amit',
        role: 'Administrator',
        id: 'ADMIN-SYS-2026',
        status: 'Active'
      };
      setUser(adminData);
      localStorage.setItem('broker_session', JSON.stringify(adminData));
      return { success: true };
    }
    return { success: false, message: 'Invalid Admin Credentials' };
  };


  const logout = () => {

    setUser(null);
    localStorage.removeItem('broker_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, logout, register, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
