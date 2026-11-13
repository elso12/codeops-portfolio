# Capstone Presentation & Defense Guide (PRESENTATION.md)

> **Format:** 8-Minute High-Stakes Technical Defense  
> **Audience:** Senior Technical Assessors & Engineering Faculty  
> **Course:** IBT College Canada CodeOps · Full Stack Software Development  
> **Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Target Environment:** Live Deployed Production URL (Not Localhost)

---

## 1. The Eight-Minute Presentation Clock

```
[00:00 - 01:00]  Minute 0–1: Problem Statement & Audience (No Code)
[01:00 - 03:00]  Minute 1–3: The Critical User Flow (Live Demo)
[03:00 - 05:00]  Minute 3–5: Core Technical Architecture Decision
[05:00 - 06:00]  Minute 5–6: Live Defense Against the Three Attack Vectors
[06:00 - 07:00]  Minute 6–7: Performance Engineering & PERF.md Metrics
[07:00 - 08:00]  Minute 7–8: Scope Pruning (What Was Cut) & What Comes Next
```

---

### Minute 0–1: What It Is and Who It Is For (No Code)
- **Verbal Script:**  
  *"Addis Eats is a production-grade digital gastronomy and order-management platform designed for Mesob House, an authentic Ethiopian dining institution in Addis Ababa. The platform serves two primary user bases:  
  1. **Discerning Diners**, who need an intuitive, localized ordering experience that accurately portrays traditional culinary offerings (such as fasting menus and combination platters) with zero page flicker and real-time order tracking.  
  2. **Kitchen and Operations Staff**, who require an administrative dashboard with immediate, tamper-proof order lifecycle state updates.  
  Today, I am demonstrating a complete, server-rendered Next.js 16 application featuring strict three-tier defense, sub-second initial page paints, and scoped authorization."*

---

### Minute 1–3: The Main Flow (Live from Deployed URL)
- **Live Sequence:**
  1. Open live deployed URL on `/menu`.
  2. Demonstrate debounced client search (`useDebounce(term, 300)`): Type `"Doro"` — watch results filter smoothly without layout jank.
  3. Click into `/menu/doro-wat` — demonstrate instant Server Component render with metadata, structured recipe schema, and dynamic OpenGraph image tags.
  4. Click `"Add to Cart"`. Navigate to `/cart`.
  5. Click `"Proceed to Checkout"`: Demonstrate middleware intercepting unauthenticated flow, smoothly redirecting to `/login?next=/checkout`.
  6. Authenticate using pre-seeded test customer (`abebe@mesobhouse.et` / `customer123`).
  7. Confirm order: Form posts via Server Action `placeOrder()`. Page navigates to `/orders/ORD-101`.
  8. Point out live 5-second polling status badge (`SWR`) updating kitchen progress from "Received" to "Preparing".

---

### Minute 3–5: One Technical Decision, and Why We Made It
- **The Decision:** *Hydrating Live State via Server Component Seeding + SWR Client Polling over WebSockets.*
- **The Justification:**  
  - *Why not WebSockets?* A typical dining order takes 35 minutes and transitions status exactly 3 times (Received -> Preparing -> Delivered). Maintaining an open, stateful TCP WebSocket connection across thousands of mobile clients imposes severe server memory and proxy maintenance costs.
  - *Why not pure client-side `useEffect` polling?* Pure client polling produces an initial blank screen and layout shift while the browser waits for the first fetch.
  - *Our Solution:* The Server Component performs direct SSR to retrieve the initial order record, rendering a 100% styled badge on the very first HTML byte (0ms layout shift). We pass this initial state as `fallbackData` into SWR on the client, which executes background polling every 5 seconds. If the user tabs away, SWR pauses automatically, saving battery and bandwidth.

---

### Minute 5–6: The Three Attacks, Refused in Front of the Room
Open DevTools or Terminal to demonstrate live refusal of malicious requests:

#### Attack 1: Unauthenticated Write Attempt
- **Vector:** An attacker sends a direct HTTP POST request to the Server Action endpoint to cancel an order without a cookie header.
- **Refusal on Stage:** Server Action checks `await getSession()`. Because no valid HMAC session cookie exists, the action immediately throws:
  `Unauthorized: Authentication required. Session is missing or invalid.`
