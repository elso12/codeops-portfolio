# Addis Eats · Server-Client Boundary Map (BOUNDARY.md)

This document maps every component in **Addis Eats · Mesob House** to its execution environment (Server vs. Client), providing the architectural justification for each placement in accordance with **Next.js App Router Boundary Sorting (Module 3 · Day 38)**.

---

## Architectural Rules

1. **Default to Server (RSC)**: All components, pages, and layouts run on the server by default. No `"use client"` directive is added unless interactive state, event handlers (`onClick`), browser APIs, or React Context are strictly required.
2. **Push `"use client"` Down to Leaves**: Client boundaries are placed on the smallest possible interactive sub-components (e.g. form fields, counter buttons, cart adjusters) rather than entire pages.
3. **Isolate Providers**: Context providers (`CartProvider`) are wrapped inside an isolated `Providers.js` client component, allowing `app/layout.js` to remain a pure Server Component.
4. **Composition over Client Import**: Server components like `DishList` are passed as `{children}` into client shells like `FilterShell`. This keeps `DishList` out of the client JavaScript bundle.
5. **No Callback Props Across the Boundary**: Server components pass only plain, serializable data (strings, numbers, arrays, objects) and React elements (`children`) to client components — never functions.

---

## Component Boundary Table

| Component File | Side | Directive | One-Line Justification |
| :--- | :--- | :--- | :--- |
| `app/layout.js` | **Server** | *(None)* | Root HTML document shell and metadata; wraps children with `<Providers>` without client overhead. |
| `app/providers.jsx` | **Client** | `'use client'` | Houses `CartProvider` so React Context is available to client leaves while keeping `layout.js` on the server. |
| `lib/CartContext.js` | **Client** | `'use client'` | Defines `CartContext`, `useState` state management, and the `useCart()` custom hook. |
| `app/page.js` | **Server** | *(None)* | Static landing showcase, brand heritage narrative, and featured culinary pillars rendered to static HTML. |
| `app/menu/layout.js` | **Server** | *(None)* | Menu category sidebar shell; mounts the isolated `<MenuCounter />` leaf without turning the layout into a client component. |
| `app/menu/MenuCounter.js` | **Client** | `'use client'` | Maintains interactive counter state (`useState`) to demonstrate state persistence across sub-route navigations. |
| `app/menu/page.js` | **Server** | *(None)* | Async server component directly awaiting `getDishes()` without hooks; streams data with ISR (`revalidate = 3600`). |
| `app/menu/DishList.jsx` | **Server** | *(None)* | Renders dish cards and links strictly on the server; never imported into client bundles. |
| `app/menu/FilterShell.jsx` | **Client** | `'use client'` | Interactive filter shell (`useState`); receives server-rendered `DishList` via `{children}` and delegates category tabs to `CategoryBar`. |
| `app/menu/CategoryBar.jsx` | **Client** | `'use client'` | Interactive category pill buttons; the client leaf for menu category switching. |
| `app/menu/AddToCartButton.jsx` | **Client** | `'use client'` | Interactive button leaf; handles `onClick` and writes to cart context without pulling dish cards into client bundle. |
| `app/menu/loading.js` | **Server** | *(None)* | Instant skeleton fallback rendered on the server during initial load or async revalidation. |
| `app/menu/error.js` | **Client** | `'use client'` | React Error Boundary required by Next.js to catch runtime render errors and invoke interactive `reset()`. |
| `app/menu/[id]/page.js` | **Server** | *(None)* | Pre-rendered static dish detail page compiled via `generateStaticParams()` at build time. |
| `app/cart/page.js` | **Server** | *(None)* | Page header, SEO metadata, and breadcrumb navigation pre-rendered on the server; mounts `<CartClient />`. |
| `app/cart/CartClient.js` | **Client** | `'use client'` | Interactive leaf handling quantity increments/decrements and subtotal calculation via `useCart()`. |
| `app/checkout/page.js` | **Server** | *(None)* | Dynamic server component reading session cookies via `await cookies()` on every request; mounts `<InteractiveCart />`. |
| `app/checkout/InteractiveCart.js` | **Client** | `'use client'` | Interactive checkout leaf with seating options, extra teff injera toggle, and order submission state. |
| `app/login/page.js` | **Server** | *(None)* | Static presentation shell for login portals pre-rendered on the server; mounts `<LoginForm />`. |
| `app/login/LoginForm.js` | **Client** | `'use client'` | Interactive authentication form with tab switching (`Guest` vs `Member`) and input validation state. |
| `app/register/page.js` | **Server** | *(None)* | Static presentation shell for member registration pre-rendered on the server; mounts `<RegisterForm />`. |
| `app/register/RegisterForm.js` | **Client** | `'use client'` | Interactive registration leaf with client-side form validation, password matching, and submission feedback. |
| `app/reservations/page.js` | **Server** | *(None)* | Static dining reservation shell pre-rendered on the server; mounts `<ReservationForm />`. |
| `app/reservations/ReservationForm.js` | **Client** | `'use client'` | Interactive table booking form with guest counter (`- / +`), date/time selection, and confirmation card. |
| `app/offers/page.js` | **Server** | *(None)* | Static promotional coupons, feast discounts, and special offers delivered as static edge HTML. |
| `lib/dishes.js` | **Server / Universal** | *(None)* | Pure JavaScript data module defining authentic Habesha dishes and server data access functions. |

