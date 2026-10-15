# React DevTools "Highlight Updates" Audit: Adding a Dish to Cart

## 🔬 Observation & Profiling Context
- **Tool**: React DevTools Extension -> Profiler & Components Tab -> Settings -> "Highlight updates when components render".
- **Action Tested**: Clicking "Add to Mesob" on a dish card in the Banquet Menu.

---

## 🛑 With Monolithic React Context (`CartContext`)

### Observed Re-render Cascade
When `addToCart(dish)` was dispatched through `CartContext`, the state update inside `CartProvider` produced a new reference for the context `value` object. Because standard React Context notifies all subscribers regardless of which slice of the context value they consume, **all 17 consumer components re-rendered simultaneously**:

| Component | Why It Was Consuming Context | Did It Need to Re-render? |
| :--- | :--- | :--- |
| **`Header`** | Reads `totalItems` (badge count) | ✅ Yes (badge count incremented) |
| **`CartDrawer`** | Reads `cart` items list & subtotals | ✅ Yes (cart content changed) |
| **`MobileBottomNav`** | Reads `totalItems` badge | ✅ Yes (mobile badge changed) |
| **`MainApp` (`App.jsx`)** | Reads `orderToast` | ✅ Yes (toast banner triggered) |
| **`Hero`** | Only reads action functions (`addToCart`, `openDishModal`) | ❌ **Wasted Render** |
| **`DishCard` (all visible cards)** | Only reads action functions (`addToCart`, `openDishModal`) | ❌ **Wasted Render** (all 12+ cards flashed green/orange) |
| **`DishDetailModal`** | Reads `activeDishModal` | ❌ **Wasted Render** (modal was closed) |
| **`ReservationModal`** | Only reads `isReservationOpen`, `closeReservation` | ❌ **Wasted Render** |
| **`OrderTrackerModal`** | Only reads `isTrackerOpen`, `orders` | ❌ **Wasted Render** |
| **`LegalModal`** | Only reads `legalModalState` | ❌ **Wasted Render** |
| **`CookieConsent`** | Only reads `openLegal` | ❌ **Wasted Render** |
| **`Footer`** | Only reads `openLegal`, `openTracker` | ❌ **Wasted Render** |
| **`ReviewsSection`** | Only reads `showToast` | ❌ **Wasted Render** |
| **`ContactSection`** | Only reads `showToast` | ❌ **Wasted Render** |
| **`NewsletterSection`** | Only reads `showToast` | ❌ **Wasted Render** |
| **`BunaCeremony`** | Only reads `openReservation` | ❌ **Wasted Render** |

**Summary**: Over 85% of re-renders caused by `CartContext` were wasted renders because stable action callbacks and unrelated UI states were packaged inside the same Context Provider.

---

## ⚡ The Solution: Moving to Zustand with Narrow Selectors

By moving Cart state to a Zustand store with atomic, narrow selectors:
```javascript
// Header only subscribes to the number of items:
const totalItems = useCartStore((state) => state.items.reduce((acc, item) => acc + item.quantity, 0));

// DishCard only grabs the action, zero subscription to state changes:
const addItem = useCartStore((state) => state.addItem);
```

### Expected Behavior After Zustand Migration:
1. **`DishCard` and `Hero`**: 0 re-renders. (Action references are strictly stable).
2. **`ReservationModal`, `LegalModal`, `OrderTrackerModal`**: 0 re-renders.
3. **`Header` and `MobileBottomNav`**: Exactly 1 re-render to update the item badge count from $N \to N+1$.
4. **`CartDrawer`**: Exactly 1 re-render to reflect the new item row and line subtotal.
