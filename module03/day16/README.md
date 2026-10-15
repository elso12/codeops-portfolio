# Addis Eats — Day 41 · Live Data with SWR & React Query

> **CodeOps Full Stack · Module 3 · Day 16 (Day 41)**  
> Next.js live data fetching with SWR: background polling, debounced search-as-you-type, and shareable query-string pagination — seeded seamlessly with server components.

---

## What We Built

Three client-side data challenges solved cleanly:
1. **Order Status Screen (`/orders/[id]`):** Server-rendered on first paint with `fallbackData` (zero initial loading spinner) and continuously polled every 5 seconds (`refreshInterval: 5000`) without hand-written `useEffect` or `setInterval`.
2. **Debounced Menu Search (`app/menu/SearchBox.jsx`):** A debounced search box using a `null` key when empty, preventing unwanted requests, with `keepPreviousData: true` so results never blink or flash between keystrokes.
3. **Paged Banquet Dishes (`app/menu/PagedDishList.jsx`):** Page number stored in the URL query string (`/menu?page=2`), fully linkable and shareable, rendered initially on the server and paged smoothly on the client with `keepPreviousData`.

---

## 🔍 Network Tab Verification: What It Shows While Typing

> **What the network tab shows while typing into the search box:**
>
> 1. **While typing rapidly:** When typing a 5-character search term (e.g. `t-i-b-s- `), the browser's Network tab shows **zero intermediate requests** during typing. The `useDebounce` hook holds the query for 300ms.
> 2. **After pausing for 300ms:** Exactly **one single GET request** fires:
>    ```http
>    GET /api/dishes?q=tibs 200 OK
>    ```
> 3. **When clearing the search box (empty term):** The SWR query key switches to `null`. The Network tab shows **no request sent** because SWR treats `null` as conditional "do not fetch".
> 4. **While transitioning between searches:** With `keepPreviousData: true`, existing results remain painted on the screen while the network request is in flight. No flash, layout jump, or blank state occurs.
> 5. **Concurrent requests:** Two components listening to the same query key trigger only **one network request**, automatically deduplicated by SWR.

---

## Exercise Checklist

- [x] **Exercise 1 — Shared SWR Fetcher:** Shared fetcher in `lib/fetcher.js` throwing descriptive errors on non-OK responses (`!res.ok`).
- [x] **Exercise 2 — Convert Order Status Screen:** Converted to `useSWR`, completely eliminating hand-rolled `useState`, `useEffect`, and manual timers.
- [x] **Exercise 3 — Background 5s Polling:** Added `refreshInterval: 5000` to poll order status every 5 seconds.
- [x] **Exercise 4 — Server Component with `fallbackData`:** `app/orders/[id]/page.js` loads initial data directly on the server and provides it as `fallbackData` so first paint has zero spinner.
- [x] **Exercise 5 — Debounced Search with `null` Key:** Search term debounced by 300ms. Uses `null` key when input is empty.
- [x] **Exercise 6 — `keepPreviousData`:** Prevents search results from flashing empty while typing new queries.
- [x] **Exercise 7 — Query String Pagination & DATA.md:** Paging synchronized with URL (`?page=2`), linkable, shareable, and documented in `DATA.md`.

---

## Project Structure

```text
├── lib/
│   ├── fetcher.js              # Shared SWR fetcher (rejects non-OK responses)
│   ├── hooks.js                # useDebounce hook
│   ├── data.js                 # In-memory store, 12 authentic dishes, seed orders
│   ├── schema.js               # Zod validation schema
│   └── session.js              # Server session mock
├── app/
│   ├── api/
│   │   ├── dishes/
│   │   │   └── route.js        # GET /api/dishes (?category, ?q, ?page, ?limit)
│   │   └── orders/
│   │       └── [id]/route.js   # GET & PATCH /api/orders/:id (5s polling target)
│   ├── menu/
│   │   ├── page.js             # Server Component (seeds initial page)
│   │   ├── SearchBox.jsx       # Debounced, null-key, keepPreviousData
│   │   └── PagedDishList.jsx   # URL query-string pagination with keepPreviousData
│   └── orders/
│       ├── page.js             # My Orders list (RSC)
│       └── [id]/
│           ├── page.js         # Server Component (seeds fallbackData)
│           └── OrderStatus.jsx # useSWR client poll (refreshInterval: 5000)
├── DATA.md                     # Query inventory, keys, refresh rules, reasoning
└── package.json                # Next.js 16, React 19, SWR 2.5.1
```

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit:
- Menu with live search and pagination: [http://localhost:3000/menu](http://localhost:3000/menu)
- Live order status tracker (5s polling): [http://localhost:3000/orders/ord_001](http://localhost:3000/orders/ord_001)
- My orders: [http://localhost:3000/orders](http://localhost:3000/orders)
