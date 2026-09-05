import { createContext, useReducer, useMemo, useContext } from 'react';
import cartReducer, { initialCartState } from './cartReducer.js';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // Memoize total so it only recalculates when cart changes
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [cart]);

  // Memoize the provider value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({
    cart,
    dispatch,
    total
  }), [cart, dispatch, total]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to easily consume the context
export const useCart = () => useContext(CartContext);