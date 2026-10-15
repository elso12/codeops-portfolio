# DATA.md — Query Inventory & Caching Architecture

> **Addis Eats · Mesob House Restaurant**  
> **Module 3 · Day 16 (Day 41) · Live Data with SWR & React Query**

---

## 1. Query Inventory

| Query / Feature | Query Key | Hook & Library | Refresh Rule | One Line of Reasoning |
| :--- | :--- | :--- | :--- | :--- |
| **Order Status Polling** | `/api/orders/${id}` | `useSWR(key, fetcher, { fallbackData, refreshInterval: 5000 })` | `refreshInterval: 5000` (polls every 5s); `revalidateOnFocus: true` | Kitchen ticket status changes unpredictably during preparation and delivery, so periodic polling guarantees fresh updates without requiring web sockets. |
| **Menu Search-as-you-type** | `debounced ? \`/api/dishes?q=\${debounced}\` : null` | `useSWR(key, fetcher, { keepPreviousData: true })` | `refreshInterval: 0` (no polling); `revalidateOnFocus: false`; conditional `null` key | Search results change only in response to user keystrokes; passing `null` when empty prevents pointless queries, and `keepPreviousData` stops the list from flashing empty between terms. |
| **Paged Banquet Dishes** | `/api/dishes?page=${page}` | `useSWR(key, fetcher, { fallbackData, keepPreviousData: true })` | `refreshInterval: 0`; `revalidateOnFocus: false`; `keepPreviousData: true` | Menu catalog is relatively static and user-navigated; keeping previous results visible prevents layout shifts, while the URL query string keeps pages bookmarkable and shareable. |
| **Single Dish Detail** | RSC (`getDishById(id)`) | Direct Server Component / ISR | `revalidate: 3600` | Prerendered on the server with ISR because dish descriptions and base prices change rarely and should be crawled by search engines. |
| **My Orders List** | RSC (`getOrdersByUser(userId)`) | Direct Server Component | `revalidatePath("/orders")` on writes | Order list is read server-side on arrival and revalidated whenever `placeOrder` or `cancelOrder` server actions commit a write. |

---

## 2. Justification of Refresh Rules & Intervals

1. **`refreshInterval: 5000` on `/api/orders/${id}`:**
   - *Reasoning:* A customer waiting for food in Addis Ababa checks progress over several minutes; a 5-second polling interval feels responsive without overloading the server or burning mobile data.
2. **`fallbackData: initial` on `/orders/[id]` and `/menu`:**
   - *Reasoning:* The server renders the initial record directly from the database, eliminating the loading spinner on first paint and guaranteeing that search crawlers index full content.
3. **`null` Key on `SearchBox` when `term` is empty:**
   - *Reasoning:* Wrapping hooks in `if` statements violates React Hook rules; passing `null` as the SWR key declaratively pauses fetching until the user has typed a meaningful query.
4. **`keepPreviousData: true` on Search & Pagination:**
   - *Reasoning:* Prevents UI flickering and layout shifts by holding existing cards on screen while the background network request for the new term or next page completes.
5. **Shared `lib/fetcher.js` with non-OK Error Throwing:**
   - *Reasoning:* SWR requires the fetcher to reject or throw when `res.ok === false` (e.g. 401, 403, 404, 500) so that the hook sets `error` and exposes error states to components.

---

## 3. The Three Client-Side Data Problems Solved

### Problem 1: Order Status Screen (Server-Rendered + Live Polling)
- **Previous naive approach:** A client component with `useState` and `useEffect` with `setInterval`. Resulted in a white loading spinner on initial visit, potential memory leaks if unmounted improperly, and stale responses overwriting newer responses.
- **SWR solution:**
  1. `app/orders/[id]/page.js` is a Server Component that reads the order and hands it to `<OrderStatus id={id} initial={order} />`.
  2. `OrderStatus.jsx` calls `useSWR('/api/orders/' + id, fetcher, { fallbackData: initial, refreshInterval: 5000 })`.
  3. No `useState` for order data, no `useEffect` needed.
  4. First paint arrives pre-filled with zero spinner. Every 5 seconds, SWR quietly polls `/api/orders/${id}`.

### Problem 2: Menu Search (Debounced + Race-Safe + No Flashing)
- **Previous naive approach:** Firing a `fetch` on every `onChange` event (5 requests for a 5-letter word) and `list` resetting to empty or showing an old response arriving after a newer one.
- **SWR solution:**
  1. Keystrokes are buffered with `useDebounce(term, 300)`.
  2. If `debounced` is empty, query key is `null` (zero requests sent).
  3. Typing 5 characters within 300ms produces **exactly 1 network request**.
  4. `keepPreviousData: true` holds the previous search results while the new query is in flight — the list never blinks empty.
  5. SWR ensures the response rendered always corresponds to the latest key, completely eliminating race conditions.

### Problem 3: Paged Dish List (Linkable + Shareable + Smooth)
- **Previous naive approach:** Page number kept in local component state; switching pages caused the entire grid to collapse into a loading spinner, and the page could not be linked or refreshed.
- **SWR solution:**
  1. The page number resides in the browser query string (`/menu?page=2`), readable via `useSearchParams()`.
  2. First page (or linked page) is loaded on the server and passed as `fallbackData`.
  3. SWR queries `/api/dishes?page=${currentPage}` with `keepPreviousData: true`.
  4. Clicking "Next" updates the URL and transitions smoothly without removing the current cards until new ones arrive.

---

## 4. Check Yourself Verification

| Question | Answer & Technical Explanation |
| :--- | :--- |
| **Does typing five characters fire one request or five?** | **Exactly one request.** The `useDebounce` hook buffers state changes for 300ms. Each keystroke resets the debounce timer, so typing 5 characters smoothly triggers only one SWR key change and one fetch. |
| **Does the order page show data immediately, with no spinner?** | **Yes, immediately.** The Server Component fetches `getOrderById(id)` on the server and supplies it to `useSWR` via `fallbackData`. The initial HTML contains the order, rendering without any loading placeholder. |
| **Do two components asking for the same key produce one network call?** | **Yes, exactly one call.** SWR automatically deduplicates concurrent requests for identical keys within the `dedupingInterval` (default 2000ms), sharing both the in-flight promise and the resulting cache entry. |
| **Does the list keep previous results visible while the next load runs?** | **Yes.** Enabling `keepPreviousData: true` instructs SWR to retain the previous key's cached data while fetching the new key, eliminating blank state flashes. |
| **Can you justify every refreshInterval and staleTime in one sentence?** | `refreshInterval: 5000` is justified because order fulfillment progresses every few seconds and needs live tracking, while menu queries set `refreshInterval: 0` because dish catalogs change infrequently and should only refetch upon deliberate user action. |
