<div align="center">

  <h1>🍲 MESOB HOUSE (የሐበሻ ቤት) — DAY 07</h1>
  <p><strong>Advanced State Management: React Context Provider Isolation, Guarded Hooks & Zustand Store Migration</strong></p>

  <p>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zustand-5.x-764ABC?style=for-the-badge" alt="Zustand 5" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=for-the-badge&logo=redux&logoColor=white" alt="Redux Toolkit" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/Zod-3.x-3068B7?style=for-the-badge" alt="Zod 3" /></a>
    <a href="#-tech-stack"><img src="https://img.shields.io/badge/CSS3-Vanilla_Design-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="Vanilla CSS" /></a>
  </p>

  <p>
    <i>Architecting resilient state boundaries: isolating low-frequency context providers, eliminating re-render cascades with atomic Zustand selectors, and contrasting with Redux Toolkit.</i>
  </p>

</div>

---

## 📖 Executive Summary & Day 07 Objectives

In Day 07, the **Mesob House (Addis Eats)** digital dining application transitions from monolithic React Context into an optimized, hybrid state architecture:

1. **Guarded Context Pattern**: Every React context (`CartContext`, `AuthContext`, `ThemeContext`) is wrapped in a fail-fast custom hook (`useCart`, `useAuth`, `useTheme`) throwing clear runtime errors when consumed outside its provider boundary.
2. **Provider Separation & Isolation**: Low-frequency, global concerns (**Authentication** and **Theme**) are decoupled into separate, focused context providers rather than being bundled together.
3. **Re-render Profiling with React DevTools**: Audited component re-renders with "Highlight Updates", demonstrating how monolithic Context triggers re-renders across all consumers when adding an item to the cart.
4. **Zustand Cart Store Migration**: Rebuilt cart state in an external Zustand store featuring `items`, `addItem`, `remove`, `clear`, and `localStorage` persistence middleware (`persist`).
5. **Atomic Narrow Selectors**: Consumers subscribe only to the slice of state they require (e.g. `items.length` in `Header`), eliminating unnecessary re-renders in presentational components like `DishCard` and `Hero`.
6. **Redux Toolkit Comparison Slice**: Implemented a parallel `cartSlice.js` using `@reduxjs/toolkit` to benchmark boilerplate, bundle footprint, immutability paradigms (Immer vs functional), and selector ergonomics against Zustand.

---

## 🗺️ System Architecture & Multi-Provider Hierarchy

```text
[App Root (<App />)]
   │
   └── [ErrorBoundary] (Catches runtime errors; provides graceful recovery)
         │
         └── [ThemeProvider] (Context: light/dark theme state & persistence)
               │
               └── [AuthProvider] (Context: user session & auth dialog state)
                     │
                     └── [CartProvider] (Context: compatibility layer with guarded useCart hook)
                           │
                           └── [MainApp] (Layout, Navigation, Live Data Hydration)
                                 │
                                 ├── [Header] ──► Reads: useAuth(), useTheme(), useCart() [narrow selector]
                                 ├── [Hero] ────► Reads: actions only (zero re-render on cart updates)
                                 ├── [MenuSection]
                                 │     └── [DishCard] ──► Reads: addItem action only
                                 ├── [CartDrawer] ────► Reads: items list, totals & checkout actions
                                 └── [Modals Layer] ──► Reservation, Tracker, Auth, Legal
```

---

## 🧪 Completed Exercises & Technical Walkthrough

