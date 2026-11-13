# Addis Eats (Mesob House) — Server-Client Boundary Map (BOUNDARY.md)

> **Course:** Module 3 · Frontend Web Development (React & Next.js)  
> **Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Framework:** Next.js 16 (App Router) + React 19

---

## 1. Architectural Boundary Rules

1. **Server-First Hierarchy (RSC)**: All components, pages, layouts, and data fetchers execute on the server by default. No `"use client"` directive is applied unless browser APIs (`localStorage`), client hooks (`useState`, `useEffect`, `useActionState`), or event listeners (`onClick`, `onChange`) are strictly necessary.
2. **Push Directives to Leaves**: The `"use client"` boundary is strictly pushed down to leaf components (e.g., buttons, form cards, search inputs) rather than decorating route pages.
3. **Children Composition Pattern**: Server-rendered components and layouts wrap client leaves or pass Server Component trees as `{children}` across client boundaries, preventing server code from being bundled into browser JavaScript.
4. **Isolated Client Providers**: Context providers (`CartContext`) are encapsulated in an isolated client boundary (`components/Providers.jsx`), allowing `app/layout.js` to remain a pure Server Component.
5. **No Function Props Across Boundaries**: Only plain serializable JSON primitives and objects (strings, numbers, arrays, booleans) pass across the server-client boundary. Mutations use Server Actions declared with `"use server"`.

---

## 2. Server vs. Client Component Map

| Component / File Path | Side | Directive | One-Line Justification |
| :--- | :--- | :--- | :--- |
| `app/layout.js` | **Server** | *(None)* | Root HTML shell, metadata, and font injection; mounts `<Providers>` without client bundle pollution. |
| `app/page.js` | **Server** | *(None)* | Static marketing showcase, culinary pillars, and featured dishes rendered to zero-JS HTML. |
| `app/menu/page.js` | **Server** | *(None)* | Server component querying data layer directly; passes initial catalog down to `<SearchBox />`. |
| `app/menu/layout.js` | **Server** | *(None)* | Persistent category sub-navigation shell; passes children through without client unmounting. |
| `app/menu/loading.js` | **Server** | *(None)* | Instant streaming loading state skeleton rendered during server transitions. |
| `app/menu/error.js` | **Client** | `'use client'` | Next.js requirement: error boundaries must be client components to hook into React runtime errors. |
| `app/menu/SearchBox.jsx` | **Client** | `'use client'` | Interactive leaf managing search input state, debounced filtering (`300ms`), and category pill switches. |
| `app/menu/DishCard.jsx` | **Server** | *(None)* | Pure presentational card for dish pricing, dietary tags, and image preview. |
| `app/menu/[id]/page.js` | **Server** | *(None)* | Server component retrieving single dish details and streaming structured JSON-LD. |
| `app/cart/page.js` | **Server** | *(None)* | Server page shell providing layout, heading, and breadcrumbs for the shopping cart. |
| `app/cart/CartClient.jsx` | **Client** | `'use client'` | Interactive leaf reading `localStorage` via `CartContext` to mutate line items and quantities. |
| `app/checkout/page.js` | **Server** | *(None)* | Pre-fetches dish catalog and passes serialized options to progressive enhancement form. |
| `app/checkout/CheckoutForm.jsx`| **Client**| `'use client'` | Progressive enhancement form leaf using `useActionState(placeOrder)` with native POST fallback. |
| `app/orders/page.js` | **Server** | *(None)* | Private user dashboard querying database scoped to `session.user.id`; aggregates summaries server-side. |
| `app/orders/loading.js` | **Server** | *(None)* | Streaming suspense skeleton boundary with fixed-height chart containers (0.000 CLS). |
| `app/orders/error.js` | **Client** | `'use client'` | Next.js runtime error boundary leaf for orders dashboard exceptions. |
| `components/dashboard/RevenueBarChart.jsx` | **Client** | `'use client'` | Fixed-height SVG bar chart leaf with ETB ticks, 0 baseline, non-color patterns, and companion table. |
| `components/dashboard/OrdersLineChart.jsx` | **Client** | `'use client'` | Fixed-height SVG line chart leaf with range/unit heading, geometric markers, and companion table. |
| `components/dashboard/OrderTable.jsx` | **Server** | *(None)* | Accessible semantic order table with right-aligned totals, `aria-sort`, and Link pagination. |
| `components/dashboard/DashboardEmptyState.jsx` | **Server** | *(None)* | Semantic empty state for brand-new customers with 0 orders and forced state testing. |
| `components/dashboard/DashboardLoadingState.jsx` | **Server** | *(None)* | Fixed-height skeleton screen preserving 0.000 CLS across all viewports. |
| `components/dashboard/DashboardErrorState.jsx` | **Server** | *(None)* | Accessible error alert leaf (`role="alert"`) with retry action. |
| `components/dashboard/StateSwitcher.jsx` | **Server** | *(None)* | Demonstration toolbar allowing instant on-demand switching across all 4 UI states. |
| `app/orders/CancelButton.jsx` | **Client** | `'use client'` | Interactive action leaf using `useTransition` to invoke the `cancelOrder` server action. |
| `app/orders/AttackTestBox.jsx` | **Client** | `'use client'` | Interactive browser console for testing parameter tampering against server actions. |
| `app/orders/[id]/page.js` | **Server** | *(None)* | Server shell verifying order ownership before rendering the live tracker. |
| `app/orders/[id]/OrderStatus.jsx`| **Client**| `'use client'` | SWR client hook polling `/api/orders/[id]` every 5,000ms with 0ms initial server seed. |
| `app/kitchen/page.js` | **Server** | *(None)* | Protected staff page rendering live order queues directly from database. |
| `app/kitchen/KitchenStatusControl.jsx`| **Client**| `'use client'` | Interactive status modifier sending PATCH requests to advance order workflow. |
| `app/login/page.js` | **Server** | *(None)* | Presentation shell for authentication portal. |
| `app/login/LoginForm.jsx` | **Client** | `'use client'` | Interactive login leaf calling `signIn` Server Action and managing credential errors. |
| `app/register/page.js` | **Server** | *(None)* | Presentation shell for member registration portal. |
| `app/register/RegisterForm.jsx`| **Client** | `'use client'` | Interactive registration leaf validating new member input fields. |
| `app/reservations/page.js` | **Server** | *(None)* | Server shell for table reservation view. |
| `app/reservations/ReservationForm.jsx`| **Client**| `'use client'`| Interactive booking form with guest counter and dining style selection. |
| `app/security-lab/page.js` | **Server** | *(None)* | Defense audit lab presentation shell. |
| `app/security-lab/SecurityLabClient.jsx`| **Client**| `'use client'`| Interactive testing console for simulating CSRF, mass assignment, and IDOR attacks. |
| `app/not-found.js` | **Server** | *(None)* | Static 404 page shell triggered when `notFound()` is invoked. |
| `components/Providers.jsx` | **Client** | `'use client'` | Client provider wrapper maintaining React Context across server-rendered layouts. |
| `components/CartContext.jsx` | **Client** | `'use client'` | React Context state store managing cart items and browser `localStorage` syncing. |
| `components/AddToCartButton.jsx`| **Client**| `'use client'` | Interactive button leaf calling `addItem()` on `CartContext`. |
| `components/CategoryBar.jsx` | **Client** | `'use client'` | Interactive category filter buttons updating search params or client state. |
| `components/Navbar.jsx` | **Client** | `'use client'` | Interactive navigation leaf reading `cartCount` from context and managing mobile hamburger state. |

