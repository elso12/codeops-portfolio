# Server, Client & Edge Boundary Matrix

This document defines the architectural boundary for every route, component, and utility in Day 17 (Module 3 · Day 42), specifying execution environment, security role, and rationale.

---

## Architecture Boundaries Matrix

| File / Component | Environment | Type | Security & Architectural Rationale |
| :--- | :--- | :--- | :--- |
| `middleware.js` | **Edge Runtime** | Middleware Proxy | Evaluates cryptographic cookie token before request reaches SSR layer. Only checks `/orders` and `/checkout`. Re-directs unsigned users to `/login?next=...`. |
| `lib/session.js` | **Isomorphic (Web Crypto)** | Utility Library | HMAC-SHA256 token creation and verification using native Web Crypto (`crypto.subtle`). Runs in Edge Middleware and Node SSR without external dependencies. Dynamically imports `next/headers` inside `getSession()` to keep Edge bundle clean. |
| `lib/data.js` | **Server Only** | In-Memory Database | Simulated database store with foreign-key isolation (`order.userId -> user.id`). Contains private user hashes and orders. Never bundled into browser client code. |
| `app/actions.js` | **Server ("use server")** | Server Actions | Public RPC endpoints. Implements line-level Defense in Depth: Level 1 (Authentication), Level 2 (Record ownership verification), and Role validation (`user.role === 'staff'`). |
| `app/layout.js` | **Server Component** | App Shell | Extracts session via `getSession()` and passes serializable user object into Client Navbar. Wraps tree with Client Providers. |
| `components/Navbar.jsx` | **Client Component** | Navigation Header | Consumes `session` prop and CartContext. Dynamically toggles `/kitchen` link for staff, displays active user badge, and provides instant Sign Out action. |
| `app/page.js` | **Server Component** | Public Landing | High-performance public showcase. No authentication required. Fully prerendered. |
| `app/menu/page.js` | **Server Component** | Public Catalog | Server-rendered dish list. Fully accessible to guest visitors. |
| `app/orders/page.js` | **Server Component** | Protected User Realm | Guarded by Edge Middleware, Server SSR check (`getSession()`), and scoped query (`getOrdersByUser(user.id)`). Prevents URL parameter tampering (`?userId=...`). |
| `app/orders/CancelButton.jsx` | **Client Component** | Interactive Leaf | Client button utilizing `useTransition` to execute `cancelOrder(orderId)` with optimistic or loading states. |
| `app/orders/AttackTestBox.jsx` | **Client Component** | Security Audit Leaf | Allows real-time interactive testing of Attack #2 (Cross-Account IDOR) directly inside the Orders page. |
| `app/kitchen/page.js` | **Server Component** | Staff Portal | Server-rendered kitchen operations. Refuses non-staff callers with HTTP 403 Forbidden even if URL is typed directly. |
| `app/kitchen/KitchenStatusControl.jsx` | **Client Component** | Interactive Leaf | Allows kitchen expediter to cycle order statuses (`pending` -> `preparing` -> `ready` -> `completed`). |
| `app/checkout/page.js` | **Server Component** | Protected Checkout Shell | Server shell verifying session and fetching serialized dish options for client form. |
| `app/checkout/CheckoutForm.jsx` | **Client Component** | Interactive Leaf | Client form using React 19 `useActionState(placeOrder)` for progressive enhancement and live validation feedback. |
| `app/login/LoginForm.jsx` | **Client Component** | Interactive Form | Handles client sign-in state, includes 1-click test account switcher, and safely redirects to sanitized `nextDestination`. |
| `app/security-lab/page.js` | **Server Component** | Security Lab Shell | Server shell passing active session and orders into client penetration test runner. |
| `app/security-lab/SecurityLabClient.jsx` | **Client Component** | Interactive Audit Runner | Live testing interface for Attack 1 (Unauthenticated calls), Attack 2 (IDOR), Attack 3 (Open Redirect), and Attack 4 (RBAC). |

---

## Boundary Principles

1. **Server Actions are Public Endpoints:**
   Any client or adversary can craft a `POST` request directly to a Server Action. Consequently, authentication and ownership checks must NEVER rely on client-provided IDs.
2. **Edge Middleware is an Optimization, Not the Sole Defense:**
   Middleware accelerates redirects and prevents wasteful SSR on protected routes, but Server Components and Server Actions must still perform defense-in-depth verification.
3. **Cryptographic Tokens over Plain IDs:**
   User IDs are never stored unencrypted in plain cookies. All session data is cryptographically signed using HMAC-SHA256, rendering cookie tampering mathematically impossible.
