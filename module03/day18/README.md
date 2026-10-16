# Addis Eats — Day 43 · Next.js Performance, Image Pipeline & Deployment Hygiene

> **CodeOps Full Stack · Module 3 · Day 43 (Day 18 Deliverable)**  
> Production-grade Next.js performance engineering: measured Core Web Vitals before and after, modern AVIF/WebP image optimization pipeline with honest sizes, single above-the-fold priority hero, zero-CLS self-hosted fonts with `next/font`, lazy third-party scripts via `next/script`, and secure environment setup.

---

## Performance Scorecard: The Before & After

```
========================================================================================
                                CORE WEB VITALS AUDIT
========================================================================================
Metric                   Baseline (Unoptimized)     Optimized (Day 18)          Status
----------------------------------------------------------------------------------------
Performance Score        58 / 100                  98 / 100                    +40 pts (A+)
Largest Contentful Paint 4.68 s                    1.22 s                      -73.9%
Cumulative Layout Shift  0.248                     0.000                       Zero Shift
Total Blocking Time      340 ms                    15 ms                       -95.6%
First Contentful Paint   2.45 s                    0.65 s                      -73.5%
Homepage Images Weight   4,732 KB                  141 KB                      -97.0%
Full Menu Images Weight  6,825 KB                  226 KB                      -96.7%
External Font Requests   3 network origins         0 (100% self-hosted)        Zero Hops
========================================================================================
```

For full line-by-line attribution and answers to the curriculum rubric questions, read [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day18/PERF.md).

---

## 7 Performance Exercises Checklist

- [x] **Exercise 1 — Measure First on Production Build:** Recorded baseline metrics on throttled production build (`npm run start`), identifying LCP (4.68s) and CLS (0.248) bottlenecks.
- [x] **Exercise 2 — Next.js `<Image>` Pipeline:** Converted all raw `<img>` tags to `next/image` with explicit `width`, `height`, honest `sizes` queries, and authentic culinary alt text across homepage, menu, and dish details.
- [x] **Exercise 3 — Single Above-the-Fold `priority` Image:** Added `priority` exclusively to the Great Mesob Feast centerpiece hero (`app/page.js:92-100`). All remaining images load lazily with native decoding.
- [x] **Exercise 4 — Zero-CLS Self-Hosted `next/font`:** Replaced render-blocking `@import` and `<link>` font tags with `next/font/google` (`Playfair_Display` and `Plus_Jakarta_Sans`), downloading and hosting font subsets at build time with CSS fallback metric overrides.
- [x] **Exercise 5 — Lazy Third-Party Scripts:** Implemented telemetry and analytics tracking via `next/script` with `strategy="lazyOnload"` in `app/layout.js`, eliminating main-thread contention during hydration.
- [x] **Exercise 6 — Secure Environment Variable Hygiene:** Committed comprehensive [`.env.example`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day18/.env.example), confirmed `.env*.local` is gitignored via `.gitignore`, and verified that zero server secrets (`SESSION_SECRET`, `TELEBIRR_APP_KEY`, `DATABASE_URL`) are prefixed with `NEXT_PUBLIC_`.
- [x] **Exercise 7 — Re-Run Lighthouse & Documented Deltas:** Recorded all improvements in [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day18/PERF.md) and provided detailed explanations of what caused each improvement.

---

## Architecture & Optimization Techniques

```
                                      Browser Client
                                            │
                     ┌──────────────────────┴──────────────────────┐
                     │                                             │
                     ▼                                             ▼
          HTML Stream with Preload                       Static Asset Pipeline
        ┌─────────────────────────┐                   ┌─────────────────────────┐
        │  <link rel="preload"    │                   │  next/font/google       │
        │   as="image"            │                   │  - Downloaded at build  │
        │   fetchpriority="high"> │                   │  - Injected locally     │
        └────────────┬────────────┘                   │  - Zero CLS metric fix  │
                     │                                └─────────────────────────┘
                     ▼
          Single Hero Centerpiece
          (priority={true})
          - 520x520 intrinsic box
          - AVIF 28.2 KB (was 461 KB)
                     │
                     ▼
          Lazy Below-Fold Images
          (loading="lazy")
          - 4:3 intrinsic box reserved
          - AVIF 28.3 KB (was 936 KB)
                     │
                     ▼
          Deferred Third-Party Scripts
          (strategy="lazyOnload")
          - Loaded during idle time
          - Zero hydration blocking (TBT 15ms)
```

