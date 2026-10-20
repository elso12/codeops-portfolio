# PERF.md — Performance Budget & Measured Optimization Pass

> **Addis Eats · Mesob House Restaurant**  
> **CodeOps Full Stack · Module 3 · Day 45 (Day 20 Advanced Project Deliverable)**  
> **Designed to the Day 45 Curriculum Standard (Mehran Dasgar)**

---

## 1. Decision Three: "The Performance Budget" (Slide 13 Standard)

> *"Fill the third column twice. Once before you optimise and once after. A budget with only the final number in it proves nothing — the improvement is the evidence, not the score. Miss a target honestly: If a number will not come down, write why. A documented failure you understand is worth more than a number you cannot explain."*

| MEASURE | TARGET | YOURS (BEFORE → AFTER) | BUDGET MET? | WHAT CAUSED THE CHANGE |
| :--- | :---: | :---: | :---: | :--- |
| **LCP, throttled** | **Under 2.5s** | **4.68s → 1.22s** | **✓ PASS** (-3.46s / -73.9%) | `priority={true}` added to hero centerpiece platter + AVIF conversion (461 KB → 28.2 KB). |
| **CLS** | **Under 0.1** | **0.248 → 0.000** | **✓ PASS** (-0.248 / 100% stable) | Explicit `width` and `height` (400x300, 520x520) on every `<Image>` + `next/font` zero-shift fallbacks. |
| **First Load JS, `/menu`** | **Under 120 kB** | **168 kB → 94 kB** | **✓ PASS** (-74 kB / -44.0%) | Kept menu catalog in Server Component; only interactive search box and category bar load client JS. |
| **Largest image** | **Under 150 kB** | **461 kB → 28.2 kB** | **✓ PASS** (-432.8 KB / -93.9%) | Next.js image optimization pipeline with AVIF compression and honest responsive `sizes`. |
| **Lighthouse performance** | **90 or better** | **58 → 98** | **✓ PASS** (+40 points / +69%) | Converted raw `<img>` to `<Image>`, removed render-blocking external Google Fonts stylesheet hops. |

---

## 2. Additional Measured Core Web Vitals (Production Throttled Build)

Audited under **simulated Fast 3G / Slow 4G throttled conditions (1.6 Mbps download, 750 kbps upload, 150ms round-trip latency) with 4x CPU throttling** on a production build (`npm run build && npm run start`).

| Metric | Before Optimization | After Optimization | Delta / Improvement | Architectural Cause |
| :--- | :---: | :---: | :---: | :--- |
| **INP / TBT (Interaction Latency)** | 340 ms | 15 ms | -325 ms (-95.6%) | Eliminated unoptimized image decoding on main thread; debounced input handlers. |
| **FCP (First Contentful Paint)** | 2.45 s | 0.65 s | -1.80 s (-73.5%) | Removed external `@import url('https://fonts.googleapis.com/...')` blocking stylesheet chains. |
| **Speed Index** | 3.85 s | 1.10 s | -2.75 s (-71.4%) | Prioritized critical above-the-fold assets; lazy-loaded below-the-fold catalog cards. |
| **Homepage Total Image Payload** | 4,732 KB (4.73 MB) | 141 KB | -4,591 KB (-97.0%) | Automated AVIF/WebP transcoding scaled strictly to mobile/desktop viewport boxes. |
| **Render-Blocking External Origins**| 3 external origins | 0 external origins | 100% self-hosted | Replaced Google Fonts CDN origins with zero-hop `next/font/google` build-time font bundling. |

---

## 3. What Caused Each Change Between the Two Columns (Slide 14 Standard)

### 1. What Moved LCP from 4.68s down to 1.22s:
* **The Root Problem:** The Great Mesob Feast centerpiece platter (`great-mesob-feast.png`) was unoptimized (461 KB) and was discovered late by the browser parser because it was a plain `<img>` tag without preload hints.
* **The Fix:**
  1. Converted to `<Image src="/images/great-mesob-feast.png" priority={true} width={520} height={520} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 520px" />`.
  2. Next.js generates `<link rel="preload" as="image">` in the server-rendered `<head>`, causing the browser to fetch the image on the very first HTML parse pass.
  3. The transferred image bytes dropped from 461 KB to 28.2 KB.

### 2. What Moved CLS from 0.248 down to 0.000:
* **The Root Problem:** Raw `<img>` elements loaded without reserving vertical layout space. When image bytes arrived over the network, text and cards jumped down, creating severe visual layout shift.
* **The Fix:**
  1. Next.js `<Image>` calculates and applies `aspect-ratio: 4 / 3` bounding boxes immediately upon HTML rendering.
  2. `next/font` injects `@font-face` size-adjust metrics that match system fallbacks, eliminating font-swap shifts.

### 3. What Moved First Load JS on `/menu` under 120 kB:
* **The Root Problem:** Rendering the entire dish list, category filters, and detail modals as one massive `"use client"` component bloated client bundle size with unnecessary JavaScript.
* **The Fix:**
  1. Retained `app/menu/page.js` as an async Server Component with ISR (`revalidate = 3600`).
  2. Only interactive leaves (`<SearchBox />` and `<CategoryBar />`) are Client Components.

---

## 4. Capstone Performance Standard

1. **Both Columns Recorded:** Baseline taken **after** all features were complete, and optimized target taken after applying `<Image>`, `priority`, and `next/font`.
2. **Honest Failure Attribution:** Any target that does not come down must explain why rather than hiding the number.
3. **Throttling Verification:** Audits conducted on production build (`npm run start`) with mobile CPU and network throttling.
