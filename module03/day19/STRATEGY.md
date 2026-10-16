# Discovery, Indexing & Structured Data Strategy Matrix

This document details the rendering, indexing, OpenGraph preview, and structured data strategy implemented for each route in Day 19 (Module 3 · Day 44).

---

## Route Strategy & Discovery Matrix

| Route | Rendering Strategy | Discovery Tier | Meta Title | Canonical URL | Structured Data | Social Preview |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | **Server Component** | Public Indexable | `Authentic Habesha Hearth & Dining` | `https://addiseats.et/` | `Restaurant` JSON-LD | Root OG (1200x630) |
| `/menu` | **ISR (3,600s)** | Public Indexable | `Menu · Addis Eats` | `https://addiseats.et/menu` | Breadcrumb / Nav | Menu Section OG (1200x630) |
| `/menu/[id]` | **Static (`generateStaticParams`)** | Public Indexable | `${dish.name} · Addis Eats` | `https://addiseats.et/menu/${dish.id}` | `MenuItem` JSON-LD | Dynamic Dish OG (1200x630) |
| `/offers` | **Server Component** | Public Indexable | `Special Offers · Addis Eats` | `https://addiseats.et/offers` | Offer Packages | Root OG (1200x630) |
| `/reservations`| **Server Component** | Public Indexable | `Reservations · Addis Eats` | `https://addiseats.et/reservations` | Reserve Action | Root OG (1200x630) |
| `/cart` | **Server Shell + Client** | Public Shell (Empty basket) | `Cart · Addis Eats` | `https://addiseats.et/cart` | None (Client storage) | Root OG (1200x630) |
| `/checkout` | **Dynamic (`force-dynamic`)** | Private / Disallowed | `Checkout · Addis Eats` | `https://addiseats.et/checkout` | None (Disallowed in robots) | None |
| `/orders` | **Dynamic (`force-dynamic`)** | Private / Disallowed | `My Orders · Addis Eats` | `https://addiseats.et/orders` | None (Disallowed in robots) | None |
| `/kitchen` | **Dynamic (`force-dynamic`)** | Staff Role / Disallowed| `Kitchen Expediter · Addis Eats` | `https://addiseats.et/kitchen` | None (Disallowed in robots) | None |
| `/security-lab`| **Dynamic (`force-dynamic`)** | Public Audit Tool | `Security Lab · Addis Eats` | `https://addiseats.et/security-lab` | None (Excluded from sitemap)| Root OG (1200x630) |
| `/sitemap.xml` | **Static Route Handler** | XML Feed | N/A | Self | Sitemap 0.9 Protocol | N/A |
| `/robots.txt` | **Static Route Handler** | Crawler Directives | N/A | Self | Robots Exclusion Protocol | N/A |

---

## Indexing Lifecycle

1. **Crawler Ingestion:**
   A web crawler requests `/robots.txt` and locates `Sitemap: https://addiseats.et/sitemap.xml`.
2. **URL Discovery:**
   The crawler downloads `/sitemap.xml` and discovers only public pages and dish detail URLs.
3. **HTML Evaluation:**
   Crawlers request each URL and receive fully pre-rendered HTML containing:
   - Exactly one `<h1>` specifying the subject.
   - Descriptive title composed via template.
   - Distinct, human-readable meta description.
   - Canonical URL consolidating query parameters.
4. **Rich Snippet Extraction:**
   The search engine parses the `<script type="application/ld+json">` tag, validating that the price matches the visible text on the page, unlocking rich search results with pricing in ETB.