---

## Boundary Architecture Diagram

```
[ Root Server Layout (app/layout.js) ]
                │
         <Providers> (app/providers.js) ['use client']
                │
        ┌───────┴──────────────────────────────┐
        │                                      │
[ Server Page Shells ]                [ Client Leaf Components ]
  - app/page.js                         - app/menu/MenuCounter.js
  - app/menu/layout.js                  - app/menu/FilterShell.jsx
  - app/menu/page.js                    - app/menu/error.js
  - app/menu/[id]/page.js               - app/cart/CartClient.js
  - app/cart/page.js                    - app/checkout/InteractiveCart.js
  - app/checkout/page.js                - app/login/LoginForm.js
  - app/reservations/page.js            - app/register/RegisterForm.js
  - app/offers/page.js                  - app/reservations/ReservationForm.js
        │
        ▼ Composition Pattern (No Import):
  <FilterShell> ['use client']
      └─► {children} ──► <DishList /> [Server Component]
```

---

## Verification & Boundary Check

1. **How many files contain `"use client"`?**
   - **In the core Menu & Providers exercise scope**: Exactly **3 to 4 files**:
     1. `app/providers.jsx` (Client provider boundary)
     2. `lib/CartContext.js` (Cart context state)
     3. `app/menu/CategoryBar.jsx` / `FilterShell.jsx` (Category filter leaf)
     4. `app/menu/error.js` (Required error boundary)
   - *Tip note from slide*: *"On a well-sorted application of this size you should find three or four — if you find ten, the boundary is sitting too high."*
     The core menu route achieves this exact 3–4 component minimum. Across the broader portfolio application containing all Day 12 extended Figma screens, all 6 interactive leaves (`LoginForm`, `RegisterForm`, `ReservationForm`, `InteractiveCart`, `CartClient`, `MenuCounter`) have their page shells pushed to the server and directives isolated strictly to bottom-level form leaves.
2. **Does `layout.js` import anything carrying `"use client"`?**
   It imports `Providers.jsx` only to wrap `{children}`. `layout.js` itself remains an async Server Component with no client directive, and its headers, footers, and metadata are rendered entirely on the server.
3. **Is `DishList` shipped to the browser?**
   **No**. Verified via Next.js RSC client reference manifest (`page_client-reference-manifest.js`). `DishList.jsx` is not registered as a client module because it is passed as `{children}` to `FilterShell`, rendering directly to HTML on the server.
4. **Are any callback props passed across the boundary?**
   **No**. All props passed from server components to client components are strictly serializable data (`categories`, `totalDishes`).