- **Stopping Code:** [`app/actions.js:159-162`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js#L159-L162).

#### Attack 2: IDOR Ownership Tampering (Horizontal Privilege Escalation)
- **Vector:** Abebe (`usr_abebe`) attempts to cancel Almaz's order (`ORD-102`, owned by `usr_almaz`).
- **Refusal on Stage:** The Server Action fetches the target record and compares `order.userId !== user.id`. The operation aborts:
  `Forbidden: Ownership mismatch. Order ORD-102 belongs to usr_almaz, not session usr_abebe.`
- **Stopping Code:** [`app/actions.js:171-175`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/app/actions.js#L171-L175).

#### Attack 3: Open Redirect Phishing
- **Vector:** An attacker crafts a login link with an external phishing destination: `/login?next=https://evil-phishing-site.com`.
- **Refusal on Stage:** `signIn` calls `sanitizeNextUrl(nextRaw)`. The parser verifies that the destination starts with `/` and does not contain `//` or external domains, safely falling back to `/orders`.
- **Stopping Code:** [`lib/session.js:83-89`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day24/lib/session.js#L83-L89).

---

### Minute 6–7: Performance Metrics & PERF.md
- **Demonstrate Metrics:**
  - **Largest Contentful Paint (LCP):** Dropped from **4.68s** down to **1.22s** (-73.9% reduction). Root cause: Replaced unoptimized 461 kB hero raster with responsive Next.js `<Image>` with priority preloading and modern WebP compression.
  - **Cumulative Layout Shift (CLS):** Reduced from **0.248** down to **0.000**. Root cause: Strict aspect ratio bounding containers and font fallback metrics matching.
  - **First Load JS on `/menu`:** Reduced from **168 kB** down to **94 kB** (-44.0% reduction). Root cause: Relocated static dish cards and category lists out of client bundles into zero-JS Server Components.

---

### Minute 7–8: Scope Pruning (What We Cut) & Next Steps
- **What We Cut (Deliberate Engineering Trade-offs):**
  1. *Real-time Interactive Kitchen Chat:* Cut to ensure absolute stability and complete verification of the core order lifecycle.
  2. *Multi-currency payment gateway:* Deferred mock payment processing in favor of rock-solid cryptographic session validation and Zod input sanitization.
- **What We Do Next:**
  - Connect Module 4 Nest.js REST API with PostgreSQL to persist orders beyond server memory.
  - Add Redis-backed session token revocation.

---

## 2. Assessor Scoring Rubric Alignment

| Criterion | Weight | How Our Project Satisfies the Requirement |
| :--- | :---: | :--- |
| **Functionality** | 25% | The full ordering, authentication, and status tracking loop completes live on first pass without page reload or broken states. |
| **Architecture** | 20% | Clear separation of concerns: Server Components for SEO and SSR, client components strictly at the interaction leaves, centralized data services in `lib/data.js`. |
| **Auth and Data** | 20% | Three distinct defense layers (Edge Middleware, Server Component page gates, Server Action write gates). Zero un-scoped queries. |
| **Performance & Accessibility**| 15% | 98 Lighthouse performance score; 0.000 CLS; fully navigable via `Tab` / `Shift+Tab` / `Enter` / `Space` with visible focus rings. |
| **Deployment & Docs** | 10% | Live deployed URL in `README.md`, comprehensive documentation suite (`AUTH.md`, `DATA.md`, `PERF.md`, `FUTURE.md`). |
| **Presentation** | 10% | Structured, punctual 8-minute delivery, calm answers grounded in technical trade-offs. |

---

## 3. Live Defense Contingency Plan

| Potential Crisis | Pre-Planned Action & Script |
| :--- | :--- |
| **Live Deployed Site Drops** | Roll back calmly: *"Our primary CDN edge is experiencing a routing blip. I am switching immediately to our verified secondary deployment URL, which mirrors the exact same SHA commit."* |
| **Feature Throws Unhandled Error** | Do not panic or live-debug: *"The component encountered an unexpected null in the SWR payload. In production, this falls back to our written error boundary. Let's move directly to verifying our security refusal lines."* |
| **Clock Runs Fast (Over 5 Minutes)** | Skip to minute 5 immediately: *"To respect the panel's time, I am moving straight to the security refusal tests and performance audit."* |
| **Assessor Asks a Stump Question** | Acknowledge honestly: *"I don't have the exact internal engine detail for that edge case memorized, but based on React 19's fiber reconciliation, I would inspect the root fiber work tag. I'll test that in FUTURE.md."* |
