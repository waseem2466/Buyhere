import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types.ts';
import { authService } from '../services/authService.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  loginAsDemoUser: () => Promise<User>;
  register: (name: string, email: string, pass: string) => Promise<User>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Check localStorage on mount to persist session
  useEffect(() => {
    const savedUser = localStorage.getItem('wr_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await authService.login(email, pass);
      setUser(user);
      localStorage.setItem('wr_user', JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      setUser(user);
      localStorage.setItem('wr_user', JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };
  
  const loginAsDemoUser = async () => {
    setLoading(true);
    try {
      const user = await authService.loginAsDemoUser();
      setUser(user);
      localStorage.setItem('wr_user', JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    setLoading(true);
    try {
      const user = await authService.register(name, email, pass);
      setUser(user);
      localStorage.setItem('wr_user', JSON.stringify(user));
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('wr_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      loginWithGoogle,
      loginAsDemoUser, 
      register, 
      logout,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};