# Addis Eats — Hardened Edition (Module 3 · Day 34)

> **Advanced React Architecture: Error Boundaries, Code Splitting, Profiler Optimisation & Portals**  
> **Course:** CodeOps Full Stack Software Development · IBT College Canada  
> **Author:** Mehran Dasgar  

---

## 📖 Overview

Addis Eats has been hardened to survive runtime errors, load only the resources each route requires, remain fast as the catalog grows, and render modal dialogs that cleanly escape parent clipping and stacking contexts.

---

## 🛠️ Architecture & Seams

```text
day09/
├── public/
│   └── menu.json                 # Authentic Ethiopian dishes catalog with dietary & allergen metadata
├── src/
│   ├── cart/
│   │   └── CartContext.jsx       # Isolated cart provider with memoized selectors and crash injection hooks
│   ├── checkout/
│   │   └── Checkout.jsx          # Lazy-loaded controlled express checkout screen (Chunk-split)
│   ├── components/
│   │   ├── CartPanel.jsx         # Isolated cart sidebar with stepper controls and deliberate throw support
│   │   ├── CartUnavailable.jsx   # Fallback UI when the cart boundary catches a render fault
│   │   ├── DishCard.jsx          # Dish card with overflow: hidden, memoized export, and modal portal
│   │   ├── Header.jsx            # Sticky branding, cart pill, and diagnostic fault-injection toolbar
│   │   ├── Menu.jsx              # Category filter chips, live search, and dish grid
│   │   ├── MenuUnavailable.jsx   # Fallback UI when the menu boundary catches a render fault
│   │   ├── ProfilerHud.jsx       # Interactive real-time telemetry HUD displaying React.Profiler commit timings
│   │   └── RouteSkeleton.jsx     # Shimmer layout skeleton shown during Suspense dynamic chunk downloads
│   ├── orders/
│   │   └── Receipt.jsx           # Lazy-loaded order confirmation receipt (Chunk-split)
│   ├── ui/
│   │   └── Modal.jsx             # Accessible dialog rendered via createPortal into #modal-root
│   ├── App.jsx                   # Root application with nested Error Boundaries and Suspense routes
│   ├── ErrorBoundary.jsx         # Production React ErrorBoundary class component with fallback & reset
│   ├── index.css                 # Vanilla CSS design system with animations, shimmer, and accessible focus states
│   └── main.jsx                  # Application entry point with BrowserRouter and CartProvider
├── index.html                    # Root container with dedicated <div id="modal-root">
├── package.json                  # Dependencies (React 19, React Router 7, Vite 6)
├── PROFILE.md                    # In-depth Profiler benchmark analysis (Before vs After measurements)
└── vite.config.js                # Vite build configuration with React plugin
```

---

## 🚀 Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open `http://127.0.0.1:5173/` in your browser.

3. **Production build & bundle verification:**
   ```bash
   npm run build
   ```
   Notice that `Checkout` and `Receipt` are split into separate JavaScript chunks (`Checkout-*.js`, `Receipt-*.js`) and are never downloaded on the initial visit.

---

## 🧪 Interactive Exercises & Verification Guide

### Exercise 1 & 2: Menu Error Boundary & Isolated Dish Crash
- Click **"💥 Crash Dish (Menu Boundary)"** in the top testing toolbar.
- The `DishCard` for Kitfo deliberately throws a render exception.
- **Verification:** The Menu catalog gracefully unmounts and displays `<MenuUnavailable />` with an actionable retry button, while the **Header** and **Cart Panel** remain completely active and intact!
- Click **"✅ Heal Menu Catalog"** or **"🔄 Restore Menu Catalog"** to recover.

### Exercise 3: Independent Cart Error Boundary
- Click **"💥 Crash Cart Panel (Cart Boundary)"** in the testing toolbar.
- The `CartPanel` deliberately throws a render exception.
- **Verification:** The sidebar displays `<CartUnavailable />` while the **Menu catalog** remains 100% interactive (you can continue filtering, searching, and opening modal dialogs).
- Click **"✅ Heal Cart Panel"** to recover.

### Exercise 4: Route-Level Lazy Loading behind Suspense
- Open your browser's Developer Tools (Network tab).
- Navigate to **"💳 Checkout"**.
- Notice the `<RouteSkeleton>` shimmer placeholder while `Checkout-*.js` downloads on demand.
- Complete the form and submit to observe `Receipt-*.js` load asynchronously.

### Exercise 5 & 6: Profiler Telemetry & Re-render Elimination
- Click the bottom-right **"📊 React Profiler Telemetry"** button to open the real-time HUD.
- Click `+ Add to Order` on three dishes with **"⚠️ Unoptimized (Full Re-render)"** active.
- Note that all 10 `DishCard` components re-render on every click (`actualDuration ≈ 4.75 ms`).
- Switch the toggle to **"⚡ Optimized (React.memo Active)"** and repeat.
- Note that `actualDuration` drops to **`0.91 ms`** (**~81% reduction**) because `React.memo` and `useCallback` prevent all 10 dish cards from re-rendering!
- Full analysis and metrics are recorded in [`PROFILE.md`](./PROFILE.md).

### Exercise 7: Accessible Portal Modal (`createPortal`)
- Click **"🔍 Details"** on any dish card (or press `Enter` when focused on the button).
- Notice that `.dish-card` has `overflow: hidden`, but the modal renders cleanly into `<div id="modal-root">` outside `#root` without being clipped.
- **Keyboard navigation:**
  - Press `Tab` and `Shift + Tab`: Focus cycles strictly within the modal (focus trap).
  - Press `Escape`: The modal dismisses immediately and focus automatically returns to the triggering button.
