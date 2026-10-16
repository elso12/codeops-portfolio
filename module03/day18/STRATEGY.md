# Rendering, Optimization & Security Strategy

This document details the rendering, performance optimization, and security strategy implemented for each route in Day 18 (Module 3 · Day 43).

---

## Route Strategy & Performance Matrix

| Route | Rendering Strategy | Performance Pipeline | Security Tier | Protection Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Server Component** | Priority Hero `<Image>` (520x520, AVIF 28KB), `next/font` zero-CLS, lazy below-fold dishes | Public | None (Marketing & Brand Showcase) |
| `/menu` | **ISR (3,600s)** | Statically pre-rendered with hourly revalidation; `<DishCard>` with honest `sizes` and native lazy loading | Public | None (Banquet Catalog) |
| `/menu/[id]` | **Static (`generateStaticParams`)** | Pre-rendered static HTML with hero `<Image priority>` (840x400) and instant 404 via `notFound()` | Public | None (Dish Details) |
| `/orders` | **Dynamic (`force-dynamic`)** | Scoped SSR rendering; responsive orders grid with `CancelButton` client leaf | Protected (Customer) | Edge Middleware + SSR `getSession()` + `getOrdersByUser(user.id)` |
| `/checkout` | **Dynamic (`force-dynamic`)** | Progressive enhancement with React 19 `useActionState(placeOrder)` | Protected (Customer) | Edge Middleware + SSR `getSession()` + Server Action verification |
| `/kitchen` | **Dynamic (`force-dynamic`)** | Real-time status cycler with `KitchenStatusControl` client leaf | Protected (Staff Role) | Server Component RBAC (`user.role === 'staff'`) + Action Gate |
| `/security-lab`| **Dynamic (`force-dynamic`)** | Interactive penetration lab running live simulations against the 3 core web attacks | Public Audit Tool | Sandboxed Server Actions testing auth, IDOR, redirect, and RBAC |
| `/api/dishes` | **Route Handler (GET)** | JSON endpoint supporting filtering by `?category=`, cached on edge CDN | Public (REST) | None |
| `/api/orders` | **Route Handler (GET/POST)** | Authenticated REST endpoint with shared Zod schema validation | Protected (REST) | `getSession()` HMAC cookie verification |

---

## The 3 Performance Pillars: Core Web Vitals Optimization

```
                                [ PILLAR 1: LCP ACCELERATION ]
                  - Centerpiece Hero Image marked with priority={true}
                  - Injects <link rel="preload" as="image" fetchpriority="high">
                  - Transcodes 461 KB raw PNG into 28.2 KB modern AVIF
                                                │
                                                ▼
                                [ PILLAR 2: ZERO-CLS STABILITY ]
                  - All images declare explicit intrinsic width and height
                  - next/font injects metric-matched fallback @font-face rules
                  - Browser reserves exact layout boxes prior to byte downloads
                                                │
                                                ▼
                                [ PILLAR 3: LOW INP / TBT ]
                  - Third-party telemetry deferred via strategy="lazyOnload"
                  - Minimal client JavaScript footprint via Server Components
                  - Main thread remains unblocked for immediate user taps
```

---

## Environment Separation & Secret Hygiene

1. **Local Development:** Secret values reside in `.env.local`, which is strictly gitignored.
2. **Repository Tracking:** Only [`.env.example`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day18/.env.example) is committed, documenting all variable names with mock values.
3. **Client vs Server Boundary:** Sensitive keys (`SESSION_SECRET`, `TELEBIRR_APP_KEY`, `DATABASE_URL`) never contain the `NEXT_PUBLIC_` prefix, preventing them from being compiled into browser bundles.
