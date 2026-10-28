# WALKTHROUGH.md — 8-Minute Capstone Presentation & Code Defense Guide

> **Institution:** IBT College · Toronto, Ontario, Canada  
> **Course:** CodeOps · Full Stack Software Development  
> **Module 3:** Frontend: React & Next.js · Day 49 (Week 10 Capstone)  
> **Course Director:** Mehran Dasgar  
> **Presenter:** Mehran Dasgar  
> **Deployment:** Local Production Server at `http://localhost:3000` *(built via `npm run build && npm run start`)*

---

## 1. The Eight-Minute Presentation Rehearsal Script

Use a timer on your phone and stick strictly to these blocks:

```
0:00 ──────────────── 1:00 ────────────── 3:00 ────────────── 5:00 ────────────── 6:00 ────────────── 7:00 ────────────── 8:00
│  Persona & Purpose  │   Live Main Flow   │ Technical Decision│ 3 Security Attacks │ Performance Budget│ Triage & Roadmap  │
│      (No Code)      │   (Deployed URL)   │(Multi-Tier Defense│(Refused in Console)│ (PERF.md Numbers) │(Cuts in FUTURE.md)│
```

---

### [0:00 – 1:00] Step 1: Who It Is For & The Problem (No Code)
* **What to say aloud:**
  > *"Good morning. This is **Addis Eats**, a gastronomy and real-time culinary logistics platform built for the vibrant dining scene in Addis Ababa, Ethiopia.  
  > In fast-growing urban centres, ordering authentic communal heritage dishes like slow-cooked Doro Wat or traditional Mesob platters often suffers from three major flaws: zero visibility into kitchen preparation milestones, clunky user interfaces that break when a brand-new customer has zero orders, and insecure client applications where malicious actors can tamper with order IDs or trigger unauthorized actions.  
  > Addis Eats solves this by delivering an end-to-end, zero-trust web application with cryptographic session security, instant server-rendered first paints, real-time courier GPS tracking, and WCAG 2.1 AA accessible data representations."*

---

### [1:00 – 3:00] Step 2: The Main Flow (Live, from the Deployed URL)
* **Action:** Open your browser to the local production site at `http://localhost:3000`.
* **What to demonstrate:**
  1. **Public Catalog (`/menu`):** Click the "Wats" category pill. Type `"doro"` in the search input — demonstrate that the cards filter dynamically without screen flickering (`keepPreviousData: true`).
  2. **Dish Detail (`/menu/doro-wat`):** Click into Doro Wat. Highlight the server-rendered structured data, nutritional profile, and crisp AVIF image.
  3. **Cart & Basket (`/cart`):** Click *"Add to Mesob Basket"*. Open the cart, bump the quantity to 2, and review the reactive ETB total calculation.
  4. **Checkout (`/checkout`):** Click *"Proceed to Checkout"*. Show that guests are redirected to `/login?next=/checkout`. Sign in with 1-click test credentials as **Abebe**. Complete the checkout with delivery area `"Bole Rwanda"`.
  5. **Live Confirmation & GPS Map (`/track/[id]`):** Observe the immediate transition to the live tracking page. Point out that the initial map and milestone coordinates appear on the very first frame with **zero loading spinner (0ms)**, followed by real-time courier motorcycle position streaming via Server-Sent Events (SSE).

---

### [3:00 – 5:00] Step 3: One Technical Decision & Why (Multi-Tier Defense)
* **Action:** Switch to tab with [`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js) and [`middleware.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/middleware.js).
* **What to say aloud:**
  > *"The key architectural decision I want to highlight is our **Three-Layer Zero-Trust Defense**.  
  > Many frontend developers rely exclusively on Edge Middleware, assuming that because a route is intercepted, their application is secure. But Edge Middleware only proves that a cookie exists; it cannot perform database record ownership checks.  
  > In Addis Eats, we implement defense-in-depth across three explicit boundaries:  
  > 1. **Layer 1 (Edge Middleware):** Intercepts requests to `/checkout`, `/orders`, `/kitchen`, `/dashboard`, and `/track` at the edge and cryptographically validates the token with Web Crypto HMAC-SHA256 before SSR even begins.  
  > 2. **Layer 2 (Server Component Page):** Re-verifies `getSession()` at render time. If a session expired or was revoked, it issues a safe redirect preserving the return URL.  
  > 3. **Layer 3 (Zero-Trust Server Actions):** Every mutation — such as `cancelOrder` or `placeOrder` — re-fetches the user session from cookies and explicitly checks `order.userId === session.user.id`. Any client-supplied user ID is discarded. If ownership does not match, it throws an immediate error."*

---

