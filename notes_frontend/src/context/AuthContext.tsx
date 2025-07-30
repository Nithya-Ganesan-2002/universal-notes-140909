"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import * as api from "../lib/api";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuth: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optionally fetch user info with token here
    const token = api.getAuthToken();
    if (token) setIsAuth(true);
    else setIsAuth(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const resp = await api.login(email, password);
      api.setAuthToken(resp.access_token);
      setIsAuth(true);
      setError(null);
      setUser(email);
    } catch (e) {
      const err = e as { error?: string };
      setError(err?.error || "Login failed.");
      setIsAuth(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const resp = await api.register(email, password);
      api.setAuthToken(resp.access_token);
      setIsAuth(true);
      setError(null);
      setUser(email);
    } catch (e) {
      const err = e as { error?: string };
      setError(err?.error || "Registration failed.");
      setIsAuth(false);
    }
  };

  const logout = () => {
    api.clearAuthToken();
    setIsAuth(false);
    setUser(null);
  };

  const clearError = () => setError(null);

  const value = { user, login, register, logout, isAuth, error, clearError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
