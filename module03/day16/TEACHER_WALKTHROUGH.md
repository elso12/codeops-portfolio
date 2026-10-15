# Addis Eats (Mesob House) — Teacher Presentation & Defense Guide
**IBT College Canada · CodeOps Full Stack Software Development**  
**Module 3 · Frontend: React & Next.js · Day 41 (Day 16) Live Data with SWR**

---

## ⏱️ 8-Minute Presentation Timeline

| Time | Section | What to Say / Demonstrate | Key Files to Reference |
| :--- | :--- | :--- | :--- |
| **0:00 – 1:30** | **Architectural Evolution & Problem Statement** | Explain why raw `useEffect` + `setInterval` causes memory leaks, flashing spinners, and race conditions. Introduce SWR's *Stale-While-Revalidate* RFC 5861 strategy. | [`README.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/README.md), [`lib/fetcher.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/lib/fetcher.js) |
| **1:30 – 3:30** | **Live Order Status Polling & `fallbackData`** | Navigate to `/orders/ord_001`. Show the live pulse indicator. Explain how the Server Component queries the database and seeds `fallbackData` for zero initial spinner, then SWR polls every 5s (`refreshInterval: 5000`). | [`app/orders/[id]/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/app/orders/[id]/page.js), [`app/orders/[id]/OrderStatus.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/app/orders/[id]/OrderStatus.jsx) |
| **3:30 – 5:30** | **Debounced Search & Network Tab Inspection** | Open the browser DevTools Network tab. Type a 5-character search term rapidly (`tibs `). Prove that **zero intermediate requests** fire, and exactly **one request** fires 300ms after typing stops. Clear the search and prove the `null` key sends 0 requests. Show `keepPreviousData: true` preventing layout flash. | [`app/menu/SearchBox.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/app/menu/SearchBox.jsx), [`lib/hooks.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/lib/hooks.js) |
| **5:30 – 7:00** | **URL Query-String Pagination & DATA.md** | Navigate to `/menu?page=2`. Show that the page number lives in the URL query string (bookmarkable, shareable). Demonstrate smooth page flipping where existing cards stay mounted until new items resolve (`keepPreviousData`). Walk through `DATA.md`. | [`app/menu/PagedDishList.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/app/menu/PagedDishList.jsx), [`DATA.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/DATA.md) |
| **7:00 – 8:00** | **SWR Caching Invariants & Q&A Defense** | Answer teacher follow-up questions: Request deduplication, cache key hashing, error throwing contract, and server vs client data fetching boundaries. | [`lib/fetcher.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/lib/fetcher.js), [`STRATEGY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day16/STRATEGY.md) |

---

## 🎯 Part 1 · How to Explain Each Slide & Exercise (One by One)

### Exercise 1: Shared SWR Fetcher (`lib/fetcher.js`)

#### What to tell the teacher:
> *"SWR is completely agnostic to how data is fetched; it only accepts a key and a promise-returning function. However, SWR relies strictly on rejected promises to trigger its `error` state. In `lib/fetcher.js`, we implemented a robust fetcher that checks `!res.ok`, attaches status codes and server JSON error details to a custom error object, and throws immediately. Without this, HTTP 404 or 500 responses would be treated as successful data."*

```javascript
// lib/fetcher.js
export default async function fetcher(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching data.");
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }
  return res.json();
}
```

---

### Exercise 2 & 3: Order Status Screen & 5s Polling (`app/orders/[id]/OrderStatus.jsx`)

#### What to tell the teacher:
> *"In a traditional React app, developers write a `useEffect` with `setInterval` and `clearInterval`, along with 3 separate `useState` variables for data, loading, and error. This is fragile: unmounting can cause state updates on dead components, tab switches continue hammering the API, and network errors aren't retried gracefully.  
> We converted the tracker to `useSWR('/api/orders/' + id, fetcher, { refreshInterval: 5000 })`. SWR automatically polls every 5 seconds, pauses when the user switches tabs, resumes instantly on focus, and handles component unmounting cleanly."*

---

### Exercise 4: Server Component Seeding `fallbackData` (`app/orders/[id]/page.js`)

#### What to tell the teacher:
> *"If you rely entirely on client-side fetching for an order details page, the customer sees an annoying blank screen or loading spinner on arrival, and search crawlers see nothing.  
> In our architecture, `app/orders/[id]/page.js` is an asynchronous Server Component. It queries the data layer directly (`getOrderById(id)`) with zero internal HTTP overhead, renders the initial order into pure server HTML, and passes it to `<OrderStatus>` via `fallbackData: initial`.  
> The result: **First paint has real content immediately with zero loading spinner**, and SWR takes over seamlessly for subsequent background polls."*

---

### Exercise 5 & 6: Debounced Search, `null` Key, and `keepPreviousData` (`app/menu/SearchBox.jsx`)

