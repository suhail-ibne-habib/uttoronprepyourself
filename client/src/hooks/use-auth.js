"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api, { getApiError } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/get-session");
      const nextUser = data?.user ?? null;
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async ({ email, password }) => {
      await api.post("/auth/sign-in/email", { email, password });
      const nextUser = await refresh();
      if (!nextUser) {
        throw new Error("Signed in, but no session was returned.");
      }
      return nextUser;
    },
    [refresh],
  );

  const signUp = useCallback(async ({ name, email, password }) => {
    await api.post("/auth/sign-up/email", { name, email, password });
  }, []);

  const signOut = useCallback(async () => {
    try {
      await api.post("/auth/sign-out");
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider
      value={{ user, loading, refresh, setUser, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function isAdmin(user) {
  if (!user?.role) return false;
  return String(user.role)
    .split(",")
    .map((role) => role.trim())
    .includes("admin");
}

export { getApiError };
