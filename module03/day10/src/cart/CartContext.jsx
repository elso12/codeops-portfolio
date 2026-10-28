import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'addis_eats_cart_v1';

export function CartProvider({ children }) {
  // Initialize state from localStorage so it survives page refresh
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Intentional fault injection state for testing Error Boundary recovery
  const [triggerFault, setTriggerFault] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [items]);

  // Add item with specified quantity
  const addToCart = useCallback((dish, quantity = 1) => {
    if (!dish) return;
    setItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }
      return [...prev, { ...dish, qty: Math.max(1, quantity) }];
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: quantity } : item))
      );
    }
  }, []);

  // Remove single item completely
  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Total count of distinct units
  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.qty || 1), 0);
  }, [items]);

  // Subtotal in ETB
  const subtotalETB = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0);
  }, [items]);

  // Delivery fee (50 ETB, free above 500 ETB)
  const deliveryFeeETB = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotalETB >= 500 ? 0 : 50;
  }, [items.length, subtotalETB]);

  // Grand total in ETB
  const grandTotalETB = useMemo(() => {
    return subtotalETB + deliveryFeeETB;
  }, [subtotalETB, deliveryFeeETB]);

  const value = useMemo(
    () => ({
      items,
      totalItemCount,
      subtotalETB,
      deliveryFeeETB,
      grandTotalETB,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      triggerFault,
      setTriggerFault,
    }),
    [
      items,
      totalItemCount,
      subtotalETB,
      deliveryFeeETB,
      grandTotalETB,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      triggerFault,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
