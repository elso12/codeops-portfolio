import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'mesob_house_auth_user_v1';

const DEMO_USER = {
  id: 'user-demo-101',
  name: 'Abebe Bikila',
  email: 'abebe@addiseats.et',
  phone: '091 122 3344',
  address: 'Bole Atlas, Near Medhanialem Church, Addis Ababa',
  avatar: 'AB',
  memberSince: '2026'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authToast, setAuthToast] = useState('');

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync user session to localStorage', e);
    }
  }, [user]);

  const showToast = useCallback((message) => {
    setAuthToast(message);
    const timer = setTimeout(() => {
      setAuthToast('');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const openAuthModal = useCallback((tab = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback((email, _password) => {
    const loggedUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Habesha Guest',
      email,
      phone: '091 123 4567',
      address: 'Kazanchis, Addis Ababa',
      avatar: (email[0] || 'U').toUpperCase(),
      memberSince: '2026'
    };

    setUser(loggedUser);
    setIsAuthModalOpen(false);
    showToast(`Welcome back, ${loggedUser.name}! (እንኳን ደህና መጡ!)`);
    return { success: true };
  }, [showToast]);

  const loginDemoUser = useCallback(() => {
    setUser(DEMO_USER);
    setIsAuthModalOpen(false);
    showToast(`Signed in as Demo User: Abebe Bikila (እንኳን ደህና መጡ!)`);
    return { success: true };
  }, [showToast]);

  const register = useCallback((userData) => {
    const initials = userData.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'HU';

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '091 000 0000',
      address: userData.address || 'Bole, Addis Ababa',
      avatar: initials,
      memberSince: '2026'
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Account created successfully! Welcome to Addis Eats, ${newUser.name}.`);
    return { success: true };
  }, [showToast]);

  const logout = useCallback(() => {
    const userName = user?.name || 'User';
    setUser(null);
    showToast(`Signed out of ${userName}. See you soon!`);
  }, [user, showToast]);

  const value = useMemo(() => ({
    user,
    isAuthModalOpen,
    authTab,
    authToast,
    showToast,
    openAuthModal,
    closeAuthModal,
    setAuthTab,
    login,
    loginDemoUser,
    register,
    logout
  }), [
    user,
    isAuthModalOpen,
    authTab,
    authToast,
    showToast,
    openAuthModal,
    closeAuthModal,
    login,
    loginDemoUser,
    register,
    logout
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Guarded custom hook for AuthContext.
 * Throws a clear, informative error when consumed outside of AuthProvider.
 */
// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
