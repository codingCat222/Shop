import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { mockUserProfiles } from '../mockData';

interface AuthContextType {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateUser: (updated: UserProfile) => void;
  switchRole: (role: 'buyer' | 'seller' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('tesm_active_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return mockUserProfiles.guest;
  });

  const login = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('tesm_active_profile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(mockUserProfiles.guest);
    localStorage.setItem('tesm_active_profile', JSON.stringify(mockUserProfiles.guest));
  };

  const updateUser = (updated: UserProfile) => {
    setUser(updated);
    localStorage.setItem('tesm_active_profile', JSON.stringify(updated));
  };

  const switchRole = (role: 'buyer' | 'seller' | 'admin') => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    localStorage.setItem('tesm_active_profile', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
