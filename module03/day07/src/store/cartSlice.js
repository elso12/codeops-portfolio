import { createSlice } from '@reduxjs/toolkit';

/**
 * Exercise 7: Redux Toolkit Cart Slice
 * Built for architectural comparison against the Zustand cart store.
 * Not wired into the active runtime, preserving lightweight Zustand execution.
 */
const initialState = {
  items: [],
  diningType: 'dine-in', // 'dine-in' | 'delivery' | 'takeout'
  isCartOpen: false,
  activeTrackId: 'MESOB-8921'
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { dish, quantity = 1, note = '' } = action.payload;
      const existingItem = state.items.find((item) => item.id === dish.id);

      if (existingItem) {
        existingItem.quantity += quantity;
        if (note) existingItem.note = note;
      } else {
        state.items.push({ ...dish, quantity, note });
      }
    },
    remove: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);
    },
    updateQuantity: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== id);
        }
      }
    },
    clear: (state) => {
      state.items = [];
    },
    setDiningType: (state, action) => {
      state.diningType = action.payload;
    },
    toggleCart: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart: (state) => {
      state.isCartOpen = true;
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    }
  }
});

// Action creators exported for consumers
export const {
  addItem,
  remove,
  updateQuantity,
  clear,
  setDiningType,
  toggleCart,
  openCart,
  closeCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectSubtotalETB = (state) =>
  state.cart.items.reduce((total, item) => total + item.priceETB * item.quantity, 0);
export const selectIsCartOpen = (state) => state.cart.isCartOpen;
export const selectDiningType = (state) => state.cart.diningType;

export default cartSlice.reducer;
