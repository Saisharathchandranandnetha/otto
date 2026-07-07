'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

function LoginScreen({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(username, password)) {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-headline-md font-bold text-on-surface">
          Sign in to Otto
        </h2>
        <p className="mt-2 text-center text-body-md text-on-surface-variant">
          Autonomous Workflow Agents Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-surface-container py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-surface-container-highest">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-label-md font-medium text-on-surface">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-surface-container-highest px-3 py-2 text-on-surface placeholder-on-surface-variant shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-body-md bg-surface"
                />
              </div>
            </div>

            <div>
              <label className="block text-label-md font-medium text-on-surface">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-surface-container-highest px-3 py-2 text-on-surface placeholder-on-surface-variant shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-body-md bg-surface"
                />
              </div>
            </div>

            {error && (
              <p className="text-error text-body-sm text-center">
                Invalid credentials. Try admin / otto2026
              </p>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-label-md font-medium text-on-primary shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
