# Module 3 Comprehensive Assessment & Defense Guide (ASSESSMENT.md)

> **Document Type:** Final Module Assessment Preparation & Scenario Defense Guide  
> **Course:** IBT College Canada CodeOps · Full Stack Software Development  
> **Module:** Module 3 · Frontend: React & Next.js · Day 50 (Week 10)  
> **Coverage:** React Core, Routing & Forms, Next.js App Router, Production Engineering, and Architectural Scenarios.

---

## Part 1: The Ten Concepts Most Often Missed (Core Technical Analysis)

### 1. Keys in a List: Why Array Index is Not a Stable ID
- **The Common Mistake:** Using `items.map((item, index) => <DishCard key={index} ... />)`.
- **The Technical Reality:** React uses keys to match existing fiber tree nodes with newly rendered nodes during reconciliation. When an array is reordered, sorted, or an item is deleted from the middle:
  - If keys are array indices (`0, 1, 2`), React maps the old node at index 0 to the new item at index 0.
  - Component local state (such as input values, open accordions, or animations) stays tied to index 0 rather than moving with the data item.
- **The Correct Approach:** Always use a unique, immutable, business-domain identifier (e.g., `item.id`, `dish.slug`, or UUID).
  ```jsx
  // CORRECT:
  {dishes.map((dish) => (
    <DishCard key={dish.id} dish={dish} />
  ))}
  ```

---

### 2. State Updates: Batching and the Functional Form
- **The Common Mistake:** Calling `setCount(count + 1)` multiple times sequentially expecting `count` to increase by 3.
- **The Technical Reality:** React batches state updates inside event handlers, promises, and timeouts (Automatic Batching in React 18 & 19) to prevent unnecessary re-renders. Reading `count` inside consecutive closures refers to the stale snapshot of state captured when the render function ran.
- **The Correct Approach:** Use the functional state updater callback `setState(prev => prev + 1)` whenever the next state depends on the previous state.
  ```jsx
  // CORRECT:
  const incrementTriple = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };
  ```

---

### 3. `useEffect` Cleanup: Subscriptions, Timers, and Memory Leaks
- **The Common Mistake:** Setting up `setInterval`, `addEventListener`, or WebSockets in `useEffect` without returning a teardown function.
- **The Technical Reality:** When a component unmounts or dependencies change, old listeners remain in browser memory, invoking handlers on unmounted components and causing memory leaks or race conditions. In React StrictMode (dev), effects run twice deliberately to expose missing cleanups.
- **The Correct Approach:** Always return an explicit cleanup function that cancels timers, unbinds event listeners, or aborts `fetch` requests via `AbortController`.
  ```jsx
  // CORRECT:
  useEffect(() => {
    const controller = new AbortController();
    const timer = setInterval(() => {
      fetchData({ signal: controller.signal });
    }, 5000);

    return () => {
      clearInterval(timer);
      controller.abort();
    };
  }, []);
  ```

---

### 4. The Server Boundary: Why Client Components Cannot Be `async`
- **The Common Mistake:** Writing `export default async function ClientComponent() { ... }` in a file with `"use client"`.
- **The Technical Reality:** 
  - **Server Components:** Execute in Node.js/Edge during SSR where React suspends and streams resolved HTML over the wire. They can be `async` functions that `await` database calls or promises directly.
  - **Client Components:** Execute within the browser's React reconciliation cycle. React component functions in the browser must return JSX synchronously. Returning a `Promise<JSX.Element>` from a client component causes React to throw a runtime error.
- **The Correct Approach:** Keep data-fetching async functions inside Server Components, or use React 19's `use(promise)` hook / SWR / TanStack Query in Client Components.

---

### 5. Rendering Strategy: How Reading Cookies Makes a Route Dynamic
- **The Common Mistake:** Expecting a route reading `cookies()` or `headers()` to be statically generated (SSG) at `next build` time.
- **The Technical Reality:** In Next.js App Router, cookies and request headers are runtime-specific request values. As soon as a Server Component or layout calls `await cookies()` or `await headers()`, Next.js automatically marks the entire route segment as **Dynamic Rendering (`ƒ`)**, executing it on every incoming request.
- **The Correct Approach:** If a page contains mostly public, cacheable data (e.g. `/menu`), do not read user session cookies in the root page component. Instead, fetch static data at build time, and read cookies inside dynamic leaf components or pass user state down via targeted slots.

---

