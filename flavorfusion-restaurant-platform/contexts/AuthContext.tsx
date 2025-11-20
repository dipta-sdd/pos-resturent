


import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, Role } from '../types';
import { mockUsers, mockRoles } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  permissions: Role | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// FIX: Made children prop optional to fix type error in App.tsx
export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Role | null>(null);

  const login = (email: string, role: UserRole) => {
    // In a real app, you'd call an API. Here we find a mock user.
    const targetRole = mockRoles.find(r => r.name === role);
    if (!targetRole) {
        console.error("Role not found");
        return;
    }

    const mockUser = mockUsers.find(u => u.email === email && u.role_id === targetRole.id);
    if (mockUser) {
        setUser(mockUser);
        setPermissions(targetRole);
    } else {
        // Create a dummy user for demo purposes if not found
        const newUser: User = {
            id: Date.now(),
            email,
            firstName: 'Demo',
            lastName: 'User',
            role_id: targetRole.id,
            mobile: null,
            email_verified_at: new Date(),
            mobile_verified_at: null,
            remember_token: null,
            created_at: new Date(),
            updated_at: new Date(),
        };
        setUser(newUser);
        setPermissions(targetRole);
    }
  };

  const logout = () => {
    setUser(null);
    setPermissions(null);
  };

  const isAuthenticated = !!user;
  const role = permissions ? permissions.name as UserRole : null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, role, permissions, login, logout }}>
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