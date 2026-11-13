import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartCorrupted, setIsCartCorrupted] = useState(false);

  const triggerCartCrash = useCallback(() => setIsCartCorrupted(true), []);
  const resetCartCrash = useCallback(() => setIsCartCorrupted(false), []);

  const addToCart = useCallback((dish) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (!existing) return prev;
      if (existing.qty > 1) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const itemCount  = useMemo(() => cart.reduce((s, i) => s + i.qty,          0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const value = useMemo(
    () => ({
      cart,
      itemCount,
      totalPrice,
      addToCart,
      removeFromCart,
      clearCart,
      isCartCorrupted,
      triggerCartCrash,
      resetCartCrash,
    }),
    [cart, itemCount, totalPrice, addToCart, removeFromCart, clearCart, isCartCorrupted, triggerCartCrash, resetCartCrash]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
