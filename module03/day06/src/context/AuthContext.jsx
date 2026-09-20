import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'addis_eats_user_session';

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
      const savedUser = localStorage.getItem(STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (err) {
      console.error('Failed to parse saved user session:', err);
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authToast, setAuthToast] = useState('');

  const showToast = (message) => {
    setAuthToast(message);
    setTimeout(() => {
      setAuthToast('');
    }, 4000);
  };

  const openAuthModal = (tab = 'login') => {
    setAuthTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (email, _password) => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    closeAuthModal();
    showToast(`Welcome back, ${loggedUser.name}! (እንኳን ደህና መጡ!)`);
    return { success: true };
  };

  const loginDemoUser = () => {
    setUser(DEMO_USER);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    closeAuthModal();
    showToast(`Signed in as Demo User: Abebe Bikila (እንኳን ደህና መጡ!)`);
    return { success: true };
  };

  const register = (userData) => {
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    closeAuthModal();
    showToast(`Account created successfully! Welcome to Addis Eats, ${newUser.name}.`);
    return { success: true };
  };

  const logout = () => {
    const userName = user?.name || 'User';
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    showToast(`Signed out of ${userName}. See you soon!`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        authTab,
        authToast,
        openAuthModal,
        closeAuthModal,
        setAuthTab,
        login,
        loginDemoUser,
        register,
        logout
      }}
    >
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
