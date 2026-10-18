# Addis Eats (Mesob House) — Teacher Presentation & Defense Guide
**IBT College Canada · CodeOps Full Stack Software Development**  
**Module 3 · Frontend: React & Next.js · Day 40 Capstone Walkthrough**

---

## ⏱️ 8-Minute Presentation Timeline

| Time | Section | What to Say / Demonstrate | Key Files to Reference |
| :--- | :--- | :--- | :--- |
| **0:00 – 1:00** | **Project Overview & Routes** | Introduce Addis Eats (Mesob House). Explain that we migrated from a client-rendered Vite app into a full-stack Next.js App Router architecture with server components, server actions, route handlers, and shared Zod validation. | [`README.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/README.md) |
| **1:00 – 3:00** | **Live Production Build** | Run `npm run build` in front of the teacher. Show that every route indicator (`○`, `●`, `ƒ`) strictly matches our intended design. Run `npm run start` and click through the live app. | Production terminal output |
| **3:00 – 5:00** | **Rendering Strategy Defense** | Walk through the `STRATEGY.md` table. Explain why each route was assigned its strategy. Highlight the route you carefully solved: `/menu` remaining ISR (3600s) without bailing out to dynamic. | [`STRATEGY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/STRATEGY.md) |
| **5:00 – 7:00** | **Server-Client Boundary Map** | Explain `BOUNDARY.md`. Show how data stays on the server and client components are restricted to interactive leaves. Demonstrate the `children` pattern in `CategoryBar` and `Providers`. | [`BOUNDARY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/BOUNDARY.md) |
| **7:00 – 8:00** | **API, Security & Questions** | Run the 3 `curl` verification commands live. Prove the 404, 422, and 201 status codes. Answer instructor follow-up questions. | [`lib/schema.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/lib/schema.js), [`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/actions.js) |

---

## 🎯 Part 1 · How to Explain Each Criterion (One by One)

### Criterion 1 (35%): Routes, Layouts & Features Working

#### What to tell the teacher:
> *"In Day 35, Addis Eats was built as a traditional Single Page Application. In this migration, we rebuilt the application around Next.js file-based routing with nested layouts, special routing states, and progressive enhancement."*

#### Key Points to Explain:
1. **File-Based Route Structure**:
   * Root layout [`app/layout.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/layout.js) wraps the app shell, sticky glassmorphism navbar, and communal Habesha footer without forcing any children into the client bundle.
   * Nested layout [`app/menu/layout.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/menu/layout.js) wraps both `/menu` and `/menu/[id]`, providing shared sub-navigation that persists during navigation.
2. **Special Next.js Route Files**:
   * **`loading.js`** ([`app/menu/loading.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/menu/loading.js)): Automatic streaming skeleton with pulsing cards that displays immediately on slow 3G connections.
   * **`error.js`** ([`app/menu/error.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/menu/error.js)): Client error boundary catching segment crashes while keeping root navigation and cart functional. Provides an interactive `reset()` retry button.
   * **`not-found.js`** ([`app/not-found.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/not-found.js)): Triggers clean 404 pages whenever `notFound()` is invoked.
3. **Progressive Enhancement**:
   * The checkout form ([`app/checkout/CheckoutForm.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/checkout/CheckoutForm.jsx)) uses `<form action={formAction}>` via React 19's `useActionState(placeOrder)`. Even if the client disables JavaScript in their browser, the native HTML form POSTs directly to the server action and completes the order.

---

### Criterion 2 (20%): Rendering Strategy, Chosen and Justified

#### What to tell the teacher:
> *"Every route's rendering strategy was determined deliberately using the Day 40 five-question framework. We never guessed or left everything as dynamic."*

#### The Strategy Table ([`STRATEGY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/STRATEGY.md)):

