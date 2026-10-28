# Addis Eats — Complete Frontend Mini-Project & Capstone Kickoff
> **CodeOps · Full Stack Software Development**  
> **IBT College · Toronto, Canada**  
> **Module 3 · Day 35 (Day 10 Exercise)**  
> **Instructor / Curriculum Design:** Mehran Dasgar  

---

## 1. Specification & Requirements Summary

Addis Eats is a comprehensive food-ordering application tailored for Addis Ababa:
- **Browse Catalog:** Authentic Ethiopian dishes loaded from an API with categories, spice levels, allergens, preparation times, and prices in Ethiopian Birr (ETB).
- **Category Filter in URL:** Selecting a category (`Main`, `Vegetarian`, `Breakfast`, `Beverages`) persists state in the URL search params (`?category=...`), making filters shareable and resilient across refreshes.
- **Dynamic Dish Detail (`/menu/:id`):** Deep culinary view displaying spice meters, allergen badges, ingredient breakdowns, and portion steppers.
- **Persistent Cart Store:** Global cart holding order lines, computing live subtotal, Addis Ababa courier delivery calculation (free over 500 ETB), and running grand total in ETB. Persisted in `localStorage`.
- **Guarded Checkout (`/checkout`):** Guarded by user authentication session. If signed out, redirects to `/login` preserving target location, returning seamlessly after sign-in.
- **Pure Form Validation:** Strict phone validation for Ethiopian carriers (Telebirr `09...`, `+2519...`, Safaricom `07...`), subcity selection, and actionable errors.
- **Hardened Resilience:** React `ErrorBoundary` catching component render crashes, code-split lazy routes with shimmer Suspense fallback, and a live Diagnostic Verification HUD.

---

## 2. Component Tree & Ownership

```text
App
 └─ ErrorBoundary (Catches render crashes, shows recovery UI)
     └─ AuthProvider (Owns: user session, login, logout)
         └─ CartProvider (Owns: cart items, quantity modifiers, ETB totals)
             └─ BrowserRouter
                 └─ Layout (Owns: Diagnostic HUD, Header, Nav, <Outlet />, Footer)
                     ├─ Home (Reads: specials; Owns: local UI state)
                     ├─ Menu (Reads: ?category from URL; Owns: fetched dishes, search term)
                     │   ├─ CategoryBar (Props: selectedCategory, onSelectCategory)
                     │   └─ DishList (Props: dishes, onResetFilter)
                     │       └─ DishCard (Props: dish; Dispatches: addToCart)
                     ├─ DishDetail (Reads: :id from URL params; Owns: quantity, dish data)
                     ├─ CartPage (Reads: CartContext; Dispatches: updateQuantity, clearCart)
                     ├─ RequireAuth (Route Guard: checks isAuthenticated, redirects to /login)
                     │   └─ Suspense (Fallback: RouteSkeleton)
                     │       └─ Checkout (Lazy-loaded; Owns: form, touched, submitting)
                     │           └─ Field (Props: id, label, error, touched, hint)
                     ├─ Suspense (Fallback: RouteSkeleton)
                     │   └─ Receipt (Lazy-loaded; Reads: order state from navigation)
                     ├─ LoginPage (Owns: name, phone, area; Dispatches: login)
                     └─ NotFound (Catch-all 404 route)
```

---

## 3. State Placement Table

| State Item | Where It Lives | Rationale |
| :--- | :--- | :--- |
| **Selected Category** | URL Query String (`?category=`) | Shareable, bookmarkable, and survives hard browser refreshes. |
| **Search Filter** | `Menu.jsx` (local state debounced) | Only the Menu view filters on live search; unmounts when leaving screen. |
| **Fetched Dishes** | `useFetch` inside `Menu.jsx` | Lowest component needing catalog data; cancelled with `AbortController`. |
| **Dish Detail Record** | `DishDetail.jsx` | Derived from `:id` URL param; isolated to specific dish view. |
| **Cart Items & ETB Total**| `CartContext.jsx` Store | Read across `Header`, `CartBadge`, `DishCard`, `CartPage`, and `Checkout`. Persisted in `localStorage`. |
| **Auth Session** | `AuthContext.jsx` Context | Infrequently changes, required globally by `RequireAuth` guard and `Header`. |
| **Checkout Form Fields** | `Checkout.jsx` | Exclusively needed during checkout workflow; cleared upon successful submission. |
| **Diagnostic Flags** | Diagnostic HUD / `menu.js` | Verification tool for examiners to throttle connection and inject faults. |

