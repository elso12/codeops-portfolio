# Addis Eats · Next.js Advanced Project (Day 45)

> **CodeOps · Full Stack Software Development · IBT College Canada**  
> **Module 3 · Day 45 (Week 9 Advanced Project Deliverable · Day 20)**  
> **Designed by Mehran Dasgar**

---

## The Brief & Deliverables

Four days of week 9 become one application today: signed in with the checks in the right places, live where it needs to be, measurably faster than it was on Monday, and findable.

### Primary Documentation Deliverables

| Deliverable | Purpose | Slide Reference |
| :--- | :--- | :--- |
| **[`AUTH.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/AUTH.md)** | **Decision One: Who may see what**, 4-column matrix, 3 layers of defense and what each proves, cookie flags, and live results for the 3 security attacks with stopping lines. | Slide 11, 14, 17 |
| **[`DATA.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/DATA.md)** | **Decision Two: Where data is fetched**, query inventory with refresh rules, 5s live polled status seeded with server data (0ms spinner), and 300ms debounced search. | Slide 12, 14, 18 |
| **[`PERF.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/PERF.md)** | **Decision Three: The performance budget**, with both columns filled (Baseline Before vs. Optimized After), attribution causes, and Core Web Vitals audit. | Slide 13, 14 |

---

## 1. Six Areas of Requirement (Slide 7)

- [x] **Accounts:** Cryptographically signed session in flagged cookie (`mesob_session`, `HttpOnly`, `Secure`, `SameSite=Lax`). Sign in and sign out working end to end.
- [x] **Protection:** Middleware at the edge, page check in Server Components, and ownership check in every Server Action.
- [x] **Ownership:** Every query scoped strictly to the verified session (`getOrdersByUser(session.user.id)`), never to a client-sent ID or URL parameter.
- [x] **Live Data:** One polled query (`/api/orders/${id}` every 5s) and one debounced search (`useDebounce(term, 300)`). Both seeded with server data.
- [x] **Performance:** Measured before-and-after improvement documented in `PERF.md`. LCP dropped from 4.68s to 1.22s, CLS down to 0.000, Lighthouse score up to 98.
- [x] **Discovery:** Full metadata, `metadataBase`, dynamic `ImageResponse` social previews at 1200x630, `sitemap.xml`, and crawler `robots.txt`.

---

## 2. Decision Summary: The Three Tables

### Decision One: Who May See What (Slide 11)
| ROUTE | WHO | PROTECTED BY | WHAT THAT PROVES |
| :--- | :--- | :--- | :--- |
| `/menu` | Everyone | Nothing | It is public, and should stay indexable |
| `/orders` | The owner | Middleware + page + scoped query | Signed in, and only their own records |
| `/checkout` | Any signed-in | Middleware + page | Signed in — the write checks the rest |
| `/kitchen` | Staff only | Page + role check in every action | Signed in, and permitted |

### Decision Two: Where Data is Fetched (Slide 12)
| DATA | WHERE, AND WHY |
| :--- | :--- |
| Menu and dishes | **Server** — public, indexable, cacheable |
| Order history | **Server** — private, scoped to the session |
| Order status | **Server first, then polled on the client** |
| Menu search | **Client** — triggered by typing, debounced |
| Cart | **Client store** — it never leaves the browser |

### Decision Three: The Performance Budget (Slide 13)
| MEASURE | TARGET | YOURS (BEFORE → AFTER) | BUDGET MET? |
| :--- | :---: | :---: | :---: |
| LCP, throttled | Under 2.5s | 4.68s → 1.22s | **✓ PASS** (-73.9%) |
| CLS | Under 0.1 | 0.248 → 0.000 | **✓ PASS** (100% stable) |
| First Load JS, `/menu` | Under 120 kB | 168 kB → 94 kB | **✓ PASS** (-44.0%) |
| Largest image | Under 150 kB | 461 kB → 28.2 kB | **✓ PASS** (-93.9%) |
| Lighthouse performance | 90 or better | 58 → 98 | **✓ PASS** (+40 points) |

---

## 3. Verifying the Rest: Evidence, Not Assertion (Slide 18)

| Area | How to Check | What You Want to See | Result Verified |
| :--- | :--- | :--- | :--- |
| **Live data** | Network tab while typing | One request per pause, not per keystroke | **VERIFIED:** Typing "tibs!" triggers exactly 1 request to `/api/dishes?q=tibs` after 300ms pause. |
| **Seeding** | Load `/orders/[id]` | Data on arrival, no spinner at all | **VERIFIED:** Server Component pre-populates `initial` data. 0ms spinner duration. |
| **Performance**| Lighthouse on production build | Both numbers recorded, LCP down | **VERIFIED:** 58 → 98 (+40 points), LCP down from 4.68s to 1.22s on throttled mobile. |
| **Metadata** | View source on deployed page | Absolute `og:image` URLs, distinct descriptions | **VERIFIED:** Resolved from `metadataBase: https://addiseats.et`, distinct descriptions per route. |
| **Discovery** | Open `/sitemap.xml` and `/robots.txt` | Real dishes listed, private routes absent | **VERIFIED:** Dynamic dish routes listed in sitemap; `/orders`, `/checkout`, `/kitchen` disallowed in robots. |

---

## 4. Review Questions Answered (Slide 27)

### 1. For one private route in your build, what does each of the three layers actually prove?
For `/orders`:
* **Layer 1 (Middleware):** Proves an HMAC cryptographic cookie token exists and is syntactically valid before the request reaches the server renderer.
* **Layer 2 (Server Component Page):** Proves the session is verified and not expired at SSR runtime via `getSession()`. If missing, it halts execution and issues an immediate redirect to `/login?next=/orders`.
* **Layer 3 (Scoped Query):** Proves records fetched belong **only** to the caller: `getOrdersByUser(session.user.id)`. Any malicious URL parameter like `?userId=...` is ignored.

### 2. Which query in your application runs on the client, and why can it not run on the server?
* **Menu search-as-you-type (`SearchBox.jsx`):** It runs on the client because it is triggered by user keystrokes in real time. The server cannot know what the user is typing until the user interacts with the input.
* **Live order status polling (`OrderStatus.jsx`):** The initial render runs on the server, but subsequent checks run on the client via SWR (`refreshInterval: 5000`) because the kitchen ticket status advances unpredictably during meal preparation.

### 3. What were your LCP numbers before and after, and which change did most of it?
* **Before:** `4.68 s` (Rated POOR).
* **After:** `1.22 s` (Rated GOOD).
* **Change that did most of it:** Adding `priority={true}` to the Great Mesob Feast hero centerpiece platter combined with automated AVIF image compression (dropping image payload from 461 KB down to 28.2 KB).

### 4. Show the line that refuses an action called with another account’s id.
* **In Server Action:** **[`app/actions.js:155-159`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L155-L159)**:
  ```javascript
  if (order.userId !== user.id && user.role !== "staff") {
    throw new Error(`Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`);
  }
  ```
* **In Route Handler:** **[`app/api/orders/[id]/route.js:26-28`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/api/orders/%5Bid%5D/route.js#L26-L28)**:
  ```javascript
  if (order.userId !== user.id && user.role !== "staff") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  ```

### 5. Why must the performance baseline be taken after the features are finished?
* If you take the baseline before features (such as authentication, live data hooks, and route structures) are in place, you are measuring a different application. Any subsequent restructuring or security layers added later will invalidate the earlier measurements.

### 6. What is still missing from your capstone, and when will it be done?
* The capstone has brought all six core rows level tonight (routes, layout/rendering, boundaries, authentication, optimization pass, metadata). Week 10 will add final data representation (charts, tables, pagination), maps/currency formatting, and live production deployment on Vercel.

---

## 5. Running the Production Build

```bash
# 1. Install / link dependencies
npm run build

# 2. Start production server
npm run start

# 3. Test the Three Security Attacks
# Navigate to http://localhost:3000/security-lab or run commands in DevTools console
```