| Route | Strategy & Marker | Teacher Explanation & Justification |
| :--- | :--- | :--- |
| **`/`** | **Static (`○`)** | *Who is asking?* Nobody in particular. The homepage has marketing copy, culinary pillars, and daily specials that are identical for every user. It is pre-rendered once at build time and cached on CDN edges. |
| **`/menu`** | **ISR 3600 (`○ 1h`)** | *How stale may it be?* Up to an hour. Menu items, prices, and availability change occasionally throughout the day. Setting `revalidate = 3600` ensures lightning-fast static delivery without requiring full site rebuilds. |
| **`/menu/[id]`** | **Static via Params (`●`)** | *Do I know the IDs?* Yes. All dish IDs (`dish_001` through `dish_006`) are known at build time. We use `generateStaticParams()` to pre-render every dish page as static HTML. Non-existent IDs trigger `notFound()`. |
| **`/offers`** | **Static (`○`)** | Curated seasonal banquet discounts and promo codes. Pre-rendered once as static HTML. |
| **`/reservations`** | **Static Shell + Client Leaf (`○`)** | Static informational page shell hosting an interactive client form leaf for selecting seating styles and dates. |
| **`/cart`** | **Client (`○`)** | *Is it private to one tab?* Yes. Cart items and running ETB totals live exclusively in the browser's `localStorage` and React state. The server has no knowledge of unsubmitted cart contents. |
| **`/checkout`** | **Dynamic (`ƒ`)** | Submits a mutation via Server Action. Reads dynamic dish options and processes authenticated requests per visitor. |
| **`/orders`** | **Dynamic (`ƒ`)** | *Does it read a cookie or session?* Yes. User order history is strictly private. It reads the session cookie server-side via `getSession()` and fetches only that user's records. |

#### 💡 The Decision Story (Route you changed your mind about):
> *"Initially, one might be tempted to read `searchParams` on the server in `/menu` to filter by category. However, Next.js marks any server component that reads `searchParams` as dynamic (`ƒ`), losing the benefits of static edge caching. Instead, we kept `/menu` as pure ISR (`○ 1h`) by having the server pre-render all dishes, passing them as `children` to a client `CategoryBar` component that toggles visibility via data attributes. This preserved both the 1-hour ISR window and instant client-side filtering."*

---

### Criterion 3 (20%): Server and Client Boundary Placement

#### What to tell the teacher:
> *"We adhered strictly to the Server-First principle. Components run on the server by default, and `'use client'` is pushed down exclusively to interactive leaf nodes."*

#### Boundary Map Breakdown ([`BOUNDARY.md`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/BOUNDARY.md)):

```
Server Side (RSC)                      Client Side (Leaves Only)
─────────────────                      ─────────────────────────
app/layout.js                          components/Navbar.jsx (cart count badge & active route)
app/page.js                            components/CategoryBar.jsx (interactive category tabs)
app/menu/page.js                       components/AddToCartButton.jsx (onClick store mutation)
app/menu/[id]/page.js                  components/Providers.jsx (React Context wrapper)
app/checkout/page.js                   app/checkout/CheckoutForm.jsx (useActionState)
app/orders/page.js                     app/orders/CancelButton.jsx (useTransition)
                                       app/reservations/ReservationForm.jsx (form state)
                                       app/login/LoginForm.jsx & RegisterForm.jsx
```

#### Why Server-Rendered Content is Passed as `children`:
> *"If a client component imports a server component directly, Next.js pulls that server component into the client bundle. To prevent this, our client wrappers (such as `CategoryBar` and `Providers`) accept `children`. This means the server renders the children into pure HTML/RSC payload, and the client bundle only downloads the minimal JavaScript needed for interactivity."*

---

### Criterion 4 (15%): Endpoint Design, Validation and Security

#### What to tell the teacher:
> *"Endpoints only exist if external clients or polling mechanisms require them. Server components query data directly without internal fetch calls. All mutations and endpoints share one single source of truth for validation."*

#### Key Security Implementations:
1. **Shared Zod Validation Schema** ([`lib/schema.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/lib/schema.js)):
   * Enforced on both `POST /api/orders` and the `placeOrder` server action.
   * Strict Ethiopian phone regex: `/^(09|\+2519)\d{8}$/`.
   * Standard error response shape:
     ```json
     { "error": "Validation failed", "fieldErrors": { "phone": ["Use 09... or +2519..."] } }
     ```
2. **Server Action Ownership Guard** ([`app/actions.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/app/actions.js)):
   * In `cancelOrder(orderId)`, we verify:
     1. The user has an authenticated session (`await getSession()`).
     2. `order.userId === session.id`.
   * Even if an attacker calls `cancelOrder` from the browser console with an arbitrary order ID, the server rejects the mutation with an authorization error.