---

## 4. Definition of Done & Quality Standard

| Standard | Target | Addis Eats Implementation Status |
| :--- | :--- | :--- |
| **Works for a stranger** | Intuitive UX, zero unhandled errors | Complete intuitive flow from landing to menu, detail, cart, login, checkout, and receipt. |
| **No blank screen** | Shimmer skeleton, spinner, empty state | All loading, empty category, missing dish, and network errors render dedicated UI. |
| **Console cleanliness** | Clean console without React warnings | Proper unique `key` props, accessible label associations, standard DOM attributes. |
| **Readable Git History** | Conventional Commits | Small, descriptive commits (`feat:`, `fix:`, `refactor:`, `docs:`). |
| **Runs from Fresh Clone** | Portable and reproducible | Standard npm scripts (`dev`, `build`, `preview`) with pinned dependencies. |

---

## 5. Verification Checklist: 6 Failure Paths & Accessibility

- [x] **1. Throttle to Slow 3G:** Built-in toggle on the diagnostic HUD simulates 1500ms latency. Verified: Spinner and loading skeletons appear with zero blank screens.
- [x] **2. Simulate Fetch Failure:** Diagnostic button triggers 503 Gateway Timeout. Verified: Accessible alert displays with a working "Retry Fetch" button.
- [x] **3. Filter to Empty Category:** Searching for non-existent keywords displays a friendly empty state ("No Dishes Found") with a reset button.
- [x] **4. Type a Nonsense URL:** Navigating to `/random-path` renders the custom Ethiopian 404 view with safe links back to the menu.
- [x] **5. Open `/checkout` Signed Out:** Triggers `RequireAuth` redirect to `/login` with `state: { from }`. Signing in returns directly to `/checkout`.
- [x] **6. Reload on Every Screen:** Cold browser refresh on `/`, `/menu`, `/menu/1`, `/cart`, and `/checkout` re-hydrates state without crashing.
- [x] **7. Keyboard Only:** Complete checkout form navigable and submittable via `Tab`, `Enter`, and `Space`.
- [x] **8. Greyscale Contrast:** Diagnostic Greyscale toggle proves all information hierarchy, spice indicators, and buttons are distinct without color cues alone.

---

## 6. Review Questions & Answers (Slide 27)

### 1. Which day’s topic is currently weakest in your project, and how will you close that gap?
> **Answer:** Code-splitting and bundle measurement (Day 34). While `React.lazy` is implemented for `Checkout` and `Receipt`, fine-grained route chunk profiling ensures third-party packages are isolated. We ensure this by running `npm run build` and verifying chunk splits in Rollup output.

### 2. Name one piece of state in your build that is higher in the tree than it needs to be.
> **Answer:** Cart items live in `CartContext` at the root of the app. This is necessary because both `Header` and `DishCard` read/write to it, but sub-components could use memoized selectors to avoid re-rendering unrelated header navigation links when an item quantity changes.

### 3. What happens in your application if the data request fails? Show the exact screen.
> **Answer:** An accessible `<Alert variant="error">` banner is rendered containing the exact server error message (`503 Service Unavailable: Central Kitchen Gateway Timeout`) alongside an interactive "Retry Fetch" button that restarts the query via `useFetch.refetch()`.

### 4. Why is code structure worth a fifth of the mark when the features are worth 40%?
> **Answer:** Working features prove syntax; structure proves architectural maintainability. Feature-based folder grouping (`cart/`, `menu/`, `checkout/`) ensures that components, validation rules, and stores can be independently refactored, tested, or removed without breaking the rest of the application.

### 5. For your capstone: who is the user, and what do they do on the first screen?
> **Answer:** For **MedAddis Clinic & Pharmacy Manager**, the primary user is **Rahel Tadesse (Senior Triage Registrar & Pharmacist)**. On the first screen (`/`), she views real-time clinic triage metrics (active queue, critical pending prescriptions, emergency consultations) and immediately launches new patient check-ins.

### 6. What would make your capstone too large to finish, and how have you scoped that out?
> **Answer:** Integrating live biometric card readers, real banking gateway APIs, and full video tele-health would cause scope creep. We scoped it strictly to: **5 focused screens, 1 core user persona, and local mock storage** with simulated API latency.