### 6. Server Actions: Why Middleware is NOT the Security Check
- **The Common Mistake:** Believing that because `middleware.js` redirects unauthorized users away from `/orders`, backend server actions are protected.
- **The Technical Reality:** Every Server Action generates an independent, publicly accessible HTTP `POST` endpoint (identified by the `Next-Action` header). A malicious user or script can send raw HTTP POST requests directly to this endpoint with spoofed IDs, completely bypassing Edge middleware redirect rules.
- **The Correct Approach:** Implement authorization **inside the Server Action execution boundary itself**. Verify `getSession()` and compare `order.userId === session.user.id` on line 1 of the action before committing any write or database mutation.

---

### 7. Scoped Queries: Never Trust an ID from the Request
- **The Common Mistake:** Writing `const orders = await getOrdersByUserId(request.body.userId);` or reading `userId` from query parameters.
- **The Technical Reality:** Trusting client-supplied IDs leads to Insecure Direct Object References (IDOR). An attacker simply changes `userId=user_123` to `userId=user_456` in the request payload to view or alter another customer's private records.
- **The Correct Approach:** Always obtain the authenticated user identity strictly from the verified, cryptographically signed session cookie:
  ```javascript
  // CORRECT:
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  const orders = await getOrdersByUserId(session.id); // Scoped to verified session
  ```

---

### 8. `NEXT_PUBLIC`: Inlined at Build Time and Readable by Anyone
- **The Common Mistake:** Putting secret keys or private database tokens in environment variables prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_STRIPE_SECRET_KEY`).
- **The Technical Reality:** Next.js replaces all occurrences of `process.env.NEXT_PUBLIC_*` with their literal string values during the client webpack build. These values are bundled directly into public `.js` chunks and can be extracted by opening DevTools or viewing page source.
- **The Correct Approach:** Keep API secrets and private tokens in non-prefixed environment variables (`STRIPE_SECRET_KEY`, `SESSION_SECRET`). Access them solely within Server Components, Server Actions, or API Route Handlers.

---

### 9. `metadataBase`: Why Previews Fail Without It
- **The Common Mistake:** Defining OpenGraph images with relative paths (`openGraph: { images: ['/og-image.png'] }`) without configuring `metadataBase`.
- **The Technical Reality:** Social media platforms (Slack, WhatsApp, X, LinkedIn) parse OpenGraph meta tags via external web scrapers. Scrapers require fully qualified, absolute canonical URLs (e.g., `https://addis-eats.vercel.app/og-image.png`). Without `metadataBase` in the root layout, Next.js cannot resolve relative asset paths into valid absolute URLs, resulting in broken card previews.
- **The Correct Approach:** Declare `metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://addis-eats.vercel.app')` in `app/layout.js`.

---

### 10. Forms: `onSubmit` on the Form, Not `onClick` on the Button
- **The Common Mistake:** Attaching click handlers to buttons (`<button onClick={handleSave}>Submit</button>`) and using `<div className="form">`.
- **The Technical Reality:** 
  - Standard HTML form submission can be triggered by pressing `Enter` within any text field, which fires the form's `submit` event.
  - Attaching logic only to button `onClick` breaks `Enter` key accessibility and disrupts browser auto-fill, screen reader announcement, and native HTML5 constraint validation (`required`, `pattern`).
- **The Correct Approach:** Always use a native `<form onSubmit={handleSubmit}>` with a `<button type="submit">`, or bind directly to a Server Action via `<form action={serverAction}>`.

---

## Part 2: Architectural Judgement Scenarios (Assessment Defense)

### Scenario A: Real-Time Order Tracking Architecture
- **Problem:** Customers want to track their order status from "Received" to "Delivered" without manually refreshing.
- **Evaluation of Approaches:**
  - *Option 1 (Full WebSocket connection):* High server memory overhead per connection, requires sticky sessions, overkill for an update that occurs only 3 times over 30 minutes.
  - *Option 2 (Frequent short polling without seeding):* Results in loading spinners on mount and excessive database load.
  - *Option 3 (Hybrid: Server-rendered initial state + SWR 5s polling):* 
    - The Server Component fetches the current status on initial SSR (0ms blank screen / zero layout shift).
    - Client component seeds SWR with `fallbackData={initialStatus}`.
    - SWR polls `/api/orders/[id]` every 5 seconds, auto-pausing when the window is in the background (`revalidateOnFocus: false`).
- **Selected Approach & Justification:** Option 3 provides the optimal balance of user experience, zero flicker, minimal server resource consumption, and graceful HTTP fallback.

---

### Scenario B: Securing a Bulk Export Server Action
- **Problem:** An administrative endpoint allows exporting restaurant financial records.
- **Security Defense Strategy:**
  1. Edge middleware checks if a `mesob_session` cookie is present.
  2. Inside `exportFinancialsAction()`, parse and cryptographically verify the JWT/HMAC token.
  3. Query the user record and confirm `user.role === 'admin'`.
  4. Scope the date range and branch ID strictly to the administrator's authorized location.
  5. Log the export event with user ID and timestamp to an audit log.

