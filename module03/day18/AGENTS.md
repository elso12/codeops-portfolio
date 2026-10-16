# AGENTS.md — Day 18 (Module 3 · Day 43) Performance & Optimization Guidelines

This document provides architectural rules, critical invariants, and development guidelines for AI agents working in this repository.

---

## Performance & Optimization Invariants (NEVER VIOLATE)

1. **Next.js `<Image>` Pipeline:**
   - NEVER use raw `<img>` tags for application assets. Always use `next/image`.
   - Every `<Image>` MUST specify explicit intrinsic `width` and `height` dimensions to prevent Cumulative Layout Shift (CLS).
   - Every `<Image>` MUST provide an honest `sizes` media query attribute reflecting the actual layout width across mobile, tablet, and desktop viewports.
   - Every `<Image>` MUST include descriptive, accessible `alt` text explaining the content of the image.

2. **Single Above-The-Fold `priority` Rule:**
   - Exactly ONE image above the fold (the primary LCP hero image) may have the `priority` (or `priority={true}`) attribute on any given page.
   - NEVER add `priority` to below-the-fold or grid images. Next.js must be allowed to apply native browser lazy loading (`loading="lazy"`) and asynchronous decode.

3. **Remote Images & Formats Configuration:**
   - All remote image domains must be declared in `next.config.mjs` under `images.remotePatterns`.
   - Modern compression formats `formats: ["image/avif", "image/webp"]` must remain enabled.

4. **Zero-CLS Font Pipeline (`next/font`):**
   - NEVER use external `<link href="https://fonts.googleapis.com/..." rel="stylesheet">` or CSS `@import url(...)` for fonts.
   - Fonts MUST be imported and configured via `next/font/google` (`Playfair_Display` and `Plus_Jakarta_Sans`).
   - Font subsets, `display: "swap"`, and CSS custom property variables (`--font-serif`, `--font-sans`) must be used to ensure build-time self-hosting and zero runtime font requests.

5. **Third-Party Script Strategy:**
   - Third-party scripts (analytics, marketing, fraud detection, customer chat widgets) MUST use `next/script`.
   - Non-critical scripts MUST use `strategy="lazyOnload"` so execution is deferred to browser idle time after hydration, preserving low Total Blocking Time (TBT < 50ms).

6. **Environment Variables & Secret Isolation:**
   - NEVER prefix private server secrets (`SESSION_SECRET`, `DATABASE_URL`, `TELEBIRR_APP_KEY`) with `NEXT_PUBLIC_`.
   - Private secrets must remain strictly server-side.
   - `.env*.local` MUST be gitignored.
   - `.env.example` MUST remain committed and documented.

---

## Security Invariants (Retained from Day 17)

1. **Authentication in Server Actions:**
   - Every state-changing server action in `app/actions.js` is a public HTTP POST endpoint.
   - You MUST call `const user = await getSession();` at the beginning of the action.
   - If `!user`, throw an error or return `{ ok: false, error: "Unauthorized" }`.

2. **Authorization & Record Ownership (Anti-IDOR):**
   - NEVER accept a `userId` from client form data or RPC arguments to determine record ownership.
   - Always load the record by ID, then verify `record.userId === user.id`.

3. **Role-Based Access Control (RBAC):**
   - Hiding links in the navigation bar is for UX only, NOT security.
   - Always verify `user.role === 'staff'` in the Server Component (`app/kitchen/page.js`) and in any staff server action (`updateKitchenStatus`).

4. **Open Redirect Prevention:**
   - Any redirection based on user input (such as `nextDestination`) MUST be sanitized through `sanitizeNextUrl(next)`.

---

## Key Files & Responsibilities

- `PERF.md`: Core Web Vitals before-and-after audit report with line-by-line attribution.
- `next.config.mjs`: Image optimization configuration, AVIF/WebP formats, and remote host whitelist.
- `app/layout.js`: Root shell with `next/font` zero-CLS font definitions and `next/script` lazy telemetry.
- `app/page.js`: Homepage with single `priority` centerpiece `<Image>` and lazy featured dish cards.
- `app/menu/page.js`: Banquet menu with lazy `<Image>` grid and honest sizes.
- `app/menu/[id]/page.js`: Dish detail with single hero `<Image>`.
- `.env.example`: Committed template documenting all server and public environment variables.
- `.gitignore`: Whitelists `.env.example` while strictly ignoring `.env*.local`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
