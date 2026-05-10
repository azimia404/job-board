"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiLogin, apiRegister } from "@/shared/api/auth";

const TOKEN_KEY = "auth_token";
const EMAIL_KEY = "auth_email";

interface AuthUser {
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  register: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStored(): { user: AuthUser | null; token: string | null } {
  if (typeof window === "undefined") return { user: null, token: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  if (token && email) return { user: { email }, token };
  return { user: null, token: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const stored = loadStored();
  const [user, setUser] = useState<AuthUser | null>(stored.user);
  const [token, setToken] = useState<string | null>(stored.token);

  const persist = (t: string, email: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(EMAIL_KEY, email);
    setToken(t);
    setUser({ email });
  };

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await apiLogin(email, password);
    if (error || !data) return error;
    persist(data.token, data.email);
    return null;
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await apiRegister(email, password);
    if (error || !data) return error;
    persist(data.token, data.email);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