---

## Part 3: Exemplar Exam Questions & Model Answers (Slide 17 Coverage)

### 1. Multiple Choice: Which of these makes a route dynamic?
- **Question:** Which operation in a Next.js Server Component or Route Handler automatically opts the route into Dynamic Rendering (`ƒ`)?
  - A) Importing an SVG icon from `lucide-react`
  - B) Calling `await cookies()` or `await headers()`
  - C) Exporting a `generateMetadata()` function
  - D) Using a `<Link href="/menu">` tag
- **Model Answer:** **B) Calling `await cookies()` or `await headers()`.**
- **Reasoning:** In Next.js App Router, cookies and request headers are runtime-specific request values. As soon as a server component or route handler reads dynamic request data, Next.js cannot prerender the output as a static HTML file at build time, switching the route segment to dynamic on-demand SSR.

---

### 2. Short Answer: Why must an `EventSource` be closed?
- **Question:** Why must an `EventSource` (Server-Sent Events) connection created in a React client component be explicitly closed in the cleanup phase?
- **Model Answer:** 
  An `EventSource` holds an open, persistent HTTP streaming connection with the server. If the component unmounts without calling `eventSource.close()`, the browser maintains the open socket in the background, consuming socket descriptors and memory on both client and server. Furthermore, incoming message events will continue firing on an unmounted component, causing memory leaks and state errors.

---

### 3. Read the Code: "This list re-renders wrongly — why?"
- **Question:** Review the following component snippet:
  ```jsx
  export function DishList({ dishes }) {
    return (
      <ul>
        {dishes.map((dish, index) => (
          <DishItem key={index} dish={dish} />
        ))}
      </ul>
    );
  }
  ```
  Why does deleting an item from the top or middle of this list produce incorrect UI state?
- **Model Answer:**
  Using the array `index` as a React `key` fails because indices are not stable identifiers. When the first item is deleted, the item originally at index 1 becomes index 0. React compares old key 0 with new key 0 and re-uses the existing DOM nodes and any internal component state (such as input text, expanded accordions, or transient animations) for the wrong dish. The fix is to use the unique, permanent domain identifier: `key={dish.id}`.

---

### 4. Scenario: "A page is slow on 3G. Diagnose in order."
- **Question:** Users on a 3G mobile network in Addis Ababa report that `/menu` takes over 6 seconds before any content is visible. Detail your structured diagnostic procedure in order of execution.
- **Model Answer:**
  1. **Measure with Network & Performance Throttling:** Open Chrome DevTools, apply "Fast 3G" or "Slow 3G" network throttling and 4x CPU slowdown, and capture a performance trace.
  2. **Audit Core Web Vitals (FCP & LCP):** Identify whether the delay is Server Time to First Byte (TTFB) or Client Download/Render:
     - If TTFB is > 2s: Check database query duration and un-cached server-side computations in Server Components.
     - If TTFB is fast but LCP is slow: Identify the Largest Contentful Paint candidate (usually a heavy hero image or font file).
  3. **Inspect the Waterfall & Asset Sizes:** Check the Network tab sorted by size:
     - Check image formats: Convert PNG/JPEG to WebP/AVIF and configure Next.js `<Image sizes="..." priority={true} />`.
     - Check First Load JavaScript: Check `next build` analysis; ensure `/menu` is under 100 kB by moving client libraries out of the root bundle.
  4. **Verify Font Display:** Ensure `next/font` has `display: swap` configured to prevent invisible text during font loading (FOIT).

---

### 5. Practical: "Fix the failing check in this component"
- **Question:** The following action allows any signed-in user to delete an order:
  ```javascript
  export async function deleteOrder(orderId) {
    const user = await getSession();
    if (!user) throw new Error("Unauthorized");
    
    // FAILING: Missing authorization check!
    await db.order.delete({ where: { id: orderId } });
    revalidatePath("/orders");
  }
  ```
  Fix the vulnerability to prevent horizontal privilege escalation (IDOR).
- **Model Answer:**
  ```javascript
  export async function deleteOrder(orderId) {
    // Check 1: Authentication check
    const user = await getSession();
    if (!user) throw new Error("Unauthorized: Please sign in.");
    
    // Check 2: Existence & Ownership authorization check
    const order = await db.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found.");
    
    if (order.userId !== user.id && user.role !== "admin") {
      throw new Error(`Forbidden: You do not have permission to delete order ${orderId}.`);
    }
    
    // Authorized database mutation
    await db.order.delete({ where: { id: orderId } });
    revalidatePath("/orders");
    return { ok: true };
  }
  ```

