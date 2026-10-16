# Metadata, OpenGraph & Discovery Boundary Matrix

This document defines the architectural boundary for every route, component, and metadata pipeline in Day 19 (Module 3 · Day 44), specifying execution environment, discovery tier, rendering strategy, and rationale.

---

## Architecture Boundaries Matrix

| File / Component | Environment | Type | Discovery & SEO Rationale |
| :--- | :--- | :--- | :--- |
| `app/layout.js` | **Server Component** | App Shell | Defines root `metadataBase: new URL("https://addiseats.et")` so relative image paths in social tags resolve to absolute URLs. Declares title template `template: "%s · Addis Eats"` and default title. |
| `app/opengraph-image.jsx` | **Server (ImageResponse)** | Root OG Generator | Generates dynamic 1200 × 630 PNG card using Satori flexbox layout for the entire site when shared on Telegram, WhatsApp, Slack, or Twitter. |
| `app/page.js` | **Server Component** | Home & Hearth | Exports static title and human description. Embeds Schema.org `Restaurant` JSON-LD structured data with Habesha cuisine, location, and menu reference. |
| `app/menu/page.js` | **Server Component (ISR 3600s)** | Banquet Catalog | Exports `title: "Menu"` (composing to `Menu · Addis Eats`) and `alternates: { canonical: "/menu" }` to prevent query string fragmentation. |
| `app/menu/opengraph-image.jsx` | **Server (ImageResponse)** | Section OG Generator | Generates tailored 1200 × 630 PNG card for the banquet catalog route. |
| `app/menu/[id]/page.js` | **Server Component (Static)** | Dish Detail Shell | Executes `generateMetadata` dynamically from the dish record. Injects Schema.org `MenuItem` JSON-LD whose price matches the visible ETB price. |
| `app/menu/[id]/opengraph-image.jsx` | **Server (ImageResponse)** | Per-Dish OG Generator | Server-renders high-contrast 1200 × 630 preview card containing dish name, category pill, description, and price in ETB. |
| `app/cart/page.js` | **Server Component** | Cart Shell | Server shell exporting static metadata (`title: "Cart"`, canonical URL) and server-rendered single `<h1>`, wrapping client-side `CartClient.jsx`. |
| `app/cart/CartClient.jsx` | **Client Component** | Interactive Leaf | Browser-only cart state (localStorage). Excluded from sitemap. |
| `app/checkout/page.js` | **Server Component** | Checkout Shell | Authenticated ordering flow. Protected by Edge middleware and server session check. Disallowed in `robots.txt` and omitted from sitemap. |
| `app/sitemap.js` | **Server Route Handler** | XML Sitemap | Dynamically queries dish records at build time. Generates URLs with priority and changeFrequency. Excludes private routes. |
| `app/robots.js` | **Server Route Handler** | Crawler Policy | Issues `robots.txt` disallowing `/cart`, `/checkout`, `/orders`, `/kitchen`, `/api/` and pointing crawlers to `${baseUrl}/sitemap.xml`. |

---

## The Four Discovery Principles

1. **`metadataBase` is Mandatory for Social Cards:**  
   Without `metadataBase` in the root layout, Next.js cannot determine the production origin of relative assets. Social preview crawlers reject relative URLs, resulting in blank preview cards.
2. **Title Composition Over Duplication:**  
   Title templates (`%s · Addis Eats`) keep route titles clean, short, and focused on the distinguishing keyword.
3. **Structured Data Must Match Visible UI:**  
   Search engines flag websites that report a lower price in JSON-LD than what is displayed in the HTML. Prices are generated from the identical data record rendered on the page.
4. **Crawl Budget Protection:**  
   Search engines waste valuable crawl budget if directed to private routes requiring authentication. Disallowing them in `robots.txt` and excluding them from `sitemap.xml` keeps indexing focused on high-traffic public pages.
