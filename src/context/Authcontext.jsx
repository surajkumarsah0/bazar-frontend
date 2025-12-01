import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, fetchUserProfile } from '../../src/utils/authHelpers';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load profile on first render
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) loadUser();
    else setLoading(false);
  }, []);

  const loadUser = async () => {
    try {
      const data = await fetchUserProfile();
      setUser(data);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, role = 'customer') => {
    const data = await registerUser(name, email, password, role);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
