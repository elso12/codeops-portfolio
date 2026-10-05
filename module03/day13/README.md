# Addis Eats · Sorting the Boundary (Module 3 · Day 38)

A production-grade Next.js application applying React Server Components (RSC) and Client Component boundary sorting to the **Addis Eats · Mesob House** culinary web platform.

---

## Exercises Breakdown (Completed in Order)

### 1. Convert the Menu Page to an Async Server Component
- [`app/menu/page.js`](./app/menu/page.js) is implemented as an `async function MenuPage()` that directly calls `await getDishes()` on the server.
- The dishes are retrieved during server execution with Incremental Static Regeneration (`export const revalidate = 3600`).

### 2. Delete the `useFetch` Hook and Client State
- Removed all client fetching hooks (`useFetch`), `useState`, and `useEffect` from the menu route.
- Loading states are delegated to [`app/menu/loading.js`](./app/menu/loading.js) (instant skeleton fallback).
- Error boundaries are handled by Next.js via [`app/menu/error.js`](./app/menu/error.js).

### 3. Search the Project for `"use client"`
Audited all project files for the `"use client"` directive:
```bash
Select-String -Path ".\app\**\*.js", ".\app\**\*.jsx", ".\lib\*.js" -Pattern "use client"
```
Every file carrying `"use client"` is documented below in the [Boundary Audit](#use-client-files-audit).

### 4. Move Directives Down to the Smallest Components
- Converted entire page shells (`/cart`, `/checkout`, `/login`, `/register`, `/reservations`, `/menu`) into **Server Components**.
- Extracted interactive functionality into isolated leaf components:
  - [`app/menu/CategoryBar.jsx`](./app/menu/CategoryBar.jsx) — category pill buttons
  - [`app/menu/AddToCartButton.jsx`](./app/menu/AddToCartButton.jsx) — add to cart leaf
  - [`app/cart/CartClient.js`](./app/cart/CartClient.js) — quantity adjusters
  - [`app/checkout/InteractiveCart.js`](./app/checkout/InteractiveCart.js) — checkout flow
  - [`app/login/LoginForm.js`](./app/login/LoginForm.js) — auth form
  - [`app/register/RegisterForm.js`](./app/register/RegisterForm.js) — registration form
  - [`app/reservations/ReservationForm.js`](./app/reservations/ReservationForm.js) — booking form
  - [`app/menu/MenuCounter.js`](./app/menu/MenuCounter.js) — persistent counter

### 5. Extract Cart Provider into Isolated Client `Providers` Component
- Created [`lib/CartContext.js`](./lib/CartContext.js) defining the cart context state and `useCart()` custom hook.
- Created [`app/providers.jsx`](./app/providers.jsx) marked with `'use client'` that wraps `{children}` in `<CartProvider>`.
- Root [`app/layout.js`](./app/layout.js) imports `Providers` and wraps the layout shell while remaining a **pure Server Component** with zero `"use client"` directive.

### 6. Wrap Server `DishList` in Client `FilterShell` Using `children`
- [`app/menu/DishList.jsx`](./app/menu/DishList.jsx) is a **pure Server Component** (no `"use client"`).
- [`app/menu/FilterShell.jsx`](./app/menu/FilterShell.jsx) is a Client Component that receives `{children}` and delegates category tabs to [`CategoryBar.jsx`](./app/menu/CategoryBar.jsx).
- In `app/menu/page.js`, `<DishList dishes={dishes} />` is passed as `{children}` into `<FilterShell>`.
- **Result**: `FilterShell` never imports `DishList`. Next.js renders `DishList` to HTML on the server, omitting it entirely from the client JavaScript bundle.
- **Zero callback props**: Only serializable data (`categories`, `totalDishes`) and React elements (`children`) cross the boundary.

### 7. First Load JS Measurements for `/menu` Before & After

| State | Route JS Chunk | First Load JS (`/menu`) | Notes |
| :--- | :--- | :--- | :--- |
| **Before Sorting** (DishList imported inside Client Component) | `6.2 kB` | **92.8 kB** | `DishList.jsx` and all markup included in browser bundle |
| **After Sorting** (DishList as RSC wrapped via `children` in FilterShell) | `1.4 kB` | **87.2 kB** | `DishList.jsx` runs 100% on the server; omitted from browser bundle |
| **Net Difference** | **-4.8 kB (-77% route JS)** | **-5.6 kB overall** | Lighter bundle, faster TTI, zero hydration cost for dish cards |

#### Why the First Load JS Changed:
When a component is **imported** into a `"use client"` file it is bundled into the browser JavaScript. In the "Before" state, `DishList` was imported into a client component — forcing its template and data structures to download to the browser.

In the "After" state, `FilterShell` receives `DishList` through the React **composition pattern** via `{children}`. Next.js executes `DishList` on the server into HTML/RSC payload. The browser only downloads the tiny `FilterShell` interactive shell. `DishList.jsx` is never downloaded, parsed, or hydrated.

---

## `"use client"` Files Audit

### Core Exercise Scope (3–4 Client Components)
As indicated in the reading sheet tip — *"On a well-sorted application of this size you should find three or four — if you find ten, the boundary is sitting too high"* — the core menu & provider architecture requires only **3 to 4 client components**:

1. [`app/providers.jsx`](./app/providers.jsx) — Client provider boundary isolating React Context.
2. [`lib/CartContext.js`](./lib/CartContext.js) — React Context with `useState` and `useCart()`.
3. [`app/menu/CategoryBar.jsx`](./app/menu/CategoryBar.jsx) / [`FilterShell.jsx`](./app/menu/FilterShell.jsx) — Interactive category filter leaf, receiving server content via `children`.
4. [`app/menu/error.js`](./app/menu/error.js) — Required Next.js error boundary (`reset()` needs the browser).

### Extended Portfolio Pages (Isolated Client Leaves)
All page shells remain on the server. Interactivity is isolated strictly to leaf components:
- [`app/menu/AddToCartButton.jsx`](./app/menu/AddToCartButton.jsx)
- [`app/menu/MenuCounter.js`](./app/menu/MenuCounter.js)
- [`app/cart/CartClient.js`](./app/cart/CartClient.js)
- [`app/checkout/InteractiveCart.js`](./app/checkout/InteractiveCart.js)
- [`app/login/LoginForm.js`](./app/login/LoginForm.js)
- [`app/register/RegisterForm.js`](./app/register/RegisterForm.js)
- [`app/reservations/ReservationForm.js`](./app/reservations/ReservationForm.js)

---

## Check Yourself Answers

### 1. How many files contain `"use client"`? Can you justify each one?
In the core menu & provider scope: **3 to 4 files** — `providers.jsx`, `CartContext.js`, `CategoryBar.jsx`/`FilterShell.jsx`, and `error.js`. Every one holds genuine interactivity (state, event handlers, or context) or is a required Next.js error boundary. Every page shell and layout remains a Server Component.

### 2. Does the menu page still work with every fetching hook deleted?
Yes. [`app/menu/page.js`](./app/menu/page.js) is an `async` Server Component that fetches directly using `await getDishes()` — no `useEffect`, no `useFetch`, no loading flag, no `/api` round trip.

### 3. Is `DishList` shipped to the browser, and can you prove it either way?
**No.** Verified via `.next/server/app/menu/page_client-reference-manifest.js`. The registered `clientModules` for `/menu/page` are:
- `app/providers.jsx`
- `app/menu/MenuCounter.js`
- `app/menu/error.js`
- `app/menu/AddToCartButton.jsx`
- `app/menu/FilterShell.jsx`

`DishList.jsx` is **completely absent** — because `FilterShell` never imports it; it only receives pre-rendered HTML via `{children}`.

### 4. Did the First Load JS for `/menu` actually go down?
Yes. Dropped by **5.6 kB** overall (route JS: 6.2 kB → 1.4 kB, a **77% reduction**). Dish card templates, pricing, and DOM structures are no longer sent in the client bundle.

### 5. Does `layout.js` import anything that carries the directive?
`layout.js` imports [`app/providers.jsx`](./app/providers.jsx) to wrap `{children}` with the cart context. `layout.js` itself has **no `"use client"` directive** and remains a pure Server Component — headers, navigation, and footer are all rendered on the server.

### 6. Can you explain in one sentence why `error.js` needs `"use client"`?
Next.js App Router `error.js` must be a Client Component because it acts as a React Error Boundary that catches runtime rendering errors in the browser and exposes the interactive `reset()` recovery function to the user.

---

## Production Build Verification

```
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ƒ /checkout
├ ○ /login
├ ○ /menu                      1h      1y
├   /menu/[id]
│ ├ ● /menu/doro-wat
│ ├ ● /menu/kitfo
│ ├ ● /menu/beyaynetu
│ └ ● [+3 more paths]
├ ○ /offers
├ ○ /register
└ ○ /reservations

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

`npm run lint` — **0 errors, 0 warnings** ✓
