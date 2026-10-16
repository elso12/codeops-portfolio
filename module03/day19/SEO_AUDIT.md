# Addis Eats — Search Engine Optimization & Social Discovery Audit (Day 44)

> **Module 3 · Day 44 (Day 19 Project)**  
> **Topic:** Next.js Metadata API, Dynamic OpenGraph Image Generation, Schema.org Structured Data (JSON-LD), XML Sitemaps, and Robots Control.

---

## 1. Executive Summary & Verification Matrix

Every exercise requirement has been verified against the **live server response** using `curl` and DOM regex inspectors on running endpoints:

| Exercise / Check | Status | Verification Target | Live Page Source Proof |
| :--- | :---: | :--- | :--- |
| **1. Root Layout `metadataBase` & Title Template** | **PASS** | `app/layout.js` | `<title>Authentic Habesha Hearth & Communal Dining</title>`, `template: "%s · Addis Eats"`, `metadataBase: "https://addiseats.et"` |
| **2. Static Route Titles & Human Descriptions** | **PASS** | `/`, `/menu`, `/offers`, `/reservations`, `/cart`, `/checkout`, `/login`, `/register`, `/security-lab` | Every static route exports dedicated human-readable descriptions, short titles, and unique canonical tags |
| **3. `generateMetadata` on Dish Route** | **PASS** | `/menu/[id]` | Pre-renders dish name, price in ETB, and culinary summary into `<title>` and `<meta name="description">` |
| **4. Site-Wide & Per-Dish `opengraph-image`** | **PASS** | `app/opengraph-image.jsx`, `app/menu/opengraph-image.jsx`, `app/menu/[id]/opengraph-image.jsx` | 1200 × 630 PNG images generated dynamically with `ImageResponse`. Absolute URLs resolved everywhere |
| **5. MenuItem JSON-LD Structured Data** | **PASS** | `app/menu/[id]/page.js` | Emits `<script type="application/ld+json">` matching exact dish name and price in ETB |
| **6. Dynamic XML Sitemap** | **PASS** | `/sitemap.xml` | Generated from real dishes data. All private routes (`/cart`, `/checkout`, `/orders`, `/kitchen`) excluded |
| **7. Crawler Directives in `robots.js`** | **PASS** | `/robots.txt` | Explicitly disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, `/api/` and points to sitemap |

---

## 2. Check Yourself — Six Core Quality Questions

### Q1: Does the page source show absolute URLs in every `og:image` tag?
**Yes.** Verified on live pages:
- **Root (`/`):** `<meta property="og:image" content="https://addiseats.et/opengraph-image?07b535b4c90dbeee"/>`
- **Menu Catalog (`/menu`):** `<meta property="og:image" content="https://addiseats.et/menu/opengraph-image?d04263abe8c24815"/>`
- **Doro Wat (`/menu/dish_001`):** `<meta property="og:image" content="https://addiseats.et/menu/dish_001/opengraph-image?497ad641eabdc12f"/>`
- **Kitfo (`/menu/dish_004`):** `<meta property="og:image" content="https://addiseats.et/menu/dish_004/opengraph-image?497ad641eabdc12f"/>`

### Q2: Do two different dish pages have two different descriptions?
**Yes.** Live extraction from running HTML:
- **Doro Wat (`/menu/dish_001`):**
  ```html
  <meta name="description" content="Doro Wat — 180 ETB. Slow-cooked tender chicken in rich berbere spice sauce with a hard-boiled egg."/>
  ```
- **Kitfo (`/menu/dish_004`):**
  ```html
  <meta name="description" content="Kitfo — 220 ETB. Ethiopian steak tartare seasoned with mitmita and spiced herbal butter (niter kibbeh)."/>
  ```

### Q3: Does your sitemap contain any route that requires signing in?
**No.** Audited live `/sitemap.xml`:
- Contains public routes only: `https://addiseats.et/`, `https://addiseats.et/menu`, `https://addiseats.et/offers`, `https://addiseats.et/reservations`, and `/menu/dish_001` through `dish_006`.
- **Zero** private routes: `/orders`, `/checkout`, `/cart`, `/kitchen`, `/login`, and `/register` are strictly omitted.

