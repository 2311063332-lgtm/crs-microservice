import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { LoginResponse } from '../types/auth';

export interface AuthUser { id: number; username: string; role: 'ADMIN' | 'STUDENT'; }
interface AuthContextValue { user: AuthUser | null; token: string | null; login: (data: LoginResponse) => void; logout: () => void; }
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'crs_access_token';
const USER_KEY = 'crs_auth_user';

function readUser(): AuthUser | null { const raw = localStorage.getItem(USER_KEY); if (!raw) return null; try { return JSON.parse(raw) as AuthUser; } catch { localStorage.removeItem(USER_KEY); return null; } }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(readUser);
  const value = useMemo(() => ({ user, token, login: (data: LoginResponse) => { const nextUser = { id: data.userId, username: data.username, role: data.role }; localStorage.setItem(TOKEN_KEY, data.token); localStorage.setItem(USER_KEY, JSON.stringify(nextUser)); setToken(data.token); setUser(nextUser); }, logout: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); setToken(null); setUser(null); } }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider'); return context; }