3. **Environment Security**:
   * Inspect [`.env.local`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day15/.env.local):
     * Server secrets: `DATABASE_URL`, `TELEBIRR_SECRET`, `SESSION_SECRET` have **no** `NEXT_PUBLIC_` prefix.
     * Only intentional public variables (`NEXT_PUBLIC_MAP_KEY`, `NEXT_PUBLIC_APP_NAME`) carry the prefix.

---

### Criterion 5 (10%): Documentation and Walkthrough

#### What to tell the teacher:
> *"The repository includes exhaustive documentation. `STRATEGY.md` justifies every route rendering decision, `BOUNDARY.md` defends every server-client boundary line by line, and `README.md` provides curl verification commands, error shapes, and architecture notes."*

---

## 💻 Live Terminal Commands to Run in Front of the Teacher

Keep these 4 commands ready in your terminal:

### 1. Show the Production Build
```bash
npm run build
```
*Point to the screen:* Show that `/` is `○`, `/menu` is `○ 1h`, `/menu/[id]` is `●`, and `/checkout` is `ƒ`.

### 2. Verify 404 Error Contract (Unknown Dish)
```bash
curl -i http://localhost:3000/api/dishes/not-a-dish
```
*Expected Output:*
```http
HTTP/1.1 404 Not Found
Content-Type: application/json

{"error":"Not found","detail":"No dish with id \"not-a-dish\""}
```

### 3. Verify 422 Schema Validation (Invalid Phone)
```bash
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Almaz\",\"phone\":\"0912\",\"dishId\":\"dish_001\",\"quantity\":1,\"area\":\"Bole\"}"
```
*Expected Output:*
```http
HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{"error":"Validation failed","fieldErrors":{"phone":["Use 09... or +2519..."]}}
```

### 4. Verify 201 Successful Order Creation
```bash
curl -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Almaz\",\"phone\":\"0912345678\",\"dishId\":\"dish_001\",\"quantity\":2,\"area\":\"Bole\"}"
```
*Expected Output:*
```http
HTTP/1.1 201 Created
Content-Type: application/json

{"id":"ord_001","total":360,"status":"pending",...}
```

---

## ❓ Tough Questions Teachers Ask & How to Answer

### Q1: "Why didn't you just make everything a Client Component with `'use client'` at the top of `layout.js`?"
> **Answer:** *"Placing `'use client'` at the top of a layout forces all descendant components into the client JavaScript bundle. That sacrifices search engine optimization, destroys static CDN caching, leaks business logic and database queries to the client browser, and causes significant hydration delays. Keeping layouts and pages on the server ensures zero client JS overhead for static markup."*

### Q2: "Why does `/api/dishes` exist if your Server Component doesn't call it?"
> **Answer:** *"That was an explicit lesson from Day 39. Server components should never make internal HTTP requests to their own route handlers; they query the data layer directly (`getDishes()`). The `/api/dishes` route handler exists exclusively for external integrations, mobile apps, or third-party polling clients."*

### Q3: "What prevents a user from tampering with order prices in the browser?"
> **Answer:** *"The client form only submits the `dishId` and `quantity`. The price calculation happens strictly on the server in `createOrder()` inside `lib/data.js` and `app/actions.js`: `total = dish.price * data.quantity`. The client never has the authority to submit a total price."*

### Q4: "How does `cancelOrder` ensure that user A cannot cancel user B's order?"
> **Answer:** *"The security check runs entirely on the server inside `cancelOrder` in `app/actions.js`. We read the signed session cookie server-side using `getSession()`, look up the order, and verify `if (order.userId !== session.id) throw new Error('Unauthorised')`. The client-side `CancelButton` is only a user experience courtesy; real security is enforced on the server."*

### Q5: "How does progressive enhancement work on your checkout form?"
> **Answer:** *"React 19's `useActionState` ties into the native HTML `<form action={formAction}>`. When JavaScript is enabled, React intercepts the submit event, handles the pending state with a spinner, and updates the UI without a full reload. If JavaScript is disabled or fails to load, the browser executes a standard HTTP POST request to the server action, which processes the order and redirects to `/orders`."*