### Q4: Does the JSON-LD price match the price on the page, in ETB?
**Yes.** Verified against rendered markup:
- **Doro Wat (`/menu/dish_001`):**
  - Page visible price: `180 ETB`
  - JSON-LD price: `"price": 180, "priceCurrency": "ETB"`
- **Kitfo (`/menu/dish_004`):**
  - Page visible price: `220 ETB`
  - JSON-LD price: `"price": 220, "priceCurrency": "ETB"`

### Q5: Is there exactly one `<h1>` on each page, and does it describe the page?
**Yes.** Live audit of all routes:
- `/` &rarr; `1` &rarr; `Communal Warmth, Slow-Cooked Heritage.`
- `/menu` &rarr; `1` &rarr; `Authentic Habesha Menu`
- `/menu/dish_001` &rarr; `1` &rarr; `Doro Wat`
- `/menu/dish_004` &rarr; `1` &rarr; `Kitfo`
- `/offers` &rarr; `1` &rarr; `Mesob House Special Offers`
- `/reservations` &rarr; `1` &rarr; `Reserve a Handcrafted Mesob`
- `/cart` &rarr; `1` &rarr; `Your Mesob Dining Cart`
- `/login` &rarr; `1` &rarr; `Addis Eats Sign In`
- `/register` &rarr; `1` &rarr; `Join Mesob House`
- `/security-lab` &rarr; `1` &rarr; `Security Architecture & Attack Lab`

### Q6: Would a link to a dish look worth opening if you saw it in a group chat?
**Yes.** Rich cards generate with:
- **Title:** `Kitfo · Addis Eats`
- **Description:** `Kitfo — 220 ETB. Ethiopian steak tartare seasoned with mitmita and spiced herbal butter (niter kibbeh).`
- **Image:** 1200 × 630 high-contrast branded card displaying dish name, category pill, description, price badge (`220 ETB`), and hearth branding.
- **Card Type:** `summary_large_image` (Twitter/X) and `website` (Telegram/WhatsApp/Slack).

---

## 3. Review Questions & Answers (Slide 27)

1. **Why can a page marked `"use client"` not export metadata?**  
   Next.js resolves metadata on the server before rendering the page shell to generate `<head>` tags into the initial HTML stream. Client components are bundled into client JavaScript bundles that execute only after browser hydration; they cannot participate in server-side `<head>` construction. To add metadata to a client flow, wrap the client component inside a server page shell (as implemented in `app/cart/page.js` & `CartClient.jsx`).

2. **What does a title template save you, and where is it defined?**  
   Defined in `app/layout.js` (`template: "%s · Addis Eats"`), a title template saves you from manually repeating the brand suffix on every page. Individual child pages supply only their concise subject (e.g. `title: "Menu"` or `title: dish.name`), which Next.js composes into `Menu · Addis Eats` or `Kitfo · Addis Eats`.

3. **A shared link shows no picture. What is the first thing to check?**  
   Check `metadataBase` in the root layout (`app/layout.js`). Without `metadataBase` configured with your production domain (`https://addiseats.et`), relative image paths cannot resolve to absolute URLs. Social crawlers (Telegram, WhatsApp, iMessage, Twitter) reject relative image paths.

4. **Why does `generateMetadata` calling `getDishById` not double your database load?**  
   Next.js and React deduplicate in-flight fetch requests and cached data calls within the same server render lifecycle. The data fetched during `generateMetadata` is reused by the server page component with zero duplicate network or database queries.

5. **You have `/menu` and `/menu?category=vegan`. What problem is that, and what fixes it?**  
   Search engine crawlers treat parameterized URLs as distinct duplicate pages, diluting domain authority and splitting ranking signals. Adding `alternates: { canonical: "/menu" }` instructs crawlers to consolidate all ranking power into the authoritative canonical URL.

6. **Name two things from earlier this week that helped SEO more than any tag today.**  
   - **Fast Core Web Vitals (Day 43):** Next.js `<Image>` dimensions, honest `sizes`, priority LCP preloading, and `next/font` zero-CLS self-hosting ensure lightning-fast mobile load times. Google heavily penalizes slow, shifting mobile pages.
   - **Server Components & Semantic HTML (Day 37 / Day 38):** Delivering full pre-rendered HTML on first paint means crawlers read complete content immediately without waiting for client-side JavaScript execution.
