import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MOCK_ORDERS = [
  {
    id: 'MESOB-8921',
    customer: 'Abebe Bikila',
    items: ['Special Beyaynetu Combo (x2)', 'Traditional Doro Wat (x1)', 'Wild Honey Tej (x1 bottle)'],
    totalETB: 1850,
    diningType: 'delivery',
    address: 'Bole Olympia, House #402, Addis Ababa',
    placedAt: '25 mins ago',
    estimatedTime: '15 mins remaining',
    stepIndex: 2
  },
  {
    id: 'MESOB-7704',
    customer: 'Sarah Jenkins',
    items: ['Prime Beef Kitfo Special (x1)', 'Buna Ceremony Pot (x1)'],
    totalETB: 1120,
    diningType: 'dine-in',
    address: 'Mesob House - Table #8',
    placedAt: '10 mins ago',
    estimatedTime: '5 mins remaining',
    stepIndex: 1
  }
];

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      diningType: 'dine-in', // 'dine-in' | 'delivery' | 'takeout'
      isCartOpen: false,
      activeDishModal: null,
      isReservationOpen: false,
      isTrackerOpen: false,
      activeTrackId: 'MESOB-8921',
      legalModalState: { open: false, type: 'privacy' },
      orderToast: null,
      toastTimer: null,
      orders: MOCK_ORDERS,

      // Actions
      showToast: (message) => {
        if (get().toastTimer) clearTimeout(get().toastTimer);
        set({ orderToast: message });
        const timer = setTimeout(() => {
          set({ orderToast: null, toastTimer: null });
        }, 3500);
        set({ toastTimer: timer });
      },

      addToCart: (dish, quantity = 1, note = '') => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex((item) => item.id === dish.id);
        let newCart;

        if (existingIndex > -1) {
          newCart = [...currentCart];
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + quantity,
            note: note || newCart[existingIndex].note
          };
        } else {
          newCart = [...currentCart, { ...dish, quantity, note }];
        }

        set({ cart: newCart });
        get().showToast(`Added ${dish.nameEn} to your feast order!`);
      },

      updateQuantity: (id, delta) => {
        const newCart = get()
          .cart.map((item) => {
            if (item.id === id) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean);

        set({ cart: newCart });
      },

      removeFromCart: (id) => {
        set({ cart: get().cart.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ cart: [] });
      },

      setDiningType: (type) => set({ diningType: type }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      openDishModal: (dish) => set({ activeDishModal: dish }),
      closeDishModal: () => set({ activeDishModal: null }),

      setIsReservationOpen: (isOpen) => set({ isReservationOpen: isOpen }),
      openReservation: () => set({ isReservationOpen: true }),
      closeReservation: () => set({ isReservationOpen: false }),

      setIsTrackerOpen: (isOpen) => set({ isTrackerOpen: isOpen }),
      openTracker: (orderId) => set({ isTrackerOpen: true, activeTrackId: orderId || get().activeTrackId }),
      closeTracker: () => set({ isTrackerOpen: false }),
      setActiveTrackId: (id) => set({ activeTrackId: id }),

      openLegal: (type = 'privacy') => set({ legalModalState: { open: true, type } }),
      closeLegal: () => set((state) => ({ legalModalState: { ...(state.legalModalState || {}), open: false } })),

      addOrder: (newOrder) => {
        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeTrackId: newOrder.id
        }));
      }
    }),
    {
      name: 'mesob_house_cart_store_v2',
      partialize: (state) => ({ cart: state.cart, orders: state.orders, diningType: state.diningType })
    }
  )
);
