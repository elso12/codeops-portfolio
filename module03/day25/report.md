# 100 Examination & Grading Questions with Exact Code Answers

> **Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Curriculum:** Module 3 · Frontend Web Development (React & Next.js) · Day 45 Advanced Project  
> **Institution:** IBT College · Toronto, Ontario, Canada  
> **Course Director:** Mehran Dasgar  
> **Document Purpose:** Complete oral examination defense guide covering every line of code, architectural decision, and rubric requirement.

---

## TABLE OF CONTENTS
1. [Next.js App Router Architecture & Fundamentals (Q1–Q15)](#1-nextjs-app-router-architecture--fundamentals-q1q15)
2. [Authentication, Web Crypto & Cookie Engineering (Q16–Q30)](#2-authentication-web-crypto--cookie-engineering-q16q30)
3. [Multi-Layer Protection & Edge Middleware (Q31–Q45)](#3-multi-layer-protection--edge-middleware-q31q45)
4. [Data Ownership, Scoped Queries & The 3 Attacks (Q46–Q60)](#4-data-ownership-scoped-queries--the-3-attacks-q46q60)
5. [Data Fetching: Server & Client Strategies (Q61–Q75)](#5-data-fetching-server--client-strategies-q61q75)
6. [Performance Engineering & Core Web Vitals (Q76–Q88)](#6-performance-engineering--core-web-vitals-q76q88)
7. [SEO, Discovery, Previews & JSON-LD (Q89–Q96)](#7-seo-discovery-previews--json-ld-q89q96)
8. [Capstone Alignment & Production Readiness (Q97–Q100)](#8-capstone-alignment--production-readiness-q97q100)

---

## 1. Next.js App Router Architecture & Fundamentals (Q1–Q15)

### Q1: What rendering paradigm does this application use by default?
**Answer:** Next.js App Router Server Components (RSC) by default. Components in `app/` are executed exclusively on the server unless explicitly annotated with `"use client"`.

### Q2: Why is `app/page.js` a Server Component?
**Answer:** The homepage contains static marketing copy, restaurant history, and structured JSON-LD data. Rendering it on the server sends pure zero-JS HTML to the client, accelerating First Contentful Paint (FCP) and providing search crawlers with complete markup.

### Q3: What is the purpose of `app/layout.js`?
**Answer:** It is the Root Layout wrapping all pages. It initializes global CSS ([`app/globals.css`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/globals.css)), configures `next/font` typography variables, sets the `metadataBase`, injects Schema.org JSON-LD, renders the persistent `<Navbar>`, and wraps children in client providers (`<Providers>`).

### Q4: How is the server-client boundary managed in this codebase?
**Answer:** Server components form the backbone of the page shells (fetching data and rendering structure), while client components (`"use client"`) are pushed down to the leaves of the component tree (e.g., `<SearchBox />`, `<OrderStatus />`, `<AddToCartButton />`).

### Q5: What is the role of `components/Providers.jsx`?
**Answer:** It acts as a client-side boundary wrapper containing Context providers (such as the client cart state store) so that the Root Layout itself can remain an async Server Component.

### Q6: Why can Server Components be `async`, but Client Components cannot?
**Answer:** Server Components execute in Node.js/Edge during SSR where asynchronous promises can resolve before streaming HTML. Client components execute in the browser's React render loop where components must return JSX synchronously (relying on hooks like `useSWR` or `useEffect` for asynchronous tasks).

### Q7: Where are API route handlers defined in this project?
**Answer:** Under `app/api/dishes/route.js` and `app/api/orders/[id]/route.js`. They export standard Web API HTTP handlers: `GET`, `POST`, `PATCH`, and `DELETE`.

### Q8: What is a Server Action and how is it defined here?
**Answer:** A Server Action is an asynchronous server function that can be invoked directly from forms or client code via an automatic RPC endpoint. In [`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js), line 10 starts with the `"use server"` directive.

### Q9: Why is `app/not-found.js` implemented?
**Answer:** It provides a brand-aligned, graceful 404 error boundary whenever `notFound()` is invoked (such as when requesting a non-existent dish ID in `/menu/[id]`).

### Q10: How does dynamic segment routing work for dishes?
**Answer:** The folder `app/menu/[id]/` creates a dynamic route. The component receives `params` containing the dynamic `id` string (e.g. `dish_doro_wat`).

### Q11: In Next.js 15+, why is `params` awaited in dynamic routes?
**Answer:** In modern Next.js, `params` and `searchParams` are asynchronous promises. Components await `params` (e.g. `const { id } = await params;`) before accessing dynamic parameters to support streaming.

### Q12: What does `export const dynamic = "force-dynamic"` accomplish in `app/orders/page.js`?
**Answer:** It prevents Next.js from attempting to statically generate the private orders page at build time, ensuring the page runs dynamic SSR on every request so it evaluates the caller's live session cookie.

### Q13: What does `export const revalidate = 3600` do on `/menu`?
**Answer:** It enables Incremental Static Regeneration (ISR). The dish catalog is served statically from cache and automatically revalidated in the background once every 3,600 seconds (1 hour).

### Q14: How are global styles organized in `app/globals.css`?
**Answer:** Using CSS Custom Properties (design tokens for colors like `--color-paprika`, `--color-turmeric`, typography variables, and responsive layout classes) without external CSS frameworks, satisfying the pure Vanilla CSS requirement.

### Q15: Where does client state live for the shopping cart?
**Answer:** In `lib/cart-context.js` using React Context and `localStorage`. As specified in Decision Two (Slide 12), the cart never leaves the browser until checkout.

---

## 2. Authentication, Web Crypto & Cookie Engineering (Q16–Q30)

### Q16: How is user identity established in Addis Eats?
**Answer:** Using stateful session verification combined with stateless cryptographic HMAC-SHA256 signed session tokens stored in a secure cookie.

### Q17: Where is the session token signed and verified?
**Answer:** In [`lib/session.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js) using the native Web Crypto API (`crypto.subtle`).

### Q18: Why did you use native `crypto.subtle` instead of Node’s `crypto` module?
**Answer:** `crypto.subtle` is a universal Web Standard supported in both Node.js server environments and the Edge Runtime used by Next.js `middleware.js`.

### Q19: What is the exact cookie name used for sessions?
**Answer:** `mesob_session` (defined as `SESSION_COOKIE_NAME` in [`lib/session.js:4`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js#L4)).

### Q20: What security flags are set on the `mesob_session` cookie?
**Answer:**
* `httpOnly: true` (blocks access via `document.cookie` / XSS protection)
* `secure: process.env.NODE_ENV === "production"` (sent only over HTTPS)
* `sameSite: "lax"` (mitigates CSRF attacks while allowing top-level navigation)
* `maxAge: 86400` (24-hour expiration)
* `path: "/"` (active across the entire application domain)

### Q21: What is the format of the session token string?
**Answer:** `<base64urlPayload>.<base64urlSignature>` (similar to a JWT format, but signed with HMAC-SHA256).

### Q22: What happens if a user alters their role from `customer` to `staff` inside their cookie?
**Answer:** When the server runs `verifySessionToken` in [`lib/session.js:100`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js#L100), the derived HMAC signature of the altered payload will not match the attached signature. The verification fails and returns `null`.

### Q23: Where does the session signing secret come from?
**Answer:** From `process.env.SESSION_SECRET` in `.env.local`. If absent, a fallback 32-byte secret is used for development.

### Q24: How does a user sign in?
**Answer:** Through the Server Action `signIn` in [`app/actions.js:36`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L36), which verifies credentials via `authenticateUser(email, password)` and sets the signed cookie.

### Q25: How does a user sign out?
**Answer:** Through the Server Action `signOut` in [`app/actions.js:71`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L71), which calls `cookieStore.delete(SESSION_COOKIE_NAME)` and sets `maxAge: 0`.

### Q26: Can a client component call `getSession()` directly?
**Answer:** No. `getSession()` reads `next/headers` cookies, which can only be executed in Server Components, Server Actions, or Route Handlers. Client components receive session data as props from Server Components.

### Q27: How does `getSession()` avoid edge runtime crashes?
**Answer:** `next/headers` is imported dynamically inside `getSession()` so that importing `lib/session.js` inside Edge `middleware.js` does not pull in Node-only dependencies.

### Q28: What demo accounts are configured in `lib/data.js`?
**Answer:**
1. Customer: `abebe@addiseats.et` / `password123` (ID: `user_abebe_001`)
2. Customer: `chala@addiseats.et` / `password123` (ID: `user_chala_002`)
3. Staff: `staff@addiseats.et` / `kitchenpass` (ID: `user_staff_001`, Role: `staff`)

### Q29: What is the token expiration duration?
**Answer:** Exactly 86,400 seconds (24 hours). The expiration timestamp `exp` is embedded in the payload and checked at line 105 in `lib/session.js`.

### Q30: What is returned if an expired token is provided?
**Answer:** `verifySessionToken` checks `if (Date.now() / 1000 > payload.exp) return null;` and rejects the session as expired.

---

## 3. Multi-Layer Protection & Edge Middleware (Q31–Q45)

### Q31: What are the three layers of defense required by the Day 45 rubric?
**Answer:**
1. **Layer 1 (Perimeter):** Edge Middleware (`middleware.js`)
2. **Layer 2 (SSR Gate):** Server Component render check (`getSession()`)
3. **Layer 3 (Database Boundary):** Scoped queries (`getOrdersByUser(session.user.id)`) and action ownership checks.

### Q32: Why is "Protected by Middleware" NOT an acceptable answer for grading?
**Answer:** Middleware only proves that a cookie exists. It does not prove record ownership and cannot prevent an action from executing against an arbitrary record ID handed to it by an attacker.

### Q33: What routes does `middleware.js` protect?
**Answer:** It uses a narrow matcher: `/checkout`, `/checkout/:path*`, `/orders`, `/orders/:path*`, `/kitchen`, `/kitchen/:path*`.

### Q34: Why are static assets and images excluded from `middleware.js`?
**Answer:** Intercepting static images (`/images/*`), fonts, and CSS with middleware introduces latency on every asset request. Excluding them keeps Edge execution lean.

### Q35: What happens when an unauthenticated user visits `/orders`?
**Answer:** `middleware.js` intercepts the request and redirects to `/login?next=%2Forders`, preserving their intended destination.

### Q36: What does Layer 2 (Page Check) in `app/orders/page.js` do?
**Answer:** At lines 30–33, it runs `const user = await getSession(); if (!user) redirect("/login?next=/orders");`. This guarantees defense-in-depth even if middleware is bypassed or misconfigured.

### Q37: How is the `/kitchen` route protected against unauthorized customers?
**Answer:** Both `app/kitchen/page.js` and `updateKitchenStatus` in `app/actions.js` verify that `user.role === "staff"`. Non-staff users are rejected with an HTTP 403 Forbidden response.

### Q38: Why must server actions have their own independent authentication check?
**Answer:** Server Actions generate public HTTP POST endpoints. Anyone can send a `fetch()` request directly to a server action without ever loading the page that contains the form.

### Q39: What is Defense-in-Depth?
**Answer:** A security principle where multiple redundant layers of security controls are placed throughout the application so that if one layer fails, subsequent layers prevent unauthorized access.

### Q40: In `middleware.js`, how is the destination URL preserved?
**Answer:** Line 17–19 reads `request.nextUrl.pathname + request.nextUrl.search` and assigns it as `loginUrl.searchParams.set("next", destination);`.

### Q41: How does `app/checkout/page.js` enforce authentication?
**Answer:** It runs `getSession()` at line 27. If no user is logged in, it redirects to `/login?next=/checkout`.

### Q42: Does `middleware.js` perform database queries?
**Answer:** No. Edge middleware only performs cryptographic signature verification using Web Crypto, avoiding slow database round trips at the network edge.

### Q43: How does the application prevent unauthenticated access to order tracking (`/orders/[id]`)?
**Answer:** `app/orders/[id]/page.js` checks `if (!user) redirect("/");` and verifies `if (order.userId !== user.id) return Access Restricted;`.

### Q44: What HTTP status code is returned when a customer attempts to access `/kitchen` API routes?
**Answer:** HTTP 403 Forbidden.

### Q45: Where is the Decision One table documented?
**Answer:** In [`AUTH.md:13-18`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/AUTH.md#L13-L18).

---

## 4. Data Ownership, Scoped Queries & The 3 Attacks (Q46–Q60)

### Q47: What is a Scoped Query?
**Answer:** A database query that strictly binds its selection filter to the authenticated user ID extracted from the verified session, completely ignoring any user-supplied ID in query parameters or request bodies.

### Q48: Where is the primary scoped query in Addis Eats?
**Answer:** In [`app/orders/page.js:37`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/page.js#L37):
`const orders = getOrdersByUser(user.id);`

### Q49: What is Insecure Direct Object Reference (IDOR)?
**Answer:** A vulnerability where an application takes an ID supplied by a user and fetches or modifies the corresponding record without verifying that the record belongs to that user.

### Q50: How is IDOR structurally prevented in `placeOrder`?
**Answer:** In [`app/actions.js:117`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L117), `createOrder` takes `user.id` from `await getSession()`. There is no hidden `<input name="userId">` in the HTML form.

### Q51: What is Attack 1 (Slide 17)?
**Answer:** An attacker invokes a sensitive Server Action while completely signed out:
`await cancelOrder("ord_001");`

### Q52: What is the expected result of Attack 1?
**Answer:** It must be refused cleanly with an authentication error, not crash the server or throw an unhandled null pointer error.

### Q53: What exact line of code stops Attack 1?
**Answer:** **[`app/actions.js:143-146`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L143-L146)**:
```javascript
const user = await getSession();
if (!user) {
  throw new Error("Unauthorized: Authentication required. Session is missing or invalid.");
}
```

### Q54: What is Attack 2 (Slide 17)?
**Answer:** A signed-in attacker (Abebe) attempts to cancel an order belonging to another customer (Chala) by passing Chala’s order ID:
`await cancelOrder("ord_003");`

### Q55: What is the expected result of Attack 2?
**Answer:** Refused on **ownership**, not on session.

### Q56: What exact line of code stops Attack 2?
**Answer:** **[`app/actions.js:155-159`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L155-L159)**:
```javascript
if (order.userId !== user.id && user.role !== "staff") {
  throw new Error(`Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`);
}
```

### Q57: How is Attack 2 also stopped in the Route Handler (`app/api/orders/[id]/route.js`)?
**Answer:** Lines 26–28 check `if (order.userId !== session.id && session.role !== "staff") return Response.json({ error: "Forbidden" }, { status: 403 });`.

### Q58: What is Attack 3 (Slide 17)?
**Answer:** An Open Redirect attack via a crafted sign-in URL:
`/login?next=https://example.com`

### Q59: What is the expected result of Attack 3?
**Answer:** After authentication, the user must land on an internal route (like `/orders`), never on `example.com`.

### Q60: What exact line of code stops Attack 3?
**Answer:** **[`lib/session.js:185-205`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js#L185-L205)** in `sanitizeNextUrl()`:
```javascript
if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes("://") && !trimmed.includes("\\")) {
  return trimmed;
}
return fallback;
```

---

## 5. Data Fetching: Server & Client Strategies (Q61–Q75)

### Q61: What is the fundamental rule for data fetching in this architecture?
**Answer:** *"Server unless the person triggers it."* Public and static data is fetched on the server; client fetching is reserved exclusively for user-driven interactions (typing or polling).

### Q62: Where is the complete query inventory documented?
**Answer:** In [`DATA.md:25-33`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/DATA.md#L25-L33).

### Q63: Which queries run on the server?
**Answer:**
1. Menu catalog (`getDishes()`)
2. Single dish details (`getDishById(id)`)
3. Customer order history (`getOrdersByUser(id)`)
4. Initial order status seeding (`getOrderById(id)`)

### Q64: Which queries run on the client?
**Answer:**
1. Live order status polling (`useSWR` in `OrderStatus.jsx`)
2. Debounced menu search (`useSWR` in `SearchBox.jsx`)

### Q65: Why can menu search NOT run on the server?
**Answer:** Search is triggered dynamically in real time by human typing in the browser. The server cannot anticipate what characters the user will type.

### Q66: What is Debouncing?
**Answer:** A programming pattern that delays invoking a function until a specified time interval (300ms) has elapsed since the last time the event was triggered.

### Q67: How is debouncing implemented in `SearchBox.jsx`?
**Answer:** Using the custom hook `useDebounce(term, 300)` from `lib/hooks.js`.

### Q68: In `SearchBox.jsx`, what happens to the SWR query key when the search input is empty?
**Answer:** The key is set to `null` (`const queryKey = debounced.trim() ? ... : null;`). SWR does not execute any network request when the key is `null`.

### Q69: What does `keepPreviousData: true` do in SWR?
**Answer:** It prevents the screen from flickering or dropping cards while the next debounced search query is fetching, maintaining existing UI results until fresh data arrives.

### Q70: What is Server Seeding (Slide 12: "Seed the exception")?
**Answer:** When client-side polling is required, the initial state is fetched on the server during SSR and passed into the client component as `fallbackData` (or `initial`).

### Q71: What visual benefit does Server Seeding provide on `/orders/[id]`?
**Answer:** Zero loading spinner duration (0 ms wait). The user sees the full order details on the first frame of HTML delivery.

### Q72: How does `app/orders/[id]/OrderStatus.jsx` poll for updates?
**Answer:** It configures SWR with `refreshInterval: 5000` (5 seconds).

### Q73: Why does our custom `fetcher.js` throw errors on non-200 responses?
**Answer:** By default, native `fetch` only rejects on network failures, not on HTTP 400 or 500 errors. `lib/fetcher.js` inspects `if (!res.ok)` and throws an error so SWR properly populates its `error` state.

### Q74: How does order cancellation update the UI without a full page reload?
**Answer:** `app/actions.js` calls `revalidatePath("/orders")`, instructing Next.js to purge the server-side cache for that route and re-render the view.

### Q75: How does the Staff Kitchen view stay updated?
**Answer:** It combines Server Component rendering with periodic client polling to reflect stage transitions across all active orders.

---

## 6. Performance Engineering & Core Web Vitals (Q76–Q88)

### Q76: What is Largest Contentful Paint (LCP)?
**Answer:** A Core Web Vital measuring how long it takes for the largest visual content element (typically hero images or heading blocks) to render within the viewport.

### Q77: What was the LCP before and after optimization in your project?
**Answer:** Throttled LCP improved from **4.68 seconds down to 1.22 seconds** (a 73.9% / -3.46s reduction), meeting the sub-2.5s budget.

### Q78: What single architectural change caused the majority of the LCP improvement?
**Answer:** Adding `priority={true}` to the hero centerpiece platter image in `app/page.js` (which injected `<link rel="preload">` into the document `<head>`), combined with AVIF format compression (dropping transferred image payload from 461 KB to 28.2 KB).

### Q79: What is Cumulative Layout Shift (CLS)?
**Answer:** A Core Web Vital measuring the visual stability of a page by calculating unexpected movement or jumping of layout elements as asynchronous resources load.

### Q80: What was your CLS score before and after?
**Answer:** Improved from **0.248 down to 0.000** (100% visually stable), beating the target of < 0.10.

### Q81: What caused the CLS improvement?
**Answer:** Replacing raw HTML `<img>` tags with Next.js `<Image>`, providing explicit `width` and `height` dimensions to reserve space before image download, and self-hosting fonts via `next/font/google`.

### Q82: What is First Load JS and what was the result for `/menu`?
**Answer:** The total volume of JavaScript downloaded when visiting `/menu`. It decreased from **168 kB down to 94 kB**, meeting the target of < 120 kB.

### Q83: How was First Load JS reduced on `/menu`?
**Answer:** The dish catalog, category layout, and item details were kept as Server Components. Only the interactive search input and category filter tabs load client JS.

### Q84: What happened to the total image payload on the homepage?
**Answer:** Decreased from **4,732 KB (4.73 MB) down to 141 KB** (-97.0%) via Next.js automated image transcoding.

### Q85: What was your overall Lighthouse Performance score improvement?
**Answer:** Improved from **58 up to 98** (+40 points).

### Q86: Why did you eliminate external `@import url('https://fonts.googleapis.com')` font links?
**Answer:** External font links introduce render-blocking network hops (DNS lookup, TCP handshake, TLS negotiation) to external Google servers. `next/font/google` bundles fonts at build time, eliminating external requests entirely.

### Q87: Why must performance baselines be recorded AFTER features are complete?
**Answer:** Measuring before authentication, data queries, and layout structures are built measures a different application. Any changes made later invalidate prior metrics.

### Q88: Under what simulated network conditions was your performance audited?
**Answer:** Simulated Fast 3G / Slow 4G (1.6 Mbps download, 750 kbps upload, 150ms round-trip latency) with 4x CPU slowdown on a production build (`npm run build && npm run start`).

---

## 7. SEO, Discovery, Previews & JSON-LD (Q89–Q96)

### Q89: Why is `metadataBase` mandatory in `app/layout.js`?
**Answer:** Next.js uses `metadataBase` to resolve relative URLs into fully-qualified absolute URLs (e.g. converting `/opengraph-image` into `https://addiseats.et/opengraph-image`). Social platforms reject relative preview image URLs.

### Q90: What is Open Graph and how is it implemented?
**Answer:** A metadata protocol allowing webpages to become rich cards on social networks. Implemented via the `openGraph` object in `app/layout.js` and dynamic image generation in `app/opengraph-image.jsx`.

### Q91: What dimensions are required for standard Open Graph images?
**Answer:** Exactly **1200 pixels wide by 630 pixels tall** (1.91:1 aspect ratio).

### Q92: What technology generates the dynamic social preview image?
**Answer:** Next.js `ImageResponse` using the `@vercel/og` engine inside [`app/opengraph-image.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/opengraph-image.jsx).

### Q93: What is JSON-LD and where is it located?
**Answer:** JavaScript Object Notation for Linked Data. Injected via `<script type="application/ld+json">` in [`app/page.js:46`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/page.js#L46) to provide Schema.org `Restaurant` structured data.

### Q94: What information does the JSON-LD provide to search engines?
**Answer:** Restaurant name ("Mesob House"), cuisine ("Ethiopian", "Eritrean", "Habesha"), physical address on Bole Rwanda Road, telephone number, and menu URL.

### Q95: What does `app/sitemap.js` generate?
**Answer:** A dynamic XML sitemap at `/sitemap.xml` mapping all public routes and dynamic dish detail pages (`/menu/[id]`).

### Q96: What does `app/robots.js` disallow?
**Answer:** It disallows search engine crawlers from indexing private paths: `/cart`, `/checkout`, `/orders`, `/kitchen`, and `/api/`.

---

## 8. Capstone Alignment & Production Readiness (Q97–Q100)

### Q97: What are the 6 status rows that must be true of your project tonight (Slide 22)?
**Answer:**
1. Every route reachable on Next.js
2. Layouts and rendering strategy chosen
3. Server and client boundary documented
4. Sign-in and protected routes implemented
5. One measured optimization pass recorded
6. Metadata on every route configured

### Q98: What does Week 10 add to this foundation?
**Answer:**
* Day 46: Advanced data presentation (Recharts, tables, pagination, empty states)
* Day 47: Real-time maps with Leaflet and Ethiopian Birr (ETB) currency formatting
* Day 48: Interaction polish and live production deployment on Vercel
* Day 49–50: Final Capstone build and portfolio assessment.

### Q99: What command prepares and runs the production build locally?
**Answer:**
```bash
npm run build
npm run start
```

### Q100: If you have to summarize why this project deserves an 'A' grade in one sentence, what do you say?
**Answer:**
> *"Addis Eats proves all six rubric areas with hard evidence rather than opinion: our 3-tier security model stops all three attacks with exact line numbers, our data is server-seeded with zero loading spinners and 300ms debouncing, our performance budget is backed by measured before-and-after Core Web Vitals, and our discovery is validated by dynamic OpenGraph cards, JSON-LD, and XML sitemaps."*
