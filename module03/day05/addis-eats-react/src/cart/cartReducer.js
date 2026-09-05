export const initialCartState = [];

export default function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...state, { ...action.payload, qty: 1 }];
    }
    case 'REMOVE': {
      const existing = state.find(item => item.id === action.payload);
      if (existing.qty === 1) {
        return state.filter(item => item.id !== action.payload);
      }
      return state.map(item =>
        item.id === action.payload ? { ...item, qty: item.qty - 1 } : item
      );
    }
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}