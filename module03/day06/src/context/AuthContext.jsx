import React, { createContext, useContext } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const store = useAuthStore();

  return (
    <AuthContext.Provider value={store}>
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