---

## Project Structure

```text
├── app/
│   ├── actions.js              # Server actions (auth, anti-IDOR, secure mutations)
│   ├── globals.css             # Vanilla CSS design tokens with var(--font-serif/sans)
│   ├── layout.js               # Root layout: next/font + next/script (lazyOnload)
│   ├── page.js                 # Homepage: priority hero image + honest sizes
│   ├── menu/
│   │   ├── page.js             # Full banquet menu: lazy next/image dishes
│   │   └── [id]/page.js        # Dish detail: single hero image with priority
│   ├── orders/                 # Protected orders view (multi-tenant isolation)
│   ├── kitchen/                # Protected staff kitchen board (RBAC)
│   └── security-lab/           # Interactive penetration test lab
├── components/
│   ├── Navbar.jsx              # Responsive navigation bar
│   ├── Providers.jsx           # Cart context provider wrapper
│   └── AddToCartButton.jsx     # Client leaf for interactive basket actions
├── lib/
│   ├── data.js                 # In-memory store: 12 authentic dishes, seed users, orders
│   ├── session.js              # Native Web Crypto HMAC-SHA256 session token system
│   └── schema.js               # Shared Zod validation schema
├── public/
│   └── images/                 # High-resolution Habesha culinary assets
├── .env.example                # Committed environment variable template
├── .gitignore                  # Explicitly ignores .env*.local and whitelists .env.example
├── next.config.mjs             # Remote image patterns & AVIF/WebP image formats
├── package.json                # Next.js 16, React 19, Zod
└── PERF.md                     # Core Web Vitals before/after audit & attribution
```

---

## Running & Verifying Locally

### 1. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env.local

# Install dependencies
npm install
```

### 2. Run Production Build (Required for Accurate Performance Testing)
```bash
# Build the production bundle
npm run build

# Start the production server
npm run start
```
Visit `http://localhost:3000` in Google Chrome.

### 3. Verification Steps
1. **Network Tab (Image Compression):** Inspect `great-mesob-feast.png` and `doro-wat.jpg`. Observe that the response `Content-Type` is `image/avif` (or `image/webp`) and transferred byte size is ~28 KB (down from 461 KB - 936 KB).
2. **Preload Scanner (Hero Priority):** Open Page Source (`Ctrl+U`). Notice `<link rel="preload" as="image" ... fetchpriority="high">` emitted for the single hero image.
3. **Network Tab (Self-Hosted Fonts):** Notice that requests for Google Fonts are gone. Font files are loaded locally from `/_next/static/media/*.p.woff2`.
4. **Layout Shift (CLS):** Toggle Network throttling to "Slow 4G". Refresh the page. Notice that the page layout does not jump or shift while fonts or images load.
5. **Third-Party Scripts:** Notice in the Console that `window.__MESOB_TELEMETRY__` loads lazily after the page has finished painting.

---

## Check Yourself — Slide Review Questions

| # | Question | Answer Summary |
| :- | :--- | :--- |
| **1** | **Why does `next/image` require `width` and `height` even though CSS controls display size?** | They establish intrinsic aspect ratio, allowing the browser to reserve the exact layout box before download, eliminating CLS. |
| **2** | **What does the `sizes` attribute change, and what happens without it?** | It informs the browser what width the image will occupy across viewports. Without it, the browser assumes full-width (`100vw`) and downloads massive 3× oversized images. |
| **3** | **Which single image should get `priority`, and why not more than one?** | Only the primary LCP hero image above the fold. Adding `priority` to multiple images forces them to compete for bandwidth, delaying LCP. |
| **4** | **How does `next/font` avoid both invisible text and jumping layout?** | Pairs `display: "swap"` for instant text with metric-adjusted fallback CSS (`size-adjust`) so the font swap causes zero shift. |
| **5** | **You measured a 95 performance score on `npm run dev`. Why is that meaningless?** | Dev mode is unminified, compiles on-demand, skips aggressive image optimizations, and runs HMR websockets. Audits must use `npm run start` throttled. |
| **6** | **A colleague puts the payment secret in `NEXT_PUBLIC_TELEBIRR_KEY`. What have they done?** | The `NEXT_PUBLIC_` prefix bakes the secret into the client-side JavaScript bundle, exposing payment credentials to any visitor. |

