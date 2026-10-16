# Addis Eats — Day 44 · Metadata, Previews, Structured Data & SEO Architecture

> **CodeOps Full Stack · Module 3 · Day 44 (Day 19 Deliverable)**  
> Production-grade discoverability for Addis Eats · Mesob House: Next.js Metadata API, title composition templates, human-written route descriptions, dynamic per-dish OpenGraph images with `ImageResponse`, Schema.org `MenuItem` and `Restaurant` JSON-LD structured data, dynamic XML sitemaps, and robots crawler rules.

---

## 1. Executive Summary & Architecture Overview

A fast, secure application that nobody can find is still a private project. Day 44 implements complete discoverability across search engine crawlers (Google, Bing) and social preview bots (Telegram, WhatsApp, Slack, Twitter/X):

```
                                [ WEB CRAWLER / SOCIAL BOT ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
            [ Search Engine Crawler ]                    [ Social Preview Bot ]
             (Googlebot, Bingbot)                       (Telegram, WhatsApp, X)
                       │                                           │
         ┌─────────────┴─────────────┐                             ▼
         ▼                           ▼                 Evaluates <meta property="og:*">
Reads /robots.txt           Reads /sitemap.xml                     │
(Disallow: /cart, /checkout) (Public routes only)                  │
         │                           │                             ▼
         └─────────────┬─────────────┘               Fetches 1200x630 OG Image
                       │                             (app/menu/[id]/opengraph-image.jsx)
                       ▼                                           │
             Fetches HTML Page Source                              ▼
                       │                             Renders Rich Card with Title,
        ┌──────────────┴──────────────┐              Dish Summary, and Price in ETB
        ▼                             ▼
Reads Semantic Markup         Extracts JSON-LD
(Single <h1>, clean <main>)   (Schema.org MenuItem & Restaurant)
```

---

## 2. Core Discoverability Invariants Enforced

| Feature | Implementation | Day 44 Architectural Rationale |
| :--- | :--- | :--- |
| **`metadataBase`** | `new URL("https://addiseats.et")` in `app/layout.js` | Without `metadataBase`, relative image paths in `og:image` tags fail to resolve to absolute URLs, causing Telegram/WhatsApp cards to drop their images. |
| **Title Template** | `template: "%s · Addis Eats"` in `app/layout.js` | Child routes provide only the page subject (e.g. `title: "Menu"` or `title: dish.name`). Next.js automatically composes `Menu · Addis Eats` or `Kitfo · Addis Eats`. |
| **Human Descriptions** | Distinct ~150-char description per route | Eliminates duplicate meta descriptions across routes; written for humans deciding whether to click from search results. |
| **Canonical URLs** | `alternates: { canonical: "..." }` | Prevents parameterized variations (`?category=...`, `?page=...`) from splitting domain ranking authority. |
| **Dynamic OG Previews** | `ImageResponse` from `next/og` (1200 × 630) | Server-renders tailored graphic cards showing dish title, category, description, and price in ETB. |
| **Schema.org JSON-LD** | `MenuItem` & `Restaurant` scripts | Generates rich Google search results (price, availability, cuisine) from the exact same data rendered on the page. |
| **Dynamic XML Sitemap** | `app/sitemap.js` | Built dynamically from database records. Strictly excludes private routes (`/cart`, `/checkout`, `/orders`, `/kitchen`). |
| **Robots Rules** | `app/robots.js` | Disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, `/api/` and points directly to `${baseUrl}/sitemap.xml`. |

---

## 3. Live Page Source Verification Proofs

All verifications were executed by viewing source on the running production server (`http://localhost:3000`):

### Verification A: Root Layout & Home Page (`/`)
- **Rendered Title:** `<title>Authentic Habesha Hearth &amp; Communal Dining</title>`
- **Meta Description:** `<meta name="description" content="Gather around the woven mesob for handcrafted slow-cooked wats, stone-ground 100% teff injera, and charcoal-roasted Jebena Buna ceremonies in Addis Ababa."/>`
- **Canonical URL:** `<link rel="canonical" href="https://addiseats.et"/>`
- **Absolute OG Image:** `<meta property="og:image" content="https://addiseats.et/opengraph-image?07b535b4c90dbeee"/>`
- **Structured Data:** `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Restaurant","name":"Addis Eats · Mesob House",...}</script>`
- **Single `<h1>`:** `<h1 class="hero-figma__title">Communal Warmth, <br/><span class="hero-figma__italic">Slow-Cooked Heritage.</span></h1>`

### Verification B: Banquet Menu Catalog (`/menu`)
- **Rendered Title:** `<title>Menu · Addis Eats</title>` (composed via root template `%s · Addis Eats`)
- **Meta Description:** `<meta name="description" content="Doro Wat, Tibs, Kitfo and Shiro, delivered across Addis Ababa."/>`
- **Canonical URL:** `<link rel="canonical" href="https://addiseats.et/menu"/>`
- **Section OG Image:** `<meta property="og:image" content="https://addiseats.et/menu/opengraph-image?d04263abe8c24815"/>`
- **Single `<h1>`:** `<h1 class="section-title-large">Authentic Habesha Menu</h1>`

