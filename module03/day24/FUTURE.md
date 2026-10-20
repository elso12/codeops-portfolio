# FUTURE.md — Capstone Scope Triage & MoSCoW Prioritisation

> **Course:** Module 3 · Frontend: React & Next.js · Day 49 (Week 10)  
> **Program:** CodeOps · Full Stack Software Development · IBT College Canada  
> **Author:** Mehran Dasgar  
> **Topic:** Triage Decisions, Cut Features, and Module 4 Roadmap

---

## 1. Executive Summary & Triage Philosophy

During the Capstone build session, ruthless prioritization was applied following the **MoSCoW Method (Must, Should, Could, Won't)**. In accordance with the project standard:

> *"Breadth, not novelty — nothing new is expected today, and a small, complete, well-built project beats an ambitious half-finished one every time."*

To protect the non-negotiable **Verification Battery, Security Auditing, Performance Budgets, and Documentation**, all secondary non-essential ideas ("Coulds" and speculative enhancements) were explicitly cut out loud into this document. Naming what was intentionally omitted demonstrates engineering judgment rather than oversight.

---

## 2. MoSCoW Prioritisation Matrix

| Priority | Feature / Scope Item | Status | Justification / Impact |
| :--- | :--- | :---: | :--- |
| **MUST** | Cryptographic HMAC session authentication (`mesob_session` cookie) | **SHIPPED** | Fundamental boundary. Essential for user identity and multi-tier protection. |
| **MUST** | Edge Middleware route guard (`/checkout`, `/orders`, `/kitchen`, `/dashboard`) | **SHIPPED** | First line of defense before SSR execution begins. |
| **MUST** | Complete End-to-End Main Order Flow (Menu → Cart → Checkout → Confirmation) | **SHIPPED** | The core business purpose of the application. |
| **MUST** | Zero-Trust Server Actions (`placeOrder`, `cancelOrder`, `updateKitchenStatus`) | **SHIPPED** | Data security boundary; refuses unsigned and cross-tenant writes. |
| **MUST** | Three Security Attacks Refusal & Line-Level Proofs | **SHIPPED** | Mandatory rubric requirement (20% grade weight). |
| **MUST** | Brand-New Account Natural Empty States | **SHIPPED** | Prevents app crashes when an assessor creates a fresh account tomorrow. |
| **MUST** | Four Documents (`README.md`, `AUTH.md`, `DATA.md`, `PERF.md`) | **SHIPPED** | Cheaper marks in rubric (10%), essential for evaluation. |
| **SHOULD** | Operational Analytics Dashboard (Revenue Bar Chart & Orders Timeline) | **SHIPPED** | Week 10 Day 46 requirement; provides visual gastronomy ledger. |
| **SHOULD** | Accessible Companion Tables for all SVG Charts | **SHIPPED** | WCAG 2.1 AA screen-reader and keyboard accessibility. |
| **SHOULD** | URL-Driven Sorting & Pagination (`?page=...&sort=...&order=...`) | **SHIPPED** | Server-side boundary control; only current page crosses network. |
| **SHOULD** | Live Courier Delivery GPS Tracking (`/track/[id]` with Leaflet & SSE) | **SHIPPED** | Real-time state synchronization via Server-Sent Events. |
| **SHOULD** | Dynamic `@vercel/og` Social Share Cards (1200×630) | **SHIPPED** | Discovery and metadata requirement for search and social preview. |
| **COULD** | Dark / Light Theme Toggle (Communal Ochre vs. Moonlight Obsidian) | **CUT** | Aesthetic only; doesn't affect ordering or security. Cut to preserve testing time. |
| **COULD** | Multi-Language Amharic / English Localization Switcher (i18n) | **CUT** | Cultural enhancement, but English with Ge'ez glyph accents suffices for Capstone. |
| **COULD** | Real-time WebPush Notifications for Courier Approaching | **CUT** | High complexity across browsers; SSE live tracking stream already satisfies live data. |
| **COULD** | In-Browser WebGL 3D Mesob Platter Previewer | **CUT** | Heavy bundle weight (>300 kB); violates Core Web Vitals performance budget. |
| **COULD** | Customer Review & Photo Upload System | **CUT** | Complex multipart storage; out of scope for frontend rubric. |
| **WON'T** | Third-Party Payment Gateway Integration (Stripe / Telebirr live keys) | **DEFERRED** | Avoids committing live banking secrets; simulated checkout is reliable and safe. |

---

## 3. Explicitly Cut Items ("Cut Out Loud")

### 1. Second Color Theme Switcher (Obsidian Night Mode)
* **What it was:** A client-side CSS variable toggle allowing users to swap between the warm "Communal Honey/Teff" palette and an ultra-dark AMOLED "Obsidian Night" palette.
* **Why it was cut:** Theme toggles require client hydration, local storage synchronization, and flash-of-unauthenticated-theme prevention (`suppressHydrationWarning`). The primary palette already exceeds WCAG AAA contrast ratios (minimum 7:1) across all text elements. Cutting this saved 45 minutes of CSS testing.

### 2. Full Internationalization (i18n) with Amharic / Oromo / Tigrinya
* **What it was:** Next.js subpath routing (`/am/menu`, `/om/menu`, `/en/menu`) with dictionary lookups.
* **Why it was cut:** The application incorporates authentic Ethiopian cultural typography and dual-language headings (e.g., `የእኔ ትዕዛዞች • My Mesob Orders`) directly in the semantic markup. Full multi-language routing introduces significant complexity with static generation and URL canonical tags.

### 3. WebGL / Three.js 3D Interactive Platter
* **What it was:** Interactive 3D rendering of the communal Mesob basket on the hero landing page.
* **Why it was cut:** Importing `three` adds ~140 kB of minified JavaScript to the initial client bundle. Our `PERF.md` budget strictly limits First Load JS to under 120 kB and requires an LCP under 2.5s. Replacing this with an optimized AVIF photography hero delivered a blazing 1.22s LCP and a Lighthouse score of 98.

### 4. Interactive SMS & WhatsApp Courier Dispatch Webhooks
* **What it was:** Sending automated SMS alerts to customer phone numbers via Twilio API when delivery status changes to "out_for_delivery".
* **Why it was cut:** Out of frontend scope; belongs in Module 4 backend microservices. The in-app SSE live tracking map (`/track/[id]`) provides visual real-time feedback with zero external SMS dependencies.

---

## 4. Module 4 (Backend Track) Roadmap

When transitioning into **Module 4 (Node.js with NestJS / Go / .NET)**, this frontend application will serve as the client consumer. The roadmap includes:

1. **Persistent PostgreSQL Database:** Replace in-memory ledger with Prisma / TypeORM backing with transaction isolation.
2. **True WebSocket / Redis PubSub Gateway:** Replace Server-Sent Events polling fallback with NestJS `@WebSocketGateway()` backed by Redis channels.
3. **JWT / OAuth2 / OpenID Connect Provider:** Integrate enterprise identity provider with refresh token rotation in HttpOnly partition cookies.
4. **Live Telebirr / Chapa Payment Webhooks:** Cryptographically signed webhook receivers verifying Ethiopian mobile money transactions.
