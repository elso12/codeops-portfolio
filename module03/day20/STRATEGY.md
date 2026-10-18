# Addis Eats (Mesob House) — Routing and Rendering Strategy (STRATEGY.md)

> **Course:** Module 3 · Frontend Web Development (React & Next.js)  
> **Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Framework:** Next.js 16 (App Router) + React 19

---

## 1. Project Folder Tree & Route Architecture

```text
app/
├── (auth)/
│   ├── login/
│   │   ├── page.js                     # Login portal (Server shell)
│   │   └── LoginForm.jsx               # Interactive credential form ("use client")
│   └── register/
│       ├── page.js                     # Registration portal (Server shell)
│       └── RegisterForm.jsx            # Interactive registration leaf ("use client")
├── api/
│   ├── dishes/
│   │   ├── route.js                    # GET /api/dishes (Catalog + ?category= filter)
│   │   └── [id]/route.js               # GET /api/dishes/[id] (Individual dish + 404)
│   └── orders/
│       ├── route.js                    # GET (User scoped) & POST /api/orders (Zod validated)
│       └── [id]/route.js               # GET & PATCH /api/orders/[id] (Owner scoped)
├── cart/
│   ├── page.js                         # Cart page shell (Server component)
│   └── CartClient.jsx                  # Interactive cart table leaf ("use client")
├── checkout/
│   ├── page.js                         # Checkout shell (Server component passing dish catalog)
│   └── CheckoutForm.jsx                # Progressive enhancement form leaf ("use client")
├── kitchen/
│   ├── page.js                         # Staff Kitchen KDS display (Server component, Role: staff)
│   └── KitchenStatusControl.jsx        # Live order status patcher ("use client")
├── menu/
│   ├── [id]/
│   │   ├── opengraph-image.jsx         # Dynamic 1200x630 social card per dish
│   │   └── page.js                     # Individual dish detail (SSR / Dynamic)
│   ├── error.js                        # Client error boundary ("use client")
│   ├── layout.js                       # Persistent menu category sidebar layout (Server)
│   ├── loading.js                      # Instant streaming skeleton fallback (Server)
│   ├── opengraph-image.jsx             # Category OG image
│   ├── page.js                         # Banquet menu catalog (Server component)
│   └── SearchBox.jsx                   # Debounced client search filter ("use client")
├── offers/
│   └── page.js                         # Promotional banquets & coupon packages (Server)
├── orders/
│   ├── [id]/
│   │   ├── OrderStatus.jsx             # SWR 5-second live polling stepper ("use client")
│   │   └── page.js                     # Live order tracker shell (Server component)
│   ├── AttackTestBox.jsx               # Security lab test console leaf ("use client")
│   ├── CancelButton.jsx                # Optimistic order cancellation leaf ("use client")
│   └── page.js                         # Private order history (Server component, Scoped)
├── reservations/
│   ├── page.js                         # Table reservation shell (Server component)
│   └── ReservationForm.jsx             # Interactive booking leaf ("use client")
├── security-lab/
│   ├── page.js                         # Attack simulation console shell (Server)
│   └── SecurityLabClient.jsx           # Live interactive attack runner ("use client")
├── actions.js                          # "use server" Server Actions (placeOrder, cancelOrder, signIn, etc.)
├── favicon.ico
├── globals.css                         # Pure Vanilla CSS design system tokens
├── layout.js                           # Root document shell, next/font, metadataBase, Providers
├── not-found.js                        # Brand-aligned graceful 404 boundary
├── opengraph-image.jsx                 # Dynamic site-wide OpenGraph image (Edge ImageResponse)
├── page.js                             # Homepage cultural showcase (Server component)
├── page.module.css
├── robots.js                           # Dynamic crawler robots.txt generator
└── sitemap.js                          # Dynamic XML sitemap generator
```

---

## 2. Route Rendering Strategy Matrix

