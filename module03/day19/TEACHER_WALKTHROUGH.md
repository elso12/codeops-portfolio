# Teacher & Evaluator Walkthrough Guide

**Project:** Addis Eats · Module 03 · Day 44 (Day 19 Deliverable)  
**Topic:** Metadata API, Title Templates, OpenGraph `ImageResponse`, Schema.org Structured Data (JSON-LD), Dynamic XML Sitemap, and Robots Directives  

---

## Quick Setup

```bash
cd module03/day19
npm install
npm run build
npm run start -- -p 3000
# Open browser or terminal to http://localhost:3000
```

---

## Step-by-Step Evaluation Walkthrough

### Step 1: Verify `metadataBase` & Absolute URLs in Social Previews
1. Run in terminal:
   ```bash
   curl -s http://localhost:3000/ | grep "og:image"
   ```
2. **Observe:** The `og:image` URL is an absolute URL pointing to your domain:
   `<meta property="og:image" content="https://addiseats.et/opengraph-image?..."/>`.
3. **Curriculum Concept:** Without `metadataBase: new URL(...)` in `app/layout.js`, Next.js cannot resolve relative URLs, causing Telegram, WhatsApp, and Twitter cards to break.

---

### Step 2: Verify Title Composition via Template
1. Compare the HTML title on `/menu`:
   ```bash
   curl -s http://localhost:3000/menu | grep "<title>"
   ```
2. **Observe:** `<title>Menu · Addis Eats</title>`.
3. Notice that `app/menu/page.js` exports only `title: "Menu"`. Next.js automatically appends `" · Addis Eats"` via the root layout title template (`template: "%s · Addis Eats"`).

---

### Step 3: Verify Dynamic `generateMetadata` & Unique Descriptions
1. Compare the meta descriptions of two different dishes:
   ```bash
   # Dish 1 (Doro Wat)
   curl -s http://localhost:3000/menu/dish_001 | grep "name=\"description\""
   
   # Dish 4 (Kitfo)
   curl -s http://localhost:3000/menu/dish_004 | grep "name=\"description\""
   ```
2. **Observe:**
   - Doro Wat: `"Doro Wat — 180 ETB. Slow-cooked tender chicken in rich berbere spice sauce with a hard-boiled egg."`
   - Kitfo: `"Kitfo — 220 ETB. Ethiopian steak tartare seasoned with mitmita and spiced herbal butter (niter kibbeh)."`
3. **Curriculum Concept:** Every dish page provides unique, human-readable copy rather than duplicate boilerplate.

---

### Step 4: Verify Schema.org `MenuItem` JSON-LD Matches Page Price
1. Run:
   ```bash
   curl -s http://localhost:3000/menu/dish_001 | grep "application/ld+json"
   ```
2. **Observe:** The structured data contains `"price": 180, "priceCurrency": "ETB"`.
3. Check the rendered HTML on the page:
   ```bash
   curl -s http://localhost:3000/menu/dish_001 | grep -C 1 "price-val"
   ```
4. **Observe:** The page visible price is `180 ETB`. Disagreeing prices are penalized by search engines.

---

### Step 5: Verify XML Sitemap Excludes Private Routes
1. Run:
   ```bash
   curl -s http://localhost:3000/sitemap.xml
   ```
2. **Observe:**
   - Public pages (`https://addiseats.et/`, `/menu`, `/offers`, `/reservations`, and dishes `/menu/dish_*`) are present.
   - Private routes (`/cart`, `/checkout`, `/orders`, `/kitchen`, `/login`) are **strictly excluded**.

---

### Step 6: Verify `robots.txt` Disallows Private Paths
1. Run:
   ```bash
   curl -s http://localhost:3000/robots.txt
   ```
2. **Observe:**
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

### Step 7: Verify Heading Hierarchy (Single `<h1>` Rule)
1. Run the audit across all routes:
   ```powershell
   $routes = @("/", "/menu", "/menu/dish_001", "/offers", "/reservations", "/cart", "/login", "/security-lab")
   foreach ($r in $routes) {
       $res = Invoke-WebRequest -Uri "http://localhost:3000$r"
       $count = ([regex]::Matches($res.Content, '<h1[^>]*>(.*?)</h1>')).Count
       Write-Host "$r -> H1 Count: $count"
   }
   ```
2. **Observe:** Every single route returns `H1 Count: 1`.
