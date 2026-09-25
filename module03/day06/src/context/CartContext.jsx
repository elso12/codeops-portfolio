import React, { createContext, useContext } from 'react';
import { useCartStore } from '../store/useCartStore';

const CartContext = createContext();

export function CartProvider({ children }) {
  const store = useCartStore();

  const totalItems = store.cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalETB = store.cart.reduce((acc, item) => acc + item.priceETB * item.quantity, 0);
  const deliveryFee = store.diningType === 'delivery' ? 100 : 0;
  const grandTotalETB = subtotalETB + deliveryFee;

  const contextValue = {
    ...store,
    totalItems,
    subtotalETB,
    deliveryFee,
    grandTotalETB
  };

  return (
    <CartContext.Provider value={contextValue}>
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