| Route | Build Marker | Rendering Strategy | Justification & Cache Configuration |
| :--- | :--- | :--- | :--- |
| `/` | `ƒ (Dynamic)` | **Dynamic SSR** | Renders live restaurant showcase; inherits dynamic session awareness from Root Layout to personalize the navigation bar. |
| `/menu` | `ƒ (Dynamic)` | **Dynamic SSR / Streaming** | Real-time dish availability, fast search integration, dynamic query parameter parsing (`?category=`), and live stock verification. |
| `/menu/[id]` | `ƒ (Dynamic)` | **Dynamic SSR** | Evaluates dynamic dish slug/ID at request time with instant streaming fallback via `loading.js`. |
| `/cart` | `ƒ (Dynamic)` | **Server Shell + Client Leaf** | Static presentation shell pre-rendered on the server; mounts `<CartClient />` which reads client `localStorage`. |
| `/checkout` | `ƒ (Dynamic)` | **Dynamic SSR** | Pre-fetches live inventory on server; processes form via Server Action (`placeOrder`) with progressive enhancement. |
| `/orders` | `ƒ (Dynamic)` | **Dynamic SSR (Private)** | Strictly private user data. Reads session cookie via `getSession()` and scopes database queries to `session.user.id`. |
| `/orders/[id]` | `ƒ (Dynamic)` | **Dynamic SSR + SWR** | Private live order status. Pre-rendered on server, then hydrated with SWR polling every 5 seconds for courier progress. |
| `/kitchen` | `ƒ (Dynamic)` | **Dynamic SSR (Protected)** | Protected staff-only route. Enforced by Edge Middleware and Layer 2 role check (`role === "staff"`). |
| `/offers` | `ƒ (Dynamic)` | **Dynamic SSR** | Promotional banquet coupons and feast discounts rendered with active session context. |
| `/reservations`| `ƒ (Dynamic)` | **Server Shell + Client Leaf** | Server layout passing serialized available timeslots down to `<ReservationForm />`. |
| `/login` | `ƒ (Dynamic)` | **Server Shell + Client Leaf** | Server authentication portal shell housing progressive enhancement `<LoginForm />`. |
| `/register` | `ƒ (Dynamic)` | **Server Shell + Client Leaf** | Member registration portal shell housing `<RegisterForm />`. |
| `/security-lab`| `ƒ (Dynamic)` | **Server Shell + Client Leaf** | Interactive defense verification laboratory for testing IDOR, CSRF, and injection attacks. |
| `/_not-found` | `ƒ (Dynamic)` | **Dynamic Error Boundary** | Brand-aligned 404 page triggered whenever `notFound()` is invoked. |
| `/robots.txt` | `○ (Static)` | **Static Generator** | Pre-rendered crawler directives via Next.js metadata route (`app/robots.js`). |
| `/sitemap.xml` | `○ (Static)` | **Static Generator** | Pre-rendered XML sitemap dynamically discovering all public routes (`app/sitemap.js`). |
| `/opengraph-image` | `○ (Static)` | **Static OpenGraph** | Pre-generated 1200x630 branded social media banner via Edge `ImageResponse`. |
| `/menu/opengraph-image`| `○ (Static)`| **Static OpenGraph** | Pre-generated 1200x630 category preview social card. |

---

## 3. Production Build Output Verification

Compiled with Next.js production build (`npm run build`):

```text
Route (app)
┌ ƒ /
├ ƒ /_not-found
├ ƒ /api/dishes
├ ƒ /api/dishes/[id]
├ ƒ /api/orders
├ ƒ /api/orders/[id]
├ ƒ /cart
├ ƒ /checkout
├ ƒ /kitchen
├ ƒ /login
├ ƒ /menu
├ ƒ /menu/[id]
├ ƒ /menu/[id]/opengraph-image
├ ○ /menu/opengraph-image
├ ƒ /offers
├ ○ /opengraph-image
├ ƒ /orders
├ ƒ /orders/[id]
├ ƒ /register
├ ƒ /reservations
├ ○ /robots.txt
├ ƒ /security-lab
└ ○ /sitemap.xml

ƒ Proxy (Middleware)
○ (Static)   prerendered as static content
ƒ (Dynamic)  server-rendered on demand
```

### Build Disagreement Resolution

1. **Why do public pages mark as `ƒ (Dynamic)` rather than `○ (Static)`?**
   - **Root Cause**: In `app/layout.js`, line 65 executes `const session = await getSession();` to provide authenticated user identity and role directly to `<Navbar />`.
   - **Next.js Rule**: In Next.js App Router, invoking `cookies()` or `headers()` inside the Root Layout opts all downstream child routes into request-time dynamic server rendering.
   - **Resolution & Tradeoff**: This was an intentional architectural choice for Addis Eats Day 45: by resolving authentication in the root server layout, the entire navigation bar seamlessly reflects sign-in state (showing user avatar, loyalty points, or login link) without triggering a client-side layout shift or unauthenticated flash. Static assets, fonts, and crawler files (`robots.txt`, `sitemap.xml`) remain fully static.
