# AGENTS.md — Day 19 (Module 3 · Day 44) Metadata, Previews & SEO Guidelines

This document provides architectural rules, critical invariants, and development guidelines for AI agents working in this repository.

---

## Metadata & Discovery Invariants (NEVER VIOLATE)

1. **`metadataBase` & Production Domain Resolution:**
   - Root layout (`app/layout.js`) MUST define `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://addiseats.et")`.
   - Never omit `metadataBase`. Without it, relative image paths in OpenGraph tags fail to resolve to absolute URLs, causing social link previews to drop their cards.

2. **Title Composition & Templates:**
   - Root layout MUST define a title template: `template: "%s · Addis Eats"`.
   - Static child routes MUST NOT repeat the `"· Addis Eats"` brand suffix; export only the page subject (e.g. `title: "Menu"`).
   - Dynamic dish routes MUST derive their title from data via `generateMetadata`.

3. **Human Descriptions & Anti-Duplication:**
   - Every route MUST export a unique, human-written description (~150 characters) summarizing what the diner receives.
   - Never reuse a generic site-wide description across multiple dish or menu pages.

4. **Canonical URLs on Parameterized Routes:**
   - Every route that accepts query parameters (e.g. `/menu`, `/checkout`, `/login`) MUST define `alternates: { canonical: "..." }`.
   - This consolidates search engine ranking signals and prevents query strings from dividing domain authority.

5. **OpenGraph 1200 × 630 & `ImageResponse`:**
   - OpenGraph images MUST strictly adhere to the 1200 × 630 aspect ratio.
   - Site-wide previews live in `app/opengraph-image.jsx`.
   - Section previews live in `app/menu/opengraph-image.jsx`.
   - Per-dish dynamic previews live in `app/menu/[id]/opengraph-image.jsx`.
   - When building JSX for `ImageResponse` (Satori), all multi-child container elements MUST declare `display: "flex"`.

6. **Structured Data (JSON-LD) Consistency:**
   - Schema.org structured data MUST be generated from the exact same server data object rendered in the UI.
   - The price in `MenuItem` JSON-LD MUST match the visible price displayed on the page in ETB. Disagreeing prices are flagged as deceptive by search engines.

7. **Sitemap & Robots Privacy Invariants:**
   - `app/sitemap.js` MUST include public pages only (`/`, `/menu`, `/offers`, `/reservations`, and dishes).
   - NEVER include routes that require authentication (`/orders`, `/kitchen`, `/checkout`, `/cart`, `/login`, `/register`).
   - `app/robots.js` MUST disallow private and transaction paths (`/cart`, `/checkout`, `/orders`, `/kitchen`, `/api/`) and point directly to `${baseUrl}/sitemap.xml`.

8. **Semantic Hierarchy (Single `<h1>` Rule):**
   - Every page MUST render exactly ONE `<h1>` element that clearly describes the page topic.
   - Subheadings must use `<h2>` through `<h6>` in logical semantic order.

---

## Retained Performance & Security Invariants

- **Next.js `<Image>` Pipeline:** Dimensions `width` & `height`, honest `sizes`, priority on primary above-the-fold centerpiece only.
- **`next/font` Self-Hosting:** Zero runtime external font network hops.
- **Session Secrets:** Never prefix private server secrets with `NEXT_PUBLIC_`.
- **Server Actions:** Require `getSession()` authentication check, IDOR ownership verification, and staff RBAC validation.
