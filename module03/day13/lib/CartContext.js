'use client';

import { createContext, useContext, useState, useMemo } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([
    {
      id: 'doro-wat',
      name: 'Royal Doro Wat (የንጉሥ ዶሮ ወጥ)',
      price: 24.00,
      qty: 1,
      category: 'Signature Wats'
    },
    {
      id: 'kitfo',
      name: 'Special Gurage Kitfo (የጉራጌ ልዩ ክትፎ)',
      price: 26.50,
      qty: 1,
      category: 'Tibs & Grills'
    }
  ]);

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const addItem = (dish) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: dish.id,
          name: dish.name,
          price: dish.price,
          qty: 1,
          category: dish.category
        }
      ];
    });
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.qty, 0),
    [items]
  );

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.qty, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQty,
    removeItem,
    clearCart,
    subtotal,
    totalCount
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