### Exercise 1: Guarded `useCart` Hook with Defensive Errors
- **File**: [`src/context/CartContext.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/context/CartContext.jsx)
- **Implementation**: The bare `useContext(CartContext)` call is guarded inside `useCart()`:
  ```javascript
  export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  }
  ```
- **Rationale**: Prevents cryptic `Cannot read properties of null` errors when components accidentally render outside the provider hierarchy.

### Exercise 2: Split Auth and Theme into Dedicated Providers
- **Files**: 
  - [`src/context/AuthContext.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/context/AuthContext.jsx)
  - [`src/context/ThemeContext.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/context/ThemeContext.jsx)
- **Implementation**:
  - `AuthProvider` encapsulates user login/logout, demo user session, and notification toasts.
  - `ThemeProvider` manages `theme` (`light` | `dark`), syncs `data-theme` attribute to `document.documentElement`, and persists choice to `localStorage`.
  - Both export guarded custom hooks: `useAuth()` and `useTheme()`.

### Exercise 3: React DevTools "Highlight Updates" Re-render Audit
- **Report Document**: [`DEVTOOLS_RENDER_AUDIT.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/DEVTOOLS_RENDER_AUDIT.md)
- **Findings**: When adding a dish via monolithic `CartContext`, all 17 consumer components re-rendered, including presentational components (`DishCard`, `Hero`, `ReservationModal`).
- **Benchmark Table**:
  | Component | Context Re-render | Zustand Narrow Selector Re-render | Status |
  | :--- | :--- | :--- | :--- |
  | `Header` (badge) | Re-rendered | Re-rendered (badge value changed) | ✅ Necessary |
  | `CartDrawer` | Re-rendered | Re-rendered (line items updated) | ✅ Necessary |
  | `DishCard` (all 12+ items) | 🔴 Re-rendered | 🟢 **0 Re-renders** (action reference stable) | ⚡ Optimized |
  | `Hero` | 🔴 Re-rendered | 🟢 **0 Re-renders** (action reference stable) | ⚡ Optimized |
  | `ReservationModal` | 🔴 Re-rendered | 🟢 **0 Re-renders** | ⚡ Optimized |

