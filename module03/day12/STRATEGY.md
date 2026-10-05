# Addis Eats (Mesob House) · Route Rendering Strategies

This document details the rendering strategy adopted for every route in the **Addis Eats (Mesob House)** application (inspired by the Figma Community design by Eyasu Nigussie), along with concise justifications based on data dynamism, caching requirements, and performance targets.

| Route | Rendering Strategy | Build Marker | One-Line Justification |
| :--- | :--- | :--- | :--- |
| `/` (Root Home) | **Static (SSG / Prerendered)** | `○ (Static)` | The story and address never change between builds. |
| `/menu` (Menu Catalog) | **Incremental Static Regeneration (ISR)** | `○ (Static)` with `1h revalidate` | Dishes change occasionally; speed matters most (1-hour revalidation window). |
| `/menu/[id]` (Dish Detail) | **Static Generation with `generateStaticParams` (SSG)** | `● (SSG)` | Every dish is known at build time; Next.js compiles dedicated static HTML per dish. |
| `/cart` (User Cart) | **Client Component (CSR)** | `○ (Static shell)` | The person's own state, and private (managed via React client state). |
| `/checkout` (Table Reservation & Order) | **Dynamic Server Rendering (SSR)** | `ƒ (Dynamic)` | Reads the session cookie (`await cookies()`) and live pricing on every request. |
| `/offers` (Special Offers) | **Static (SSG / Prerendered)** | `○ (Static)` | Promotional packages and coupon codes are static marketing campaigns delivered instantly from the edge. |
| `/reservations` (Table Booking) | **Static Prerender with Client Form** | `○ (Static)` | Static presentation shell pre-rendered at build time with an interactive client form for party reservations. |
| `/login` (Guest & Member Access) | **Static Prerender with Client Form** | `○ (Static)` | Marketing and auth shell is static, allowing instant first load before handling client-side credentials. |
| `/register` (Member Registration) | **Static Prerender with Client Form** | `○ (Static)` | Membership signup shell is static with client-side interactive form validation and state. |

---

### Key Architectural Verifications

1. **Root Layout Ownership**:
   - `app/layout.js` owns the `<html>` and `<body>` tags, imports `globals.css` containing the Figma palette (Paprika Reds, Turmeric Golds, Forest Greens, Warm Ivory, and Dark Espresso), and wraps all routes with global navigation and footer.

2. **Persistent Nested Layout & State Survival**:
   - `app/menu/layout.js` introduces a category sidebar and a client state counter (`MenuCounter.js`).
   - Because `/menu/[id]` is nested within `/menu/`, navigating between the main menu and individual dish details preserves the counter value without layout unmounting or state resets.

3. **Dynamic Read in Checkout**:
   - Exact line causing dynamic bailout in `app/checkout/page.js`:
     ```javascript
     const cookieStore = await cookies();
     ```
   - Reading `cookies()` indicates request-time context dependency, prompting Next.js to switch the build marker from static to `ƒ (Dynamic)`.

4. **Streaming with Suspense**:
   - In `app/menu/page.js`, `<DishList />` is wrapped in `<Suspense fallback={<DishListSkeleton />}>`.
   - On slow or throttled networks, the menu shell and category sidebar paint immediately, streaming dish cards progressively without blocking navigation.
