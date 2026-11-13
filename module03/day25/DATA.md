# DATA.md — Data Decisions, Query Inventory & Caching Strategy

> **Addis Eats · Mesob House Restaurant**  
> **CodeOps Full Stack · Module 3 · Day 45 (Day 20 Advanced Project Deliverable)**  
> **Designed to the Day 45 Curriculum Standard (Mehran Dasgar)**

---

## 1. Decision Two: "Where Data is Fetched" (Slide 12 Standard)

> *"Server unless the person triggers it. That single rule decides four of these five rows. The exceptions are the ones a person types into or that must keep refreshing on their own. Then seed the exception: Where a client query is unavoidable, render the first result on the server and pass it in as fallbackData. Nobody should watch a spinner for data you already had."*

| DATA | WHERE, AND WHY |
| :--- | :--- |
| **Menu and dishes** | **Server** — public, indexable, cacheable |
| **Order history** | **Server** — private, scoped to the session |
| **Order status** | **Server first, then polled on the client** |
| **Menu search** | **Client** — triggered by typing, debounced |
| **Cart** | **Client store** — it never leaves the browser |

---

## 2. Complete Query Inventory & Refresh Rules (Slide 14 Standard)

| Query / Feature | Location | Query Key | Refresh Rule | One Line of Reasoning |
| :--- | :--- | :--- | :--- | :--- |
| **Menu Catalog** | Server (RSC) | `getDishes()` | `revalidate: 3600` (ISR) | Public catalog changes infrequently; static server rendering ensures immediate first paint and perfect SEO crawlability. |
| **Single Dish Detail**| Server (RSC) | `getDishById(id)` | `revalidate: 3600` (ISR) | Dish descriptions and prices are crawled by search engines and require server-generated JSON-LD structured data. |
| **Customer Orders** | Server (RSC) | `getOrdersByUser(session.user.id)` | `revalidatePath('/orders')` on write | Order list is private, rendered directly from session identity, and revalidates only when the user places or cancels an order. |
| **Live Order Status** | Server + Client | `/api/orders/${id}` | `refreshInterval: 5000` (5s); `fallbackData: initial` | Kitchen ticket status changes unpredictably during cooking; server seeding eliminates the loading spinner, while 5s polling keeps the user updated. |
| **Menu Search** | Client (SWR) | `debounced ? \`/api/dishes?q=\${debounced}\` : null` | `useDebounce(term, 300)`; `keepPreviousData: true` | Search queries change in response to human typing; 300ms debounce prevents request flooding, and `keepPreviousData` stops results from flickering. |
| **Staff Kitchen Queue**| Server + Client | `getAllOrders()` + `/api/orders` | `revalidatePath('/kitchen')` + 4s polling | Expediter hearth board requires real-time ticket progression as dishes move between pending, preparing, and completed stages. |

---

## 3. The Two Client Exceptions: Live Verification (Slide 18 Standard)

### Exception 1: Live Polled Status (`app/orders/[id]/OrderStatus.jsx`)
* **How It Is Seeded:**  
  [`app/orders/[id]/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/%5Bid%5D/page.js) reads the order directly on the server via `getOrderById(id)`. It renders the first paint with real data and passes it into `<OrderStatus id={id} initial={order} />`.
* **Verification in Browser:**
  * **On Arrival:** Data displays immediately on first frame. **Zero loading spinner duration (0 ms)**.
  * **In Network Tab:** Quiet HTTP `GET /api/orders/ord_001` requests fire automatically every 5,000ms.
  * **Simulate Stage Advance:** Clicking *"Simulate Next Stage →"* triggers `PATCH /api/orders/ord_001` and mutates the cache optimistically.

---

### Exception 2: Debounced Search-as-you-Type (`app/menu/SearchBox.jsx`)
* **How It Buffers Keystrokes:**  
  Input state `term` is buffered through `useDebounce(term, 300)`. If empty, the query key is declaratively set to `null` (`debounced.trim() ? ... : null`).
* **Verification in Network Tab While Typing:**
  * **Typing 5 characters:** Typing **"t-i-b-s-!"** produces **exactly 1 network request** (`/api/dishes?q=tibs`) once typing pauses for 300ms.
  * **Zero requests** are fired for intermediate individual letters.
  * **`keepPreviousData: true`** ensures existing cards stay visible on screen during background validation, eliminating layout shift and card flickering.

---

## 4. Shared Fetcher & Non-OK Error Throwing

Implemented in [`lib/fetcher.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/fetcher.js):
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
* SWR requires the fetcher to reject or throw on non-200 status codes so that the hook sets `error`, allowing `<OrderStatus>` to show a recovery screen rather than rendering broken components.

---

## 5. Capstone Data Architecture Standard

1. Every query is classified as **Server** or **Client**.
2. Client queries are allowed **only** for user-typing inputs or autonomous background polling.
3. Every client query is seeded on the server via `fallbackData` — no white screen spinners for data the server already holds.