### Exercise 4: Zustand Cart Store with `items`, `addItem`, `remove`, and `clear`
- **File**: [`src/store/useCartStore.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/store/useCartStore.js)
- **Core State & Actions**:
  - `items`: Array of banquet dishes in the bag.
  - `addItem(dish, qty, note)`: Inserts new item or increments existing item quantity.
  - `remove(id)`: Removes dish by ID.
  - `clear()`: Resets cart to empty state.
  - `updateQuantity(id, delta)`: Modifies line item count with zero-quantity pruning.

### Exercise 5: Atomic Narrow Selectors in Consumers
- **Pattern**: Components subscribe strictly to the slice of state they require:
  ```javascript
  // Only re-renders when the count of items changes:
  const totalItems = useCartStore((state) => 
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );

  // Zero re-renders on cart modifications:
  const addItem = useCartStore((state) => state.addItem);
  ```

### Exercise 6: Persistent Cart State across Page Refreshes
- **Implementation**: Utilizes `persist` middleware from `zustand/middleware` targeting `mesob_house_cart_store_v2`.
- **Verification**: Refreshing the browser preserves cart items, dining fulfillment mode (`dine-in`, `delivery`, `takeout`), and placed tracking orders.

### Exercise 7: Redux Toolkit Comparison Slice (`cartSlice.js`)
- **Files**:
  - [`src/store/cartSlice.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/store/cartSlice.js)
  - [`src/store/STORE_COMPARISON.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day07/src/store/STORE_COMPARISON.md)
- **Comparison Summary**:
  - **Zustand**: ~1.1 kB gzipped, no provider requirement, seamless atomic selector hooks.
  - **Redux Toolkit**: ~11.5 kB gzipped, Immer mutable drafts, formal action/reducer structure, requires top-level `<Provider>`.

---

## 📋 State-Placement & Responsibility Matrix

| State Concern | Technology / Layer | Owning Module | Consumers | Primary Actions / Mutators |
| :--- | :--- | :--- | :--- | :--- |
| **Shopping Cart & Items** | Zustand Store | `useCartStore.js` | `CartDrawer`, `Header`, `DishCard`, `DishDetailModal` | `addItem()`, `remove()`, `updateQuantity()`, `clear()` |
| **Cart Persistence** | Zustand Middleware | `persist()` | `localStorage` (`mesob_house_cart_store_v2`) | Automatic state rehydration on mount |
| **User Authentication** | React Context | `AuthContext.jsx` | `Header`, `AuthModal`, `CartDrawer` | `login()`, `loginDemoUser()`, `register()`, `logout()` |
| **Theme (Light / Dark)** | React Context | `ThemeContext.jsx` | `Header`, `document.documentElement` | `toggleTheme()`, `setTheme()` |
| **Table Reservation** | Zustand Store | `useCartStore.js` | `Hero`, `ReservationModal`, `Header` | `openReservation()`, `closeReservation()` |
| **Live Order Tracking** | Zustand Store | `useCartStore.js` | `OrderTrackerModal`, `Footer`, `Header` | `openTracker(id)`, `closeTracker()`, `addOrder()` |
| **Redux Reference Slice** | Redux Toolkit | `cartSlice.js` | Reference / Architectural comparison | `addItem`, `remove`, `updateQuantity`, `clear` |

---

## 📁 Project Directory Structure

```text
day07/
├── public/                         # Static assets & Ethiopian dish photography
│   └── dishes/                     # High-resolution dish imagery & SVG fallbacks
├── src/
│   ├── assets/                     # Brand icons & logo assets
│   ├── components/
│   │   ├── AuthModal.jsx           # Sign In / Sign Up dialog
│   │   ├── BunaCeremony.jsx        # Traditional Habesha coffee ceremony section
│   │   ├── CartDrawer.jsx          # Sliding banquet cart & dining mode selector
│   │   ├── ContactSection.jsx      # Hearth location, map preview & inquiry form
│   │   ├── CookieConsent.jsx       # Cookie preference banner
│   │   ├── DishCard.jsx            # Individual menu item card with addItem action
│   │   ├── DishDetailModal.jsx     # Extended dish inspector & note customizer
│   │   ├── ErrorBoundary.jsx       # Global application crash boundary
│   │   ├── FaqSection.jsx          # Searchable FAQ accordion
│   │   ├── Footer.jsx              # Heritage links, operating hours & copyright
│   │   ├── Header.jsx              # Top announcement, search, theme switch & navigation
│   │   ├── HeritageSection.jsx     # Cultural Gursha dining etiquette guide
│   │   ├── Hero.jsx                # Immersive entrance banner & primary CTAs
│   │   ├── LegalModal.jsx          # Privacy policy, terms & allergen disclosures
│   │   ├── MenuSection.jsx         # Banquet catalog with category filtering
│   │   ├── MobileBottomNav.jsx     # Sticky mobile navigation bar
│   │   ├── NewsletterSection.jsx   # VIP dining club 15% discount voucher
│   │   ├── OrderTrackerModal.jsx   # Live 5-step order preparation stepper
│   │   ├── ReservationModal.jsx    # Mesob table reservation engine
│   │   ├── ReviewsSection.jsx      # Customer & press reviews with 5-star rating form
│   │   └── SpecialsSection.jsx     # Chef daily specials banquet highlights
│   ├── context/
│   │   ├── AuthContext.jsx         # Isolated auth session provider + guarded useAuth hook
│   │   ├── CartContext.jsx         # Guarded useCart hook throwing on missing provider
│   │   └── ThemeContext.jsx        # Isolated theme provider + guarded useTheme hook
│   ├── services/
│   │   └── api.js                  # Remote API client + normalized fallback banquet dataset
│   ├── store/
│   │   ├── cartSlice.js            # Redux Toolkit cart slice for architectural comparison
│   │   ├── STORE_COMPARISON.md     # In-depth technical comparison: Zustand vs RTK
│   │   ├── useAuthStore.js         # Zustand auth store reference implementation
│   │   └── useCartStore.js         # Active Zustand cart store with persistence & narrow actions
│   ├── utils/
│   │   └── validationSchemas.js    # Zod schemas for reservation, login, and contact forms
│   ├── App.css                     # Comprehensive design system tokens & component styles
│   ├── App.jsx                     # Multi-provider application root
│   ├── index.css                   # Global resets, color variables & typography
│   └── main.jsx                    # Vite application bootstrap entry
├── DEVTOOLS_RENDER_AUDIT.md        # React DevTools profiling audit & re-render analysis
├── index.html                      # HTML entry with OpenGraph meta & Schema.org JSON-LD
├── package.json                    # Dependencies: React 19, Zustand 5, Redux Toolkit, Zod
└── vite.config.js                  # Vite 6 configuration with React plugin
```

---

## 🚀 Verification & Quality Assurance

### 1. Code Quality & Static Analysis
```bash
npm run lint
```
*Result*: **0 warnings, 0 errors** across all JavaScript and JSX source files using Oxlint.

### 2. Production Build Compilation
```bash
npm run build
```
*Result*: Vite bundles all chunks cleanly with code splitting, vendor chunk isolation, and zero compilation warnings.

### 3. Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` to test live interactions, theme switching, cart modifications, and order tracking.