### [5:00 – 6:00] Step 4: The Three Attacks (Refused Live in Front of the Room)
* **Action:** Open Chrome DevTools Console on the live site, or open `/security-lab`.
* **Execution:**
  1. **Attack 1 (Calling write action signed out):**
     ```javascript
     await cancelOrder("ord_001");
     ```
     * **Demonstrate:** Console outputs `Error: Unauthorized: Authentication required. Session is missing or invalid.`  
     * **Cite Line:** Refused at [`app/actions.js:159-162`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js#L159-L162).
  2. **Attack 2 (Cross-Account IDOR write):**
     ```javascript
     // Signed in as Abebe (user_abebe_001), trying to cancel Chala's order (ord_003):
     await cancelOrder("ord_003");
     ```
     * **Demonstrate:** Console outputs `Error: Forbidden: Ownership mismatch. Order "ord_003" belongs to "user_chala_002", not session "user_abebe_001".`  
     * **Cite Line:** Refused at [`app/actions.js:171-175`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js#L171-L175).
  3. **Attack 3 (Crafted Open Redirect Phishing Link):**
     * **Demonstrate:** Paste `/login?next=https://malicious-phishing.com` in the address bar and log in. Show that the browser lands safely on `/orders`, and the external domain was stripped.  
     * **Cite Line:** Refused at [`lib/session.js:185-205`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/lib/session.js#L185-L205) via `sanitizeNextUrl()`.
  4. **Attack 4 (Private URL ID Tampering):**
     * **Demonstrate:** Navigate to `/orders/ord_003` while logged in as Abebe. Show the clean `Access Restricted: You do not have permission to view this order` screen.  
     * **Cite Line:** Stopped at [`app/orders/[id]/page.js:39-46`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/orders/%5Bid%5D/page.js#L39-L46).

---

### [6:00 – 7:00] Step 5: Performance Budget & Causes (`PERF.md`)
* **Action:** Open [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/PERF.md).
* **What to say aloud:**
  > *"Rather than guessing whether the application is fast, we established an explicit performance budget audited under simulated Fast 3G network and 4x CPU throttling on our production build.  
  > * **LCP dropped from 4.68s down to 1.22s (-73.9% improvement):** The culprit was our Great Mesob Feast hero platter, which was originally a 461 KB raw image loaded late. By converting it to Next.js `<Image priority={true}>` with automated AVIF transcoding, the payload fell to 28.2 KB and the browser received a preload link in the initial HTML head.  
  > * **CLS dropped from 0.248 down to a rock-solid 0.000:** We eliminated layout jump by reserving explicit aspect-ratio bounding boxes on every image and compiling font metrics with `next/font/google` to prevent font-swap shifts.  
  > * **First Load JS on `/menu` came down to 94 kB:** We resisted the temptation to make the whole menu a client component, keeping the catalog server-rendered and hydrating only the interactive search box leaf."*

---

### [7:00 – 8:00] Step 6: What Was Cut & What Is Next (`FUTURE.md`)
* **Action:** Open [`FUTURE.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/FUTURE.md).
* **What to say aloud:**
  > *"Under the MoSCoW prioritization framework, we ruthlessly cut two speculative ideas out loud to protect our verification battery and documentation:  
  > 1. We cut a secondary dark/light theme switcher to avoid CSS flash-of-unauthenticated-theme overhead and hydration lag.  
  > 2. We cut an interactive 3D WebGL platter previewer because the Three.js library would have added 140 kB of JavaScript, destroying our First Load JS budget.  
  > Tomorrow, as we transition into Module 4 (Backend Development), this frontend will serve as the client consumer for a real PostgreSQL database with Prisma ORM, a NestJS microservices gateway, and real-time Redis telemetry for live delivery fleets."*

---

## 2. The Five Walkthrough Tabs (Open in Browser/Editor Before Starting)

Have these exact five tabs open in your browser or editor:

| Tab | File Path | What It Is | What to Explain |
| :---: | :--- | :--- | :--- |
| **Tab 1** | [`app/orders/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/orders/page.js) | **Server Component** | Explains why it is an async Server Component: it queries the orders database directly, pre-aggregates neighbourhood metrics server-side, and sends only ~24 summarized rows across the boundary. |
| **Tab 2** | [`app/menu/SearchBox.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/menu/SearchBox.jsx) | **Client Component** | Explains why it must be client: it attaches to browser DOM keyboard events (`onChange`), buffers user input with `useDebounce(300)`, and calls the API without keystroke flooding. |
| **Tab 3** | [`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js) | **Protected Server Action** | Walks through `cancelOrder()`: highlights **Check 1** (authentication via `getSession()`) and **Check 2** (ownership via `order.userId === user.id`). |
| **Tab 4** | [`app/orders/[id]/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/orders/%5Bid%5D/page.js) | **Data Query & Seeding** | Explains server seeding: the server reads the order directly on the initial SSR paint, passing it to SWR as `initial` so the customer experiences **0ms spinner duration**. |
| **Tab 5** | [`components/dashboard/OrderTable.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/components/dashboard/OrderTable.jsx) | **Something Refactored** | Explains the refactoring from client-side array sorting to **server-side URL query parameters** (`?page=1&sort=total&order=desc`) with accessible `aria-sort` attributes. |

---

## 3. Answers to the Six Slide-27 Review Questions

Be prepared to answer these immediately if asked by the instructor or your peers:

### Question 1: What are your three Musts, and what did you cut to protect them?
> **Answer:**  
> Our three Musts were:
> 1. Complete end-to-end order flow (Menu → Cart → Checkout → Confirmation).
> 2. Cryptographic session authentication with line-level refusal of the Three Security Attacks.
> 3. Natural empty states across all pages so brand-new accounts never trigger an error.  
> To protect them, we cut the **secondary theme switcher**, **WebGL 3D platter**, and **SMS dispatch webhooks** into [`FUTURE.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/FUTURE.md).

### Question 2: Which criterion were you currently weakest on, and what would fix it fastest?
> **Answer:**  
> "Earlier today, our weakest area was keyboard accessibility on interactive buttons and links. The fastest fix was applying a global `:focus-visible` styling pass in [`app/globals.css`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/globals.css#L1825-L1867) with a 3px paprika focus ring and enforcing a minimum 44px touch target on all controls. This immediately brought our accessibility score to 100."

### Question 3: Show the line that refuses a write from someone who does not own the record.
> **Answer:**  
> In [`app/actions.js:171-175`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js#L171-L175):
> ```javascript
> if (order.userId !== user.id) {
>   throw new Error(
>     `Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`
>   );
> }
> ```
> And in our Route Handler at [`app/api/orders/[id]/route.js:26-28`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/api/orders/%5Bid%5D/route.js#L26-L28):
> ```javascript
> if (order.userId !== user.id && user.role !== "staff") {
>   return Response.json({ error: "Forbidden" }, { status: 403 });
> }
> ```

### Question 4: Which of your routes is static, which dynamic, and did you choose or accept it?
> **Answer:**  
> * **Static / ISR Routes:** `/` (homepage), `/menu` (catalog), `/offers`, and `/reservations`. We deliberately chose static rendering with `revalidate = 3600` because menu items and restaurant marketing copy change infrequently and benefit from instant CDN caching and crawler SEO.  
> * **Dynamic (SSR) Routes:** `/orders`, `/orders/[id]`, `/checkout`, `/kitchen`, `/dashboard`, and `/track/[id]`. We explicitly chose dynamic rendering (`export const dynamic = "force-dynamic"`) because these routes read request-time cookies, query parameters (`searchParams`), or live GPS coordinates that must never be statically cached across different users.

### Question 5: What does a brand-new account see on every screen of your application?
> **Answer:**  
> When a brand-new account (like `sara@mesobhouse.et`) logs in:
> * On `/orders` & `/dashboard`: They see a friendly, styled empty hearth card (`<DashboardEmptyState />`) reading *"You haven't placed any Mesob dining orders yet"* with a direct CTA button linking to the banquet menu, plus the security test box. Zero runtime exceptions.
> * On `/cart`: They see the empty basket state (`🧺 Your Mesob Basket is Empty`).
> * On `/menu`: They see the full dining banquet ready for their first order.

### Question 6: What is the one technical decision you will present, and why that one?
> **Answer:**  
> "The **Multi-Tier Defense Architecture (Edge Middleware + SSR Page Gate + Server Action Ownership Check)**. I chose this because it represents the fundamental architectural boundary between frontend presentation and backend data integrity. It proves that we understand that the client is an untrusted environment, and that security must be enforced in the code, not in the interface."

---

## 4. Tough Assessor Questions & How to Answer

### Q: "Why is `app/menu/SearchBox.jsx` a client component, but `app/menu/page.js` is not?"
> **Answer:**  
> "`SearchBox.jsx` requires browser interactivity: it binds to input keystrokes, manages state (`useState`), and buffers keystrokes with `useDebounce`. In contrast, `app/menu/page.js` simply fetches the dishes from the database and renders the layout shell. Keeping the parent page on the server reduces the client bundle by 74 kB and ensures search engines receive complete HTML without waiting for JavaScript execution."

### Q: "What if an assessor calls `cancelOrder('ord_001')` signed out from the console?"
> **Answer:**  
> "The action halts on line 159 of `app/actions.js`. `getSession()` reads the request cookie; because no valid HMAC token exists, it rejects with an `Unauthorized` exception. The write never reaches the database."

### Q: "What was the hardest bug you encountered today?"
> **Answer:**  
> "Managing the server-client boundary on the delivery tracking map. Leaflet requires access to the browser `window` object, which crashes in Next.js Server Components. We resolved this by creating an isolated client leaf component loaded with dynamic import `{ ssr: false }`, while keeping the surrounding tracking metadata and order history pre-rendered on the server."
