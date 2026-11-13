# Addis Eats · Next.js Advanced Project (Day 45 / Day 20)

> **CodeOps · Full Stack Software Development · IBT College Canada**  
> **Module 3 · Day 45 (Week 9 Advanced Project Deliverable · Day 20)**  
> **Designed by Mehran Dasgar**

---

## 1. The Brief & Deliverables

Four days of week 9 become one unified application today: signed in with the checks in the right places, live where it needs to be, measurably faster than it was on Monday, and findable.

### Primary Documentation Deliverables (Slide 14 & 28)

| Deliverable | Purpose | Slide Reference |
| :--- | :--- | :--- |
| **[`AUTH.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/AUTH.md)** | **Decision One: Who may see what**, 4-column matrix, 3 layers of defense and what each proves, cookie flags, and live results for the 3 security attacks with stopping lines. | Slide 11, 14, 17 |
| **[`DATA.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/DATA.md)** | **Decision Two: Where data is fetched**, query inventory with refresh rules, 5s live polled status seeded with server data (0ms spinner), and 300ms debounced search. | Slide 12, 14, 18 |
| **[`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/PERF.md)** | **Decision Three: The performance budget**, with both columns filled (Baseline Before vs. Optimized After), attribution causes, and Core Web Vitals audit. | Slide 13, 14 |
| **[`report.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/report.md)** | **Oral Examination Defense Guide**: 100 question-and-answer breakdown covering every line of code, architectural decision, and grading rubric requirement. | Slide 26, 27 |
| **[`STRATEGY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/STRATEGY.md)** | **Rendering Strategy Guide**: Server vs. Client rendering decisions, ISR revalidation configuration, and SSR streaming boundaries. | Slide 22 |
| **[`BOUNDARY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/BOUNDARY.md)** | **Component Boundary Blueprint**: Complete component tree audit documenting leaf-pushed `"use client"` directives. | Slide 22 |

---

## 2. Project File Map: Where Files Are Placed & What They Do

Every file in this project is purposefully placed to fulfill the 6 assessment areas of Day 45:

```
module03/day20/
├── 📄 AUTH.md                      # Decision 1 table, 3 security layers, 3 attack proofs
├── 📄 DATA.md                      # Decision 2 table, query inventory, SWR & debouncing rules
├── 📄 PERF.md                      # Decision 3 budget, before/after Web Vitals, Lighthouse proof
├── 📄 report.md                    # 100 oral examination questions & exact code answers
├── 📄 README.md                    # Project blueprint, file index, test credentials, verification
├── 📄 STRATEGY.md                  # Rendering strategy & data-flow architecture
├── 📄 BOUNDARY.md                  # Server-Client component boundaries audit
├── 📄 middleware.js                # Layer 1: Edge route interception & Web Crypto cookie verification
│
├── 📁 app/
│   ├── 📄 layout.js                # Root layout: metadataBase, font optimization, schema injection
│   ├── 📄 page.js                  # Home route: zero-JS SSR, hero platter, Schema.org JSON-LD
│   ├── 📄 actions.js               # "use server" actions: signIn, signOut, placeOrder, cancelOrder
│   ├── 📄 opengraph-image.jsx      # Dynamic 1200x630 social preview card via @vercel/og ImageResponse
│   ├── 📄 sitemap.js               # Dynamic XML sitemap generation (/sitemap.xml) for dishes
│   ├── 📄 robots.js                # Robots.txt generator disallowing crawlers on private routes
│   │
│   ├── 📁 menu/
│   │   ├── 📄 page.js              # Menu catalog: ISR cached (3600s), Server Component
│   │   └── 📁 [id]/
│   │       └── 📄 page.js          # Dynamic dish detail page with dynamic OpenGraph metadata
│   │
│   ├── 📁 orders/
│   │   ├── 📄 page.js              # Layer 2 & 3: SSR session check + scoped query getOrdersByUser()
│   │   └── 📁 [id]/
│   │       ├── 📄 page.js          # Server Component: seeds order details for 0ms loading spinner
│   │       └── 📄 OrderStatus.jsx  # Client Component: polls /api/orders/[id] every 5s with SWR
│   │
│   ├── 📁 kitchen/
│   │   └── 📄 page.js              # Staff route: role-gated (user.role === "staff"), stage updates
│   ├── 📁 checkout/
│   │   └── 📄 page.js              # Checkout form: server session check, submits to placeOrder action
│   ├── 📁 cart/
│   │   └── 📄 page.js              # Shopping cart: reads client state from localStorage Context
│   ├── 📁 login/
│   │   └── 📄 page.js              # Authentication form: invokes signIn action with redirect handling
│   ├── 📁 security-lab/
│   │   └── 📄 page.js              # Interactive test harness: live verification of Attacks 1, 2, & 3
│   │
│   └── 📁 api/
│       ├── 📁 dishes/
│       │   └── 📄 route.js          # Public search API: accepts ?q= query string
│       └── 📁 orders/[id]/
│           └── 📄 route.js          # Polling endpoint: scoped ownership check on order status
│
├── 📁 components/
│   ├── 📄 SearchBox.jsx            # Live search input: 300ms debouncing hook, SWR fetcher
│   ├── 📄 Navbar.jsx               # Navigation bar: active session detection, role-aware links
│   └── 📄 Providers.jsx            # Client context boundary wrapper (CartContext)
│
└── 📁 lib/
    ├── 📄 session.js               # Web Crypto HMAC-SHA256 signing, verify, cookie flags, URL sanitizer
    ├── 📄 data.js                  # In-memory database, seed records, scoped query helpers
    ├── 📄 schema.js                # Zod schemas for order validation
    ├── 📄 hooks.js                 # Custom React hooks (useDebounce)
    └── 📄 fetcher.js               # SWR HTTP fetcher throwing on non-200 responses
```

