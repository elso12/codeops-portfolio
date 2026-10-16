# Teacher & Evaluator Walkthrough Guide

**Project:** Addis Eats · Module 03 · Day 43 (Day 18)  
**Topic:** Next.js Performance Engineering, Modern Image Pipeline (`next/image`), Self-Hosted Fonts (`next/font`), Lazy Scripts (`next/script`), and Secure Environment Setup  

---

## Quick Setup

```bash
cd module03/day18
cp .env.example .env.local
npm install
npm run build
npm run start
# Open browser to http://localhost:3000
```

> **Evaluation Rule:** Performance audits MUST be evaluated on `npm run start` (production server), not `npm run dev`.

---

## Step-by-Step Evaluation Checklist

### Step 1: Verify Image Transcoding & Payload Reduction (94%+ Savings)
1. Open Chrome DevTools (`F12`) and select the **Network** tab. Filter by **Img**.
2. Refresh `http://localhost:3000`.
3. Locate the hero centerpiece image `great-mesob-feast.png` and the first dish `doro-wat.jpg`.
4. **Expected Results:**
   - **Request URL:** Dispatched to Next.js image optimizer: `/_next/image?url=%2Fimages%2F...`
   - **Content-Type:** Transcoded to `image/avif` (or `image/webp`).
   - **Payload Size:** Transferred bytes are **~28 KB** (down from **461 KB** for the PNG, and **936 KB** for the JPEG).
   - **Size Savings:** **>94% reduction** in image byte payload.

---

### Step 2: Verify Single Above-the-Fold `priority` Image
1. In the browser, right click anywhere on `http://localhost:3000` and click **View Page Source** (`Ctrl+U`).
2. Search (`Ctrl+F`) for `rel="preload"`.
3. **Expected Results:**
   - Next.js injects `<link rel="preload" as="image" href="/_next/image?url=%2Fimages%2Fgreat-mesob-feast.png..." fetchpriority="high">` inside the server-rendered `<head>`.
   - **Only one image** has this preload link (the Great Mesob Feast centerpiece).
   - All other images (`dish.image` in the specials grid) lack the `priority` flag, ensuring they load lazily and do not compete for initial network bandwidth.

---

### Step 3: Verify Zero-CLS & Self-Hosted `next/font`
1. In Chrome DevTools, select the **Network** tab and filter by **Font**.
2. Clear the cache and refresh the page.
3. **Expected Results:**
   - **Zero external font requests:** No network hops to `fonts.googleapis.com` or `fonts.gstatic.com`.
   - Fonts (`Playfair Display` and `Plus Jakarta Sans`) are served locally from `http://localhost:3000/_next/static/media/*.p.woff2`.
   - Toggle Network throttling to **Slow 4G**. Refresh and observe the header typography.
   - The page renders with **zero layout shift (CLS = 0.000)** because Next.js injects font-metric overrides (`size-adjust`), reserving identical line-height boxes for fallback fonts.

---

### Step 4: Verify Lazy Third-Party Scripts (`next/script`)
1. In Chrome DevTools, open the **Console** tab.
2. Type `window.__MESOB_TELEMETRY__` and press Enter.
3. **Expected Result:**
   ```javascript
   {
     appName: "Addis Eats / Mesob House",
     environment: "production",
     perfOptimized: true,
     loadedAt: 172906...
   }
   ```
4. Verify in the Network tab that `addis-eats-telemetry` loads lazily with `strategy="lazyOnload"`, executing after the browser reaches idle time, preserving an ultra-low Total Blocking Time (TBT = 15ms).

---

### Step 5: Verify Environment Variables Security & Gitignore
1. Open a terminal in `module03/day18`.
2. Run:
   ```bash
   git check-ignore -v .env.local .env.example
   ```
3. **Expected Result:**
   ```
   module03/day18/.gitignore:34:.env*.local    .env.local
   module03/day18/.gitignore:36:!.env.example  .env.example
   ```
   - `.env.local` is **strictly gitignored**.
   - `.env.example` is **whitelisted and committed** with clear instructions.
4. Inspect `.env.example` and `.next/static/chunks/`:
   - No server secrets (`SESSION_SECRET`, `TELEBIRR_APP_KEY`, `DATABASE_URL`) are prefixed with `NEXT_PUBLIC_`.
   - Sensitive cryptographic signing secrets never leak into client JavaScript bundles.

---

### Step 6: Verify `PERF.md` Audit & Attribution
1. Open [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day18/PERF.md).
2. Confirm the complete Core Web Vitals before/after metrics table:
   - **LCP:** 4.68s → 1.22s (-73.9%)
   - **CLS:** 0.248 → 0.000 (-100%)
   - **TBT / INP:** 340ms → 15ms (-95.6%)
   - **Performance Score:** 58 → 98 (+40 pts)
3. Confirm that all 5 "Check yourself" questions from the curriculum reading sheet are thoroughly addressed with engineering rationale.

---

## Code Inspection Summary

| Optimization Item | File | Lines | Verification Check |
| :--- | :--- | :--- | :--- |
| **Hero Image Priority** | `app/page.js` | 92-100 | `<Image priority width={520} height={520} sizes="..." />` |
| **Lazy Below-Fold Images** | `app/page.js` | 185-195 | `<Image width={400} height={300} sizes="..." />` (no priority) |
| **Menu Image Pipeline** | `app/menu/page.js` | 42-51 | `<Image width={400} height={300} sizes="..." />` |
| **Dish Detail Image** | `app/menu/[id]/page.js` | 51-60 | `<Image priority width={840} height={400} sizes="..." />` |
| **Self-Hosted `next/font`**| `app/layout.js` | 7-23 | `Playfair_Display` & `Plus_Jakarta_Sans` with `variable` |
| **Lazy Third-Party Script**| `app/layout.js` | 31-45 | `<Script strategy="lazyOnload" ... />` |
| **Font CSS Variables** | `app/globals.css` | 52-53 | `var(--font-serif)` and `var(--font-sans)` tokens |
| **Remote Host Config** | `next.config.mjs` | 3-19 | `formats: ["image/avif", "image/webp"]`, `remotePatterns` |
| **Committed Example Env** | `.env.example` | 1-45 | Full documentation of server secrets and public flags |
| **Gitignore Protection** | `.gitignore` | 33-37 | `.env*.local` ignored, `!.env.example` committed |
