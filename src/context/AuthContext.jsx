"use client";
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const users = JSON.parse(localStorage.getItem('cashtrack_users') || '[]');
    if (token && users.length > 0) {
       const currentUser = users.find(u => u.id === token);
       if (currentUser) setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const users = JSON.parse(localStorage.getItem('cashtrack_users') || '[]');
    const u = users.find(u => u.email === email && u.password === password);
    if (!u) {
       const error = new Error('Invalid credentials');
       error.response = { data: { msg: 'Invalid credentials' } };
       throw error;
    }
    localStorage.setItem('token', u.id);
    setUser(u);
  };

  const signup = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('cashtrack_users') || '[]');
    if (users.find(u => u.email === email)) {
       const error = new Error('User already exists');
       error.response = { data: { msg: 'User already exists' } };
       throw error;
    }
    const newUser = { id: Date.now().toString(), name, email, password };
    users.push(newUser);
    localStorage.setItem('cashtrack_users', JSON.stringify(users));
    localStorage.setItem('token', newUser.id);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
