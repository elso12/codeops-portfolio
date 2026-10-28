import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'addis_eats_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData) => {
    const defaultUser = {
      name: userData?.name || 'Abebe Bikila',
      phone: userData?.phone || '+251911223344',
      area: userData?.area || 'Bole',
      signedInAt: new Date().toISOString(),
    };
    setUser(defaultUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(defaultUser));
    } catch (e) {
      console.warn('Failed saving user session', e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed removing user session', e);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