### Verification C: Dynamic Dish Routes (`/menu/dish_001` vs `/menu/dish_004`)
- **Doro Wat (`dish_001`):**
  - `<title>Doro Wat · Addis Eats</title>`
  - `<meta name="description" content="Doro Wat — 180 ETB. Slow-cooked tender chicken in rich berbere spice sauce with a hard-boiled egg."/>`
  - `<link rel="canonical" href="https://addiseats.et/menu/dish_001"/>`
  - `<meta property="og:image" content="https://addiseats.et/menu/dish_001/opengraph-image?..."/>`
  - JSON-LD: `"@type":"MenuItem","name":"Doro Wat","offers":{"price":180,"priceCurrency":"ETB"}`
  - Page visible price: `180 ETB` (Matches JSON-LD exactly)
  - `<h1 class="detail-card__title">Doro Wat</h1>`
- **Kitfo (`dish_004`):**
  - `<title>Kitfo · Addis Eats</title>`
  - `<meta name="description" content="Kitfo — 220 ETB. Ethiopian steak tartare seasoned with mitmita and spiced herbal butter (niter kibbeh)."/>`
  - `<link rel="canonical" href="https://addiseats.et/menu/dish_004"/>`
  - `<meta property="og:image" content="https://addiseats.et/menu/dish_004/opengraph-image?..."/>`
  - JSON-LD: `"@type":"MenuItem","name":"Kitfo","offers":{"price":220,"priceCurrency":"ETB"}`
  - Page visible price: `220 ETB` (Matches JSON-LD exactly)
  - `<h1 class="detail-card__title">Kitfo</h1>`

### Verification D: Dynamic Sitemap (`/sitemap.xml`)
- Contains public routes only: `https://addiseats.et`, `https://addiseats.et/menu`, `https://addiseats.et/offers`, `https://addiseats.et/reservations`, and individual dish routes (`/menu/dish_001` through `dish_006`).
- **Zero** private routes: strictly no `/cart`, `/checkout`, `/orders`, `/kitchen`, `/login`, or `/register`.

### Verification E: Crawler Directives (`/robots.txt`)
```text
User-Agent: *
Allow: /
Disallow: /cart
Disallow: /checkout
Disallow: /orders
Disallow: /kitchen
Disallow: /api/

Sitemap: https://addiseats.et/sitemap.xml
```

---

## 4. Lecture Review Questions & Answers (Slide 27)

1. **Why can a page marked `"use client"` not export metadata?**  
   Next.js resolves metadata on the server before rendering the page shell to generate `<head>` tags into the initial HTML stream. Client components are packaged for browser execution and do not execute during server-side `<head>` composition. (Resolved in Day 44 by wrapping client components inside a Server Component shell, as in `app/cart/page.js` & `CartClient.jsx`).

2. **What does a title template save you, and where is it defined?**  
   Defined in `app/layout.js` (`template: "%s · Addis Eats"`), a title template saves you from manually repeating the brand suffix on every page. Child pages specify only their concise subject (e.g. `title: "Menu"` or `title: dish.name`), which Next.js automatically composes into `Menu · Addis Eats` or `Kitfo · Addis Eats`.

3. **A shared link shows no picture. What is the first thing to check?**  
   Check `metadataBase` in the root layout (`app/layout.js`). Without `metadataBase` configured with the production domain (`https://addiseats.et`), relative image paths fail to resolve to absolute URLs. Social crawlers (Telegram, WhatsApp, iMessage, Twitter) reject relative image paths.

4. **Why does `generateMetadata` calling `getDishById` not double your database load?**  
   Next.js and React deduplicate in-flight fetch requests and cached data calls within the same server render lifecycle. The data fetched during `generateMetadata` is reused by the server page component with zero duplicate network or database queries.

5. **You have `/menu` and `/menu?category=vegan`. What problem is that, and what fixes it?**  
   Search engine crawlers treat parameterized URLs as distinct duplicate pages, diluting domain authority and splitting ranking signals. Adding `alternates: { canonical: "/menu" }` instructs crawlers to consolidate all ranking power into the authoritative canonical URL.

6. **Name two things from earlier this week that helped SEO more than any tag today.**  
   - **Fast Core Web Vitals (Day 43):** Next.js `<Image>` dimensions, honest `sizes`, priority LCP preloading, and `next/font` zero-CLS self-hosting ensure lightning-fast mobile load times. Google heavily penalizes slow, shifting mobile pages.
   - **Server Components & Semantic HTML (Day 37 / Day 38):** Delivering full pre-rendered HTML on first paint means crawlers read complete content immediately without waiting for client-side JavaScript execution.
