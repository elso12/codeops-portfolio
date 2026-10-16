# Server, Client, Edge & Performance Boundary Matrix

This document defines the architectural boundary for every route, component, and performance pipeline in Day 18 (Module 3 · Day 43), specifying execution environment, security role, optimization strategy, and rationale.

---

## Architecture Boundaries Matrix

| File / Component | Environment | Type | Security & Performance Rationale |
| :--- | :--- | :--- | :--- |
| `next.config.mjs` | **Build & Server Config** | Optimization Config | Declares `remotePatterns` to protect against SSRF/open proxy abuse and activates modern compression formats `["image/avif", "image/webp"]`. |
| `app/layout.js` | **Server Component** | App Shell | Initialized with `next/font/google` (`Playfair_Display` and `Plus_Jakarta_Sans`). Zero runtime external font network hops. Houses `<Script id="addis-eats-telemetry" strategy="lazyOnload">`. |
| `app/globals.css` | **Client CSS** | Design Tokens | Uses `var(--font-serif)` and `var(--font-sans)`. Removed blocking Google Fonts `@import url(...)` to eliminate CSS serialization latency. |
| `app/page.js` | **Server Component** | Public Landing | Houses the single largest above-the-fold image (`great-mesob-feast.png`) with `priority={true}`, generating `<link rel="preload" as="image" fetchpriority="high">`. |
| `app/menu/DishCard.jsx` | **Server Component (Leaf)** | Performance Component | Dedicated card implementing Next.js `<Image>` with explicit 400x300 aspect ratio, honest `sizes` query, and native lazy loading. |
| `app/menu/page.js` | **Server Component (ISR 3600s)** | Banquet Catalog | Server-rendered dish list paged and filtered without client JS overhead, rendering `<DishCard>` items. |
| `app/menu/[id]/page.js` | **Server Component (Static)** | Dish Detail | Hero dish image rendered with `<Image priority width={840} height={400} sizes="(max-width: 840px) 100vw, 840px" />`. |
| `middleware.js` | **Edge Runtime** | Middleware Proxy | Evaluates cryptographic cookie token before request reaches SSR layer. Only checks `/orders` and `/checkout`. Re-directs unsigned users to `/login?next=...`. |
| `lib/session.js` | **Isomorphic (Web Crypto)** | Utility Library | HMAC-SHA256 token creation and verification using native Web Crypto (`crypto.subtle`). Runs in Edge Middleware and Node SSR without external dependencies. |
| `.env.example` | **Committed Template** | Environment Spec | Committed documentation of all server secrets (`SESSION_SECRET`, `DATABASE_URL`, `TELEBIRR_APP_KEY`) and public configuration (`NEXT_PUBLIC_APP_URL`). |
| `.gitignore` | **Git VCS Config** | Security Barrier | Explicitly ignores `.env*.local` and `.env` while whitelisting `!.env.example`. |
| `app/actions.js` | **Server ("use server")** | Server Actions | Public RPC endpoints. Implements line-level Defense in Depth: Level 1 (Authentication), Level 2 (Record ownership verification), and Role validation (`user.role === 'staff'`). |

---

## 4 Core Performance & Security Boundary Rules

1. **The Single `priority` Rule (LCP Boundary):**
   Exactly ONE image above the fold receives `priority`. All below-the-fold images must remain on native browser lazy loading (`loading="lazy"`), or they will congest the critical request queue.
2. **The Zero-CLS Font Boundary (`next/font`):**
   Web fonts are downloaded once at build time and bundled directly into static artifacts. Metric overrides (`size-adjust`) ensure fallback fonts match the exact pixel height and width of web fonts.
3. **The Idle-Time Script Boundary (`strategy="lazyOnload"`):**
   Third-party scripts (telemetry, analytics, customer support widgets) must execute exclusively during browser idle time, preserving an ultra-low Total Blocking Time (TBT < 50ms).
4. **The Environment Variable Secret Boundary:**
   Any environment variable containing a database password, HMAC signing secret, or merchant API key must NEVER be prefixed with `NEXT_PUBLIC_`. Variables prefixed with `NEXT_PUBLIC_` are permanently baked into client JavaScript bundles at build time.