---

## 3. Boundary Architecture Flow Diagram

```text
[ Root Server Layout (app/layout.js) ]
             │
      <Providers> (components/Providers.jsx) ['use client']
             │
   ┌─────────┴──────────────────────────────────────┐
   │                                                │
[ Server Page Shells ]                    [ Client Leaf Components ]
  - app/page.js                             - components/Navbar.jsx
  - app/menu/page.js                        - app/menu/SearchBox.jsx
  - app/menu/[id]/page.js                   - components/AddToCartButton.jsx
  - app/cart/page.js                        - app/cart/CartClient.jsx
  - app/checkout/page.js                    - app/checkout/CheckoutForm.jsx
  - app/orders/page.js                      - app/orders/CancelButton.jsx
  - app/orders/[id]/page.js                 - app/orders/[id]/OrderStatus.jsx
  - app/kitchen/page.js                     - app/kitchen/KitchenStatusControl.jsx
  - app/reservations/page.js                - app/reservations/ReservationForm.jsx
  - app/login/page.js                       - app/login/LoginForm.jsx
  - app/register/page.js                    - app/register/RegisterForm.jsx
  - app/security-lab/page.js                - app/security-lab/SecurityLabClient.jsx
```

---

## 4. Verification Check

1. **How many files contain `"use client"`?**
   - Core interactive leaves: Exactly 13 client components, all pushed to the lowest possible branch of the component tree.
2. **Does `layout.js` import anything carrying `"use client"`?**
   - It imports `Providers.jsx` and `Navbar.jsx` as leaf boundaries, but `layout.js` itself remains an async Server Component with zero client directives.
3. **Are database modules ever leaked to the browser?**
   - No. `lib/db.js`, `lib/session.js`, and `lib/data.js` are never imported into client components. Any data mutations pass through `"use server"` actions in `app/actions.js`.
