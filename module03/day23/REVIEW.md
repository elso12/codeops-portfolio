# Peer Code Review (REVIEW.md)

> **Document Type:** Graded Professional Peer Review Deliverable  
> **Course:** IBT College Canada CodeOps · Full Stack Software Development  
> **Module:** Module 3 · Frontend: React & Next.js · Day 50 (Week 10)  
> **Reviewed Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Methodology:** Standard 6-Step Evaluative Framework  

---

## 1. Review Execution Protocol (In Mandatory Order)

### Step 1: Read the README, Then Open the Live URL
- **Assessment of README:** The `README.md` provides clear setup instructions, test account credentials (`abebe@mesobhouse.et`, `almaz@mesobhouse.et`, `kitchen@mesobhouse.et`), architecture diagrams, and links to supporting documentation (`AUTH.md`, `DATA.md`, `PERF.md`, `BOUNDARY.md`, `STRATEGY.md`).
- **Live Deployment Verification:** The site opens immediately without runtime error boundaries or broken asset links. All favicon, OG previews, and web fonts load cleanly.

### Step 2: Use the Application Before Reading Any Code
- **User Flow Experience:** 
  1. Navigated to `/menu`, browsed authentic Ethiopian dishes, filtered by category ("Specialties", "Vegetarian / Fasting", "Classics").
  2. Selected "Doro Wat", viewed dynamic detail page `/menu/doro-wat` with responsive images and nutritional specs.
  3. Added item to cart, navigated to `/cart`, proceeded to `/checkout`.
  4. Redirected smoothly to `/login` when attempting unauthenticated checkout, with return destination preserved.
  5. Authenticated as Abebe, completed order, and redirected to `/orders/ORD-101` with live 5-second tracking and order status timeline.
- **Verdict from User Perspective:** Flow is intuitive, fast, and lacks jarring layout shifts.

### Step 3: Inspect Route Structure and Root Layouts
- **File System Inspection:**
  - `app/layout.js`: Clean root layout initializing fonts, global CSS, semantic navbar, and `Providers.jsx`.
  - Directory hierarchy reflects URL routing: `/menu`, `/menu/[id]`, `/orders`, `/orders/[id]`, `/kitchen`, `/login`, `/dashboard`.
  - Nested layouts are used where appropriate; shared navigation is persistent.

### Step 4: Follow One Feature from URL to Data and Back
- **Selected Feature:** Order Cancellation Flow (`/orders/[id] -> actions.js -> cancelOrderById -> UI update`)
- **Tracing the Flow:**
  1. **URL:** User visits `/orders/ORD-101`.
  2. **Page Component (`app/orders/[id]/page.js`):** Server Component reads session from cookie, fetches order via `getOrderById(params.id)`. Enforces that `order.userId === session.user.id`.
  3. **Interaction (`CancelOrderButton.jsx`):** Client leaf component calls Server Action `cancelOrder("ORD-101")`.
  4. **Server Action (`app/actions.js`):**
     - Step 1: `const user = await getSession()` (verifies caller is signed in).
     - Step 2: `if (order.userId !== user.id)` (verifies caller owns the record).
     - Step 3: Calls data mutation `cancelOrderById(orderId)`.
     - Step 4: Triggers `revalidatePath("/orders")` and `revalidatePath("/kitchen")`.
  5. **Back to UI:** React updates the DOM with cancelled status tag; kitchen board reflects cancellation.

### Step 5: Check One Protected Action for Both Checks
- **Action Checked:** `cancelOrder(orderId)` in `app/actions.js`:
  ```javascript
  // Check 1: Authentication Check (Is caller signed in?)
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized: Authentication required.");
  }

  // Check 2: Authorisation Check (Does order belong to user?)
  const order = getOrderById(orderId);
  if (!order || order.userId !== user.id) {
    throw new Error("Forbidden: Ownership mismatch.");
  }
  ```
- **Finding:** Both checks are strictly contained inside the server action itself. Middleware is not relied upon as the sole write boundary.

---

## 2. Deep Dive Across the Six Rubric Areas

| Area | Review Question | Code Evaluation & Findings |
| :--- | :--- | :--- |
| **Boundary** | *Why is this a client component?* | Client components are strictly restricted to the leaves (`AddToCartButton`, `SearchBox`, `OrderStatusBadge`, `LoginForm`). Data tables, menu grids, and page containers remain pure React Server Components. |
| **Security** | *What stops me calling this action?* | Two-tier verification inside `app/actions.js`. Direct POST attacks with spoofed payloads return HTTP 401/403 errors with descriptive rejection logs. |
| **Queries** | *Where does this ID come from?* | In `app/orders/page.js`, orders are retrieved using `getOrdersByUser(user.id)` using the verified session token, never from `request.url` or client body parameters. |
| **States** | *What does a new account see?* | When an account has zero orders, a polished `<EmptyState />` component displays an icon, reassuring message, and a call-to-action button directing to `/menu`. |
| **Markup** | *Is this a button or a div?* | Buttons are native `<button type="button">` or `<button type="submit">`, anchors are Next.js `<Link>`, and headers follow strict `h1 -> h2 -> h3` hierarchy. No `<div onClick>` violations. |
| **Naming** | *Could I find this file blind?* | Highly semantic file and variable names (`DishCard.jsx`, `OrderStatus.jsx`, `authenticateUser()`, `createSessionToken()`). Clear separation between presentation components and library utilities. |

---

## 3. Constructive Feedback: Three Strengths & Three Questions

### Three Distinct Strengths
1. **Flawless Layered Defense Architecture:**
   The codebase strictly enforces the rule that *middleware is a routing gate, not a database security boundary*. Both authentication and record ownership are verified inside the database write functions.
2. **Zero-Layout-Shift Performance:**
   Image dimensions are strictly specified using Next.js `<Image>` with blur placeholders. Metric audit reveals CLS of `0.000` and First Load JS well below budget (94 kB).
3. **Graceful Loading & Empty States:**
   Rather than showing empty blanks or generic spinners, new users with zero order history are greeted with an accessible, high-contrast illustration and immediate navigation back to the menu.

### Three Clarifying Questions
1. *What happens to client polling if the restaurant server experiences a brief 10-second timeout?*  
   *Context:* SWR will back off, but would exposing an explicit "Reconnecting..." badge prevent customers from repeatedly refreshing the page?
2. *How is the in-memory idempotency cache managed during high-volume periods?*  
   *Context:* If 10,000 orders are submitted over a weekend, does the un-evicted `Map` in `app/actions.js` present an eventual memory leak risk?
3. *Could the Leaflet map in the tracking view support a fallback image for users with JavaScript disabled?*  
   *Context:* Since Leaflet requires `"use client"` with `ssr: false`, non-JS crawlers see an empty container; a static map snapshot would improve progressive enhancement.