---

## 3. Six Areas of Requirement & Where They Live (Slide 7)

| Requirement Area | File Location | Exact Responsibility |
| :--- | :--- | :--- |
| **1. Accounts & Sessions** | [`lib/session.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js)<br>[`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js) | HMAC-SHA256 cookie signing (`mesob_session`), 24-hr expiry, `httpOnly`, `secure`, `sameSite: lax`. `signIn` & `signOut` server actions. |
| **2. Multi-Layer Protection** | [`middleware.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/middleware.js)<br>[`app/orders/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/page.js)<br>[`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js) | **3-Tier Defense**: Edge Middleware perimeter check, SSR Server Component session gate, and Server Action ownership check. |
| **3. Data Ownership** | [`app/orders/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/page.js#L37)<br>[`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L117) | Scoped queries: `getOrdersByUser(session.user.id)`. Form submits never trust user-supplied IDs; IDOR is structurally impossible. |
| **4. Live Data & Seeding** | [`components/SearchBox.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/components/SearchBox.jsx)<br>[`app/orders/[id]/OrderStatus.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/[id]/OrderStatus.jsx) | **Debounced Search**: 300ms pause before firing requests.<br>**Polled Status**: SWR polling every 5s, pre-seeded with server `fallbackData` (0ms spinner). |
| **5. Measured Performance** | [`app/layout.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/layout.js)<br>[`app/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/page.js)<br>[`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/PERF.md) | Throttled LCP dropped from 4.68s to 1.22s. CLS reduced from 0.248 to 0.000. Hero image preloaded with `priority={true}` and Next.js font self-hosting. |
| **6. Discovery & SEO** | [`app/layout.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/layout.js)<br>[`app/opengraph-image.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/opengraph-image.jsx)<br>[`app/sitemap.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/sitemap.js) | Absolute Open Graph previews (1200x630), `metadataBase`, Schema.org `Restaurant` JSON-LD, dynamic `/sitemap.xml`, and `/robots.txt`. |

---

## 4. Decision Summary: The Three Tables

### Decision One: Who May See What (Slide 11 & [`AUTH.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/AUTH.md))
| ROUTE | WHO | PROTECTED BY | WHAT THAT PROVES |
| :--- | :--- | :--- | :--- |
| `/menu` | Everyone | Nothing | It is public, and should stay indexable |
| `/orders` | The owner | Middleware + page + scoped query | Signed in, and only their own records |
| `/checkout` | Any signed-in | Middleware + page | Signed in — the write checks the rest |
| `/kitchen` | Staff only | Page + role check in every action | Signed in, and permitted |

### Decision Two: Where Data is Fetched (Slide 12 & [`DATA.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/DATA.md))
| DATA | WHERE, AND WHY |
| :--- | :--- |
| Menu and dishes | **Server** — public, indexable, cacheable |
| Order history | **Server** — private, scoped to the session |
| Order status | **Server first, then polled on the client** |
| Menu search | **Client** — triggered by typing, debounced |
| Cart | **Client store** — it never leaves the browser |

### Decision Three: The Performance Budget (Slide 13 & [`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/PERF.md))
| MEASURE | TARGET | YOURS (BEFORE → AFTER) | BUDGET MET? |
| :--- | :---: | :---: | :---: |
| LCP, throttled | Under 2.5s | 4.68s → 1.22s | **✓ PASS** (-73.9%) |
| CLS | Under 0.1 | 0.248 → 0.000 | **✓ PASS** (100% stable) |
| First Load JS, `/menu` | Under 120 kB | 168 kB → 94 kB | **✓ PASS** (-44.0%) |
| Largest image | Under 150 kB | 461 kB → 28.2 kB | **✓ PASS** (-93.9%) |
| Lighthouse performance | 90 or better | 58 → 98 | **✓ PASS** (+40 points) |

---

## 5. Security Defense: The Three Attacks (Slide 17)

All three required attacks are stopped with exact line numbers in code:

| Attack | Scenario | Code Trigger | Exact Defense Line | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Attack 1** | Signed-out cancel attempt | `await cancelOrder("ord_001")` | [`app/actions.js:144`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L144) | Refused cleanly: `Unauthorized: Authentication required.` |
| **Attack 2** | Ownership mismatch (IDOR) | Abebe cancels Chala's order `ord_003` | [`app/actions.js:155`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L155) | Refused on ownership: `Forbidden: Ownership mismatch.` |
| **Attack 3** | Open Redirect injection | `/login?next=https://example.com` | [`lib/session.js:185`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js#L185) | Sanitized: lands on `/orders` fallback, never `example.com`. |

---

## 6. Demo Accounts & Testing Credentials

| Role | Email | Password | Allowed Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer 1** | `abebe@addiseats.et` | `password123` | Places orders, views only their own order history (`ord_001`, `ord_002`). |
| **Customer 2** | `chala@addiseats.et` | `password123` | Places orders, views only their own order history (`ord_003`). |
| **Kitchen Staff** | `staff@addiseats.et` | `kitchenpass` | Accesses `/kitchen`, advances order tickets (`preparing`, `ready`, `delivered`). |

---

## 7. Running & Verifying the Application

```bash
# 1. Start the development server
npm run dev

# 2. Build and run production bundle
npm run build
npm run start

# 3. Interactive Security Testing Lab
# Open http://localhost:3000/security-lab to execute the 3 attacks live in the UI!
```
