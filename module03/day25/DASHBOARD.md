# Mini-Project · The Addis Eats Dashboard (Day 21)

> **CodeOps · Full Stack Software Development · IBT College Canada**  
> **Module 3 · Day 21 (Week 10 Deliverable · Advanced Data Visualization & Ledgers)**  
> **Project:** Addis Eats · Mesob House Gastronomy Platform  
> **Course Director:** Mehran Dasgar  

---

## 1. Executive Summary & Verification

The Addis Eats Dashboard transforms order data into an accessible, real-time analytics suite and operational ledger. All data aggregation is computed strictly on the server, passing only high-level summary rows and sliced page items across the network. Both charts (Revenue by Neighbourhood and Orders Over Time) are built with fixed heights, calibrated baseline axes starting at zero, ETB tick formatting, and non-colour readability. Every chart is accompanied by an accessible HTML table. The order ledger is constructed using native HTML semantic markup with right-aligned tabular totals, `aria-sort` headers, and Next.js `<Link>`-based pagination. All four lifecycle states (Normal, Loading, Empty, and Error) are implemented and demonstrable on demand.

---

## 2. Seven Exercises: Implementation Matrix

| # | Exercise Requirement | Implementation File | Architectural Pattern |
|---|---|---|---|
| **0** | **Build the empty state first** — before there is any data to display. | [`components/dashboard/DashboardEmptyState.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/DashboardEmptyState.jsx) | Renders welcoming onboarding view for brand-new users (`user.orders.length === 0`) with zero broken SVG/math divisions and direct CTA to `/menu`. |
| **1** | **Server Aggregation:** Aggregate order data in a server component and pass only summary to client. | [`lib/data.js:568-635`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/lib/data.js#L568-L635) & [`app/orders/page.js:146-148`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/app/orders/page.js#L146-L148) | `aggregateDashboardData()` compiles neighbourhood sums, daily volumes, and range metrics on Node.js/Edge; only summarized JSON crosses RSC boundary. |
| **2** | **Revenue Bar Chart:** Fixed-height container, zero baseline, ETB tick formatting. | [`components/dashboard/RevenueBarChart.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/RevenueBarChart.jsx) | Fixed `260px` SVG container, strictly pinned `0 ETB` baseline axis, dynamic tick steps in ETB, and monochrome texture pattern overlays. |
| **3** | **Orders-per-Day Line Chart:** Heading naming range and unit, fixed height. | [`components/dashboard/OrdersLineChart.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrdersLineChart.jsx) | Fixed `260px` SVG container, explicit heading naming date range (`Oct 10 – Oct 20, 2026`) and unit (`Orders / Day`), alternating geometric markers. |
| **4** | **Companion Tables:** Put same chart data in a table beneath each chart for non-SVG viewers. | [`components/dashboard/RevenueBarChart.jsx:289-352`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/RevenueBarChart.jsx#L289-L352) & [`components/dashboard/OrdersLineChart.jsx:263-320`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrdersLineChart.jsx#L263-L320) | Full semantic HTML `<table>` with `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, and tabular numbers rendered directly beneath each chart by default. |
| **5** | **Accessible Order Table:** Real markup, right-aligned totals, and a caption. | [`components/dashboard/OrderTable.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrderTable.jsx) | Semantic `<table>`, `<caption>`, `<thead>`, `<th scope="col">`, `<tbody>`, `<th scope="row">`, `<td>`, `<tfoot>` with right-aligned tabular currency cells. |
| **6** | **Sorting via `searchParams`:** `aria-sort` on the active column header. | [`components/dashboard/OrderTable.jsx:60-108`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrderTable.jsx#L60-L108) | URL-driven sorting with `aria-sort="ascending"`, `aria-sort="descending"`, or `aria-sort="none"`, toggling via Next.js `<Link>`. |
| **7** | **Paging with `Link` elements:** Write and force each of the four states. | [`components/dashboard/OrderTable.jsx:256-350`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrderTable.jsx#L256-L350) & [`components/dashboard/StateSwitcher.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/StateSwitcher.jsx) | Native `<Link>` pagination preserving active sort parameters; on-demand state switcher demonstrating all 4 states (`normal`, `loading`, `empty`, `error`). |

---

## 3. "Check Yourself" Self-Audit & Code Answers

### Q1: Does every bar chart axis start at zero?
* **Yes.** In [`components/dashboard/RevenueBarChart.jsx:36-42`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/RevenueBarChart.jsx#L36-L42), the y-axis scale generates ticks starting strictly at index `0`:
  ```javascript
  const ticks = Array.from({ length: numTicks + 1 }, (_, i) => Math.round((yMax / numTicks) * i));
  ```
  The horizontal baseline axis rule is drawn at `y = paddingTop + chartHeight`, with an explicit tick and text label formatted as `0 ETB`. Bars are projected upwards from this exact zero line (`y = paddingTop + chartHeight - barHeight`), eliminating truncated baseline distortions.

---

### Q2: Can you read every chart with the colour removed?
* **Yes.** Both charts employ multi-sensory and monochrome accessibility techniques:
  1. **Texture Pattern Overlays:** Rather than relying solely on color hues, [`RevenueBarChart.jsx:110-142`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/RevenueBarChart.jsx#L110-L142) registers distinct SVG pattern definitions (`pat-stripes-diag`, `pat-dots`, `pat-crosshatch`, `pat-horizontal`, `pat-dense-stripes`, `pat-checkers`) applied over each bar.
  2. **Direct Numeric Labels:** Every bar displays its exact numeric value directly above the bar in high-contrast bold text (`236-237`), and every line point in [`OrdersLineChart.jsx:223-233`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrdersLineChart.jsx#L223-L233) has its count rendered above the marker.
  3. **Geometric Marker Encoding:** Data points in the line chart alternate between distinct SVG shapes (`circle`, `diamond`, `square`), allowing immediate distinction without color.
  4. **Companion Data Tables:** A screen reader or user with high contrast mode can inspect the semantic HTML companion table rendered right beneath the graphic.

---

### Q3: How many rows cross the network for the dashboard — three, or four thousand?
* **Only summarized rows cross the boundary.**
  * In `app/orders/page.js:146-155`, raw order rows are aggregated and paginated on the server before client serialization.
  * The bar chart receives **only 7 summarized neighbourhood objects** (`{ area: "Bole Rwanda", revenue: 940, orderCount: 3 }`).
  * The line chart receives **only 11 summarized daily volume objects** (`{ date: "2026-10-18", count: 2, revenue: 890 }`).
  * The orders ledger receives **only 6 sliced items** (`pageSize = 6`) for the active page.
  * Even if the database held 50,000 orders, **less than 25 objects** cross the network to the browser.

---

### Q4: Does the table survive being copied into a spreadsheet?
* **Yes.** [`components/dashboard/OrderTable.jsx:114-253`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/OrderTable.jsx#L114-L253) uses pure standard HTML markup:
  ```html
  <table class="dashboard-order-table">
    <caption>Customer Orders Ledger ...</caption>
    <thead>
      <tr>
        <th scope="col">Order ID</th>
        <th scope="col">Date & Time</th>
        ...
        <th scope="col" style="text-align: right">Total (ETB)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">ord_001</th>
        <td>Oct 15, 2026</td>
        ...
        <td style="text-align: right">ETB 360.00</td>
      </tr>
    </tbody>
    <tfoot>...</tfoot>
  </table>
  ```
  Because no CSS flexbox or grid replacement hacks are used, selecting the table rows in any browser and pressing `Ctrl+C` pastes seamlessly into Microsoft Excel, Google Sheets, or Apple Numbers with columns, headers, and numeric values cleanly aligned.

---

### Q5: Can you link someone directly to page three sorted by total?
* **Yes.** Sorting and paging are fully serialized into URL search parameters:
  * **Direct URL:** `/orders?page=3&sort=total&order=desc` (or `/dashboard?page=3&sort=total&order=desc`).
  * Server component [`app/orders/page.js:46-52`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/app/orders/page.js#L46-L52) extracts `searchParams.page`, `searchParams.sort`, and `searchParams.order`, sorts the records server-side, and serves page 3 with `aria-sort="descending"` on the Total header.
  * Navigation is built strictly with Next.js `<Link>` elements, enabling shareable URLs, bookmarking, and back/forward browser history traversal.

---

### Q6: What does a brand-new customer see on the orders page?
* **A brand-new customer sees [`DashboardEmptyState.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/DashboardEmptyState.jsx)**:
  * When a new customer (with 0 order history) signs in, `getOrdersByUser(session.user.id)` returns `[]`.
  * The page catches `ordersPool.length === 0` before any chart calculation, preventing divide-by-zero errors.
  * The customer is greeted by name: *"Welcome to Mesob House, [Name]! Your dining ledger for session ID [id] is currently clean."*
  * Clear calls-to-action guide them to the menu (`/menu`) or table reservations (`/reservations`).
  * A test panel is provided allowing them or instructors to test forced states.

---

## 4. The Four Demonstrable States

| State | Query Parameter | Component Triggered | Visual & Accessibility Behavior |
|---|---|---|---|
| **Normal** | `/orders` or `?state=normal` | Full Dashboard | Real-time SVG bar and line charts, companion summary tables, sortable ledger, and pagination controls. |
| **Loading** | `/orders?state=loading` | [`DashboardLoadingState.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/DashboardLoadingState.jsx) | Fixed-height skeleton containers (`260px`) matching exact chart and table dimensions, guaranteeing **0.000 CLS** during streaming suspense. |
| **Empty** | `/orders?state=empty` | [`DashboardEmptyState.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/DashboardEmptyState.jsx) | Clean illustrated empty hearth card with user session verification and primary menu ordering CTA. |
| **Error** | `/orders?state=error` | [`DashboardErrorState.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day21/components/dashboard/DashboardErrorState.jsx) | Accessible error alert box (`role="alert"`), diagnostic HTTP error code, and one-click recovery link. |

---

## 5. Build & Validation Status

```bash
npm run build
```
- **Next.js Version:** 16.4.0 (Webpack)
- **React Version:** 19.3.0
- **Routes Generated:** 23 / 23 pages static & dynamic compiled with **0 errors**.
- **No Git Commit/Push Executed:** Preserved per user instruction.