#### What to tell the teacher:
> *"Search-as-you-type introduces three classic bugs: request flooding, race conditions, and UI flickering. We solved all three:*
> 1. **300ms Debounce (`useDebounce`):** *Keystrokes are buffered so rapid typing doesn't send intermediate requests.*
> 2. **Conditional `null` Key:** *When the search input is empty, the SWR key evaluates to `null`. SWR treats `null` as 'do not fetch', avoiding wasted queries to `/api/dishes?q=`.*
> 3. **`keepPreviousData: true`:** *When moving from one search term to the next, SWR keeps the existing results mounted until the new query completes. The menu grid never blinks empty or causes layout jump.*
> 4. **Race Condition Prevention:** *If query A takes longer to return than query B, SWR discards query A because its key no longer matches the current state."*

---

### Exercise 7: Query-String Pagination & `DATA.md` (`app/menu/PagedDishList.jsx`)

#### What to tell the teacher:
> *"Component-level pagination using local state (`useState(1)`) has a fatal flaw: users cannot share a link to page 2, and pressing the browser's Back button fails.  
> We stored the pagination state in the URL search params (`/menu?page=2`). SWR's query key incorporates the parameter: `/api/dishes?page=${currentPage}`.  
> When the user clicks 'Next', we push the new query parameter using Next.js `useRouter()`. SWR detects the key change, fetches the new page, and `keepPreviousData: true` holds page 1's cards on screen until page 2 arrives."*

---

## 🔍 Live Network Tab Demonstration Guide

Run through this exact sequence when presenting:

1. Open Chrome DevTools (`F12`) and select the **Network** tab.
2. Filter requests by `Fetch/XHR`.
3. Open **[`http://localhost:3000/orders/ord_001`](http://localhost:3000/orders/ord_001)**:
   * **Point out:** The order renders immediately without a loading spinner because of `fallbackData`.
   * **Point out:** Look at the Network tab: every 5 seconds, a single `GET /api/orders/ord_001` fires automatically.
   * **Demonstrate:** Click the "Simulate Next Stage →" button to see the order step forward in real time.
4. Navigate to **[`http://localhost:3000/menu`](http://localhost:3000/menu)**:
   * **Inspect the search bar:** Point out the debug pill below the search input: `SWR Key: null (idle — no fetch)`.
   * **Rapidly type `shiro`:** Notice how the Network tab stays quiet while typing. Exactly 300ms after you stop typing, a single request fires: `GET /api/dishes?q=shiro`.
   * **Backspace to clear:** The SWR key returns to `null`, and zero network requests are made.
   * **Switch pages:** Click page 2 of the Banquet dishes. Show that the URL changes to `/menu?page=2`, allowing the link to be copied and shared.

---

## ❓ Tough Questions Teachers Ask & How to Answer

### Q1: "Why use SWR instead of React Query (TanStack Query)?"
> **Answer:** *"SWR is created by Vercel specifically for Next.js applications. It is extremely lightweight (~4kB), has zero setup boilerplate, natively accepts `fallbackData` seeded from Server Components, and provides automatic deduplication, revalidation on window focus, and background polling out of the box. React Query is also excellent, but for this architecture, SWR provides maximum performance with minimal bundle overhead."*

### Q2: "What happens if a user navigates away from the order tracker while polling is active?"
> **Answer:** *"With hand-rolled `setInterval`, forgetting to return a cleanup function causes memory leaks and `setState on unmounted component` warnings. With SWR, polling is tied to component lifecycle: as soon as `<OrderStatus>` unmounts, SWR automatically cancels pending timers and stops polling immediately."*

### Q3: "What prevents two components on the same page from firing duplicate requests for the same dish?"
> **Answer:** *"SWR implements global request deduplication using an internal cache keyed by URL. If two components invoke `useSWR('/api/dishes')` within the `dedupingInterval` (default 2,000ms), SWR sends only one single HTTP request over the network and shares the resulting promise and cached data across both components."*

### Q4: "Why shouldn't you wrap `useSWR` in an `if` statement when the query is empty?"
> **Answer:** *"React enforces the Rules of Hooks: hooks must be called in the exact same order on every render. Calling `if (searchTerm) useSWR(...)` crashes React with a hook order mismatch error. SWR solves this declaratively: passing `null` as the key tells SWR to conditionally pause fetching while keeping hook order intact."*

### Q5: "How does `keepPreviousData` improve Core Web Vitals?"
> **Answer:** *"Without `keepPreviousData`, changing search queries or page numbers causes the component to enter an `isLoading` state, collapsing the card grid and triggering Cumulative Layout Shift (CLS). With `keepPreviousData: true`, the previous list remains mounted at full size while the background request resolves, keeping CLS at zero and ensuring a smooth, app-like user experience."*
