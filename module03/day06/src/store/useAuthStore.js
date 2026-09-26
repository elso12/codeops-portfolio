import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEMO_USER = {
  id: 'user-demo-101',
  name: 'Abebe Bikila',
  email: 'abebe@addiseats.et',
  phone: '091 122 3344',
  address: 'Bole Atlas, Near Medhanialem Church, Addis Ababa',
  avatar: 'AB',
  memberSince: '2026'
};

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthModalOpen: false,
      authTab: 'login', // 'login' | 'register'
      authToast: '',
      authToastTimer: null,

      showToast: (message) => {
        if (get().authToastTimer) clearTimeout(get().authToastTimer);
        set({ authToast: message });
        const timer = setTimeout(() => {
          set({ authToast: '', authToastTimer: null });
        }, 4000);
        set({ authToastTimer: timer });
      },

      openAuthModal: (tab = 'login') => {
        set({ authTab: tab, isAuthModalOpen: true });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false });
      },

      setAuthTab: (tab) => {
        set({ authTab: tab });
      },

      login: (email, _password) => {
        const loggedUser = {
          id: `user-${Date.now()}`,
          name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Habesha Guest',
          email,
          phone: '091 123 4567',
          address: 'Kazanchis, Addis Ababa',
          avatar: (email[0] || 'U').toUpperCase(),
          memberSince: '2026'
        };

        set({ user: loggedUser, isAuthModalOpen: false });
        get().showToast(`Welcome back, ${loggedUser.name}! (እንኳን ደህና መጡ!)`);
        return { success: true };
      },

      loginDemoUser: () => {
        set({ user: DEMO_USER, isAuthModalOpen: false });
        get().showToast(`Signed in as Demo User: Abebe Bikila (እንኳን ደህና መጡ!)`);
        return { success: true };
      },

      register: (userData) => {
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

        set({ user: newUser, isAuthModalOpen: false });
        get().showToast(`Account created successfully! Welcome to Addis Eats, ${newUser.name}.`);
        return { success: true };
      },

      logout: () => {
        const userName = get().user?.name || 'User';
        set({ user: null });
        get().showToast(`Signed out of ${userName}. See you soon!`);
      }
    }),
    {
      name: 'addis_eats_auth_store_v2',
      partialize: (state) => ({ user: state.user })
    }
  )
);
