import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { initializeCsrf } from '../services/api';
import { authApi } from '../services/taskforge';
import type { User } from '../types';

type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => Promise<void> };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    void (async () => {
      try { await initializeCsrf(); const currentUser = await authApi.me(); if (active) setUser(currentUser); }
      catch { if (active) setUser(null); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    setUser(await authApi.login(email, password));
  }, []);
  const register = useCallback(async (name: string, email: string, password: string) => {
    setUser(await authApi.register(name, email, password));
  }, []);
  const logout = useCallback(async () => { await authApi.logout(); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
