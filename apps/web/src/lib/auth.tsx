'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginScreen } from '@/components/LoginScreen';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string, username: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const auth = localStorage.getItem('otto_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    // Fixed credentials for hackathon demo
    if (username === 'admin' && password === 'otto2026') {
      setIsAuthenticated(true);
      localStorage.setItem('otto_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('otto_auth');
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} />;
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
