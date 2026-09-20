import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [diningType, setDiningType] = useState('dine-in'); // 'dine-in' | 'delivery' | 'takeout'
  const [activeDishModal, setActiveDishModal] = useState(null);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [orderToast, setOrderToast] = useState(null);

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

  return (
    <CartContext.Provider
      value={{
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
        orderToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
