


'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  permissions: Role | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Made children prop optional to fix type error in App.tsx
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          if (userData.role) {
            setPermissions(userData.role);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.login({ email, password });
      localStorage.setItem('token', response.access_token);
      setUser(response.user);
      console.log(response.user);
      if (response.user.role) {
        setPermissions(response.user.role);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setPermissions(null);
    }
  };

  const isAuthenticated = !!user;
  const role = permissions ? permissions.name as UserRole : null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, permissions, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};