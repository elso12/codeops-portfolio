# Addis Eats — Day 44 · Metadata, Previews, Structured Data & SEO Architecture

> **CodeOps Full Stack · Module 3 · Day 44 (Day 19 Deliverable)**  
> Production-grade discoverability for Addis Eats · Mesob House: Next.js Metadata API, title composition templates, human-written route descriptions, dynamic per-dish OpenGraph images with `ImageResponse`, Schema.org `MenuItem` and `Restaurant` JSON-LD structured data, dynamic XML sitemaps, and robots crawler rules.

---

## 7 Exercises Completed & Verified Against Running Page Source

- [x] **Exercise 1 — `metadataBase` & Title Template in Root Layout:** Configured `metadataBase: new URL("https://addiseats.et")` and title template `template: "%s · Addis Eats"` with default `default: "Addis Eats — food delivery in Addis Ababa"` in [`app/layout.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/app/layout.js).
- [x] **Exercise 2 — Static Route Titles & Descriptions:** Every static route (`/`, `/menu`, `/offers`, `/reservations`, `/cart`, `/checkout`, `/login`, `/register`, `/orders`, `/kitchen`, `/security-lab`) exports its own short title, human-written description, and canonical link.
- [x] **Exercise 3 — `generateMetadata` on Dish Route:** Built dynamic metadata generator in [`app/menu/[id]/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/app/menu/%5Bid%5D/page.js) taking name, price in ETB, and summary from the record. Two different dishes yield two completely distinct titles and descriptions.
- [x] **Exercise 4 — Site-Wide & Per-Dish `opengraph-image` with `ImageResponse`:**
  - Site-wide image: [`app/opengraph-image.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/app/opengraph-image.jsx) at 1200 × 630.
  - Section image: [`app/menu/opengraph-image.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/app/menu/opengraph-image.jsx) at 1200 × 630.
  - Per-dish dynamic card: [`app/menu/[id]/opengraph-image.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/app/menu/%5Bid%5D/opengraph-image.jsx) at 1200 × 630 with dish name, category, price in ETB, and brand styling.
- [x] **Exercise 5 — `MenuItem` & `Restaurant` JSON-LD:**
  - Dish details render Schema.org `MenuItem` JSON-LD generated from the same dish record displayed on page. The ETB price in the structured data matches the visible platter price.
  - Homepage renders Schema.org `Restaurant` JSON-LD with Habesha cuisine details, address in Bole Rwanda, and menu reference.
- [x] **Exercise 6 — Dynamic Sitemap (`app/sitemap.js`):** Generates public routes (`/`, `/menu`, `/offers`, `/reservations`) plus all individual `/menu/[id]` dishes from records. Strictly excludes private and authenticated routes (`/cart`, `/checkout`, `/orders`, `/kitchen`, `/login`, `/register`).
- [x] **Exercise 7 — Robots Directives (`app/robots.js`):** Disallows `/cart`, `/checkout`, `/orders`, `/kitchen`, and `/api/`, and points search crawlers to `https://addiseats.et/sitemap.xml`.

---

## Live Page Source Verification Scorecard

```text
========================================================================================
                          PAGE SOURCE VERIFICATION AUDIT
========================================================================================
Route            Title (Live Output)                     Canonical URL            H1 Count
----------------------------------------------------------------------------------------
/                Authentic Habesha Hearth & Dining       https://addiseats.et/    1
/menu            Menu · Addis Eats                       https://addiseats.et/menu 1
/menu/dish_001   Doro Wat · Addis Eats                   .../menu/dish_001        1
/menu/dish_004   Kitfo · Addis Eats                      .../menu/dish_004        1
/offers          Special Offers · Addis Eats             https://addiseats.et/offers 1
/reservations    Reservations · Addis Eats               .../reservations         1
/cart            Cart · Addis Eats                       https://addiseats.et/cart 1
/checkout        Checkout · Addis Eats                   .../checkout             1
/login           Sign In · Addis Eats                    https://addiseats.et/login 1
/register        Register · Addis Eats                   .../register             1
/security-lab    Security Lab · Addis Eats               .../security-lab         1
========================================================================================
```

---

## Check Yourself Verification Checklist

- **Does the page source show absolute URLs in every `og:image` tag?**  
  **Yes.** `https://addiseats.et/opengraph-image...` and `https://addiseats.et/menu/dish_001/opengraph-image...` are emitted as full absolute URLs via `metadataBase`.
- **Do two different dish pages have two different descriptions?**  
  **Yes.** Doro Wat: `"Doro Wat — 180 ETB. Slow-cooked tender chicken..."` vs. Kitfo: `"Kitfo — 220 ETB. Ethiopian steak tartare..."`.
- **Does your sitemap contain any route that requires signing in?**  
  **No.** Audited `/sitemap.xml` contains zero occurrences of `/orders`, `/kitchen`, `/checkout`, `/cart`, or `/login`.
- **Does the JSON-LD price match the price on the page, in ETB?**  
  **Yes.** Both page and JSON-LD display `180 ETB` for Doro Wat and `220 ETB` for Kitfo.
- **Is there exactly one `<h1>` on each page, and does it describe the page?**  
  **Yes.** Every page contains exactly one `<h1>` that describes its contents.
- **Would a link to a dish look worth opening if you saw it in a group chat?**  
  **Yes.** Generates rich Telegram/WhatsApp/Twitter cards with 1200 × 630 custom graphics, dish description, and clear price tags.

---

## Detailed Audit & Slide Review Answers

Full technical responses to all 6 lecture review questions are documented in [`SEO_AUDIT.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day19/SEO_AUDIT.md).
