import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'mesob_house_cart_v1';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [diningType, setDiningType] = useState('dine-in'); // 'dine-in' | 'delivery' | 'takeout'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [activeTrackId, setActiveTrackId] = useState('MESOB-8921');
  const [legalModalState, setLegalModalState] = useState({ open: false, type: 'privacy' });
  const [orderToast, setOrderToast] = useState(null);
  const [orders, setOrders] = useState([
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
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const showToast = (message) => {
    setOrderToast(message);
    setTimeout(() => {
      setOrderToast(null);
    }, 3200);
  };

  const addToCart = (dish, quantity = 1, note = '') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          note: note || updated[existingIndex].note
        };
        return updated;
      }
      return [...prevCart, { ...dish, quantity, note }];
    });
    showToast(`Added ${dish.nameEn} to your feast order!`);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalETB = cart.reduce((acc, item) => acc + item.priceETB * item.quantity, 0);
  const deliveryFee = diningType === 'delivery' ? 100 : 0;
  const grandTotalETB = subtotalETB + deliveryFee;

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    subtotalETB,
    deliveryFee,
    grandTotalETB,
    diningType,
    setDiningType,
    isCartOpen,
    setIsCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((prev) => !prev),
    activeDishModal,
    openDishModal: (dish) => setActiveDishModal(dish),
    closeDishModal: () => setActiveDishModal(null),
    isReservationOpen,
    setIsReservationOpen,
    openReservation: () => setIsReservationOpen(true),
    closeReservation: () => setIsReservationOpen(false),
    isTrackerOpen,
    setIsTrackerOpen,
    openTracker: (orderId) => {
      setIsTrackerOpen(true);
      if (orderId) setActiveTrackId(orderId);
    },
    closeTracker: () => setIsTrackerOpen(false),
    activeTrackId,
    setActiveTrackId,
    legalModalState,
    openLegal: (type = 'privacy') => setLegalModalState({ open: true, type }),
    closeLegal: () => setLegalModalState((prev) => ({ ...prev, open: false })),
    orders,
    addOrder: (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
      setActiveTrackId(newOrder.id);
    },
    orderToast,
    showToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Exercise 1: Guarded custom hook for CartContext.
 * Throws a clear, informative error when consumed outside of CartProvider.
 */
// oxlint-disable-next-line react/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
