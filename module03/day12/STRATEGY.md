# Mesob House · Route Rendering Strategies

This document details the rendering strategy adopted for every route in the **Mesob House (Habesha Restaurant)** application (inspired by the Figma Community design by Eyasu Nigussie), along with concise justifications based on data dynamism, caching requirements, and performance targets.

| Route | Rendering Strategy | Build Marker | One-Line Justification |
| :--- | :--- | :--- | :--- |
| `/` (Root Home) | **Static (SSG / Prerendered)** | `○ (Static)` | Brand story, cultural pillars, and hero showcase never change per request and are prerendered once at build time for instant CDN delivery. |
| `/menu` (Menu Catalog) | **Incremental Static Regeneration (ISR)** | `○ (Static)` with `1m revalidate` | Seasonal Habesha specials, chef recommendations, and market prices update periodically; a 60-second ISR window balances lightning-fast cached responses with fresh kitchen data. |
| `/menu/[id]` (Dish Detail) | **Static Generation with `generateStaticParams` (SSG)** | `● (SSG)` | The curated catalog of authentic Ethiopian dishes is known at build time, allowing Next.js to compile dedicated static HTML for every dish with zero server latency. |
| `/checkout` (Table Reservation & Cart) | **Dynamic Server Rendering (SSR)** | `ƒ (Dynamic)` | Must read request-specific headers/cookies (`await cookies()`) on every request to resolve individual guest session tokens and dining seating preferences. |

---

### Key Architectural Verifications

1. **Root Layout Ownership**:
   - `app/layout.js` owns the `<html>` and `<body>` tags, imports `globals.css` containing the Figma palette (Paprika Reds, Turmeric Golds, Forest Greens, Warm Ivory, and Dark Espresso), and wraps all routes with the header and footer.

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
