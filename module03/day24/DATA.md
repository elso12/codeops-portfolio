# DATA.md — Data Decisions, Query Inventory & Caching Strategy

> **Addis Eats · Mesob House Restaurant**  
> **CodeOps Full Stack · Module 3 · Day 49 (Week 10 Frontend Capstone Build)**  
> **Lead Engineer:** Mehran Dasgar  
> **Course Director:** Mehran Dasgar  

---

## 1. Decision Two: "Where Data is Fetched" (Capstone Standard)

> *"Server unless the person triggers it. That single rule decides four of these five rows. The exceptions are the ones a person types into or that must keep refreshing on their own. Then seed the exception: Where a client query is unavoidable, render the first result on the server and pass it in as fallbackData. Nobody should watch a spinner for data you already had."*

| DATA DOMAIN | WHERE, AND WHY |
| :--- | :--- |
| **Menu and dishes** | **Server** — public, indexable, cacheable |
| **Order history & ledger** | **Server** — private, scoped to the session |
| **Operational aggregates**| **Server** — heavy calculations done on server; sends only summarized rows across boundary |
| **Order status polling** | **Server first, then polled on the client** |
| **Live courier GPS track** | **Server first, then streamed via SSE on the client** |
| **Menu search** | **Client** — triggered by typing, debounced |
| **Cart** | **Client store** — it never leaves the browser until checkout |

---

## 2. Complete Query Inventory & Refresh Rules

| Query / Feature | Execution Realm | Query Key / Target | Refresh Rule | One Line of Reasoning |
| :--- | :---: | :--- | :--- | :--- |
| **Menu Catalog** | Server (RSC) | `getDishes()` | `revalidate: 3600` (ISR) | Public catalog changes infrequently; static server rendering ensures immediate first paint and perfect SEO crawlability. |
| **Single Dish Detail**| Server (RSC) | `getDishById(id)` | `revalidate: 3600` (ISR) | Dish descriptions and prices are crawled by search engines and require server-generated JSON-LD structured data. |
| **Customer Orders** | Server (RSC) | `getOrdersByUser(session.user.id)` | `revalidatePath('/orders')` on write | Order list is private, rendered directly from session identity, and revalidates only when the user places or cancels an order. |
| **Dashboard Analytics Aggregations** | Server (RSC) | `aggregateDashboardData(orders)` | Request time (SSR) | Server pre-computes neighbourhood revenue and daily volumes, sending only ~24 summarized rows across the network boundary instead of raw transactions. |
| **Paginated Order Ledger** | Server (RSC) | `paginateAndSortOrders(orders, {page, sort, order})` | Dynamic searchParams | Server computes sort order and slices exactly 6 rows per page, keeping client payload minimal. |
| **Live Order Status** | Server + Client | `/api/orders/${id}` | `refreshInterval: 5000` (5s); `fallbackData: initial` | Kitchen ticket status changes unpredictably during cooking; server seeding eliminates the loading spinner, while 5s polling keeps the user updated. |
| **Live Courier GPS Tracking** | Server + Client | `/api/orders/${id}/stream` | Server-Sent Events (SSE) live stream | Real-time courier coordinates update every 3 seconds; pre-seeded on the server so map renders instantly on arrival. |
| **Menu Search** | Client (SWR) | `debounced ? \`/api/dishes?q=\${debounced}\` : null` | `useDebounce(term, 300)`; `keepPreviousData: true` | Search queries change in response to human typing; 300ms debounce prevents request flooding, and `keepPreviousData` stops results from flickering. |
| **Staff Kitchen Queue**| Server + Client | `getAllOrders()` + `/api/orders` | `revalidatePath('/kitchen')` + 4s polling | Expediter hearth board requires real-time ticket progression as dishes move between pending, preparing, and completed stages. |

---

## 3. The Client Exceptions: Live Verification

### Exception 1: Live Polled Status (`app/orders/[id]/OrderStatus.jsx`)
* **How It Is Seeded:**  
  [`app/orders/[id]/page.js`](./app/orders/%5Bid%5D/page.js) reads the order directly on the server via `getOrderById(id)`. It renders the first paint with real data and passes it into `<OrderStatus id={id} initial={order} />`.
* **Verification in Browser:**
  * **On Arrival:** Data displays immediately on first frame. **Zero loading spinner duration (0 ms)**.
  * **In Network Tab:** Quiet HTTP `GET /api/orders/ord_001` requests fire automatically every 5,000ms.
  * **Simulate Stage Advance:** Clicking *"Simulate Next Stage →"* triggers `PATCH /api/orders/ord_001` and mutates the cache optimistically.

---

### Exception 2: Debounced Search-as-You-Type (`app/menu/SearchBox.jsx`)
* **How It Buffers Keystrokes:**  
  Input state `term` is buffered through `useDebounce(term, 300)`. If empty, the query key is declaratively set to `null` (`debounced.trim() ? ... : null`).
* **Verification in Network Tab While Typing:**
  * **Typing 5 characters:** Typing **"t-i-b-s-!"** produces **exactly 1 network request** (`/api/dishes?q=tibs`) once typing pauses for 300ms.
  * **Zero requests** are fired for intermediate individual letters.
  * **`keepPreviousData: true`** ensures existing cards stay visible on screen during background validation, eliminating layout shift and card flickering.

---

### Exception 3: Live Courier GPS Stream (`app/track/[id]/TrackingClient.jsx`)
* **How It Streams:**  
  Opens a native `EventSource('/api/orders/:id/stream')`. The server yields milestone progress and simulated motorcycle coordinates along Addis Ababa avenues.
* **Fallbacks:**
  * If the SSE connection fails or is blocked by network proxies, SWR automatically falls back to 5-second polling of `/api/orders/:id`.

---

## 4. Shared Fetcher & Non-OK Error Throwing

Implemented in [`lib/fetcher.js`](./lib/fetcher.js):
```javascript
export async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await res.json();
    } catch {
      error.info = { statusText: res.statusText };
    }
    error.status = res.status;
    throw error;
  }
  return res.json();
}
```
* SWR requires the fetcher to reject or throw on non-200 status codes so that the hook sets `error`, allowing components to show a recovery screen rather than rendering broken components.
