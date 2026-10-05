# Addis Eats on Next.js — File-Based Routing System
**Module 3 · Day 36 / Day 11 · CodeOps Full Stack Software Development**

A Next.js App Router project carrying the complete Addis Eats route tree, built entirely from folder conventions: home, menu, dynamic dish pages, cart, and checkout, with `loading.js`, `error.js`, and `not-found.js` states declared by reserved file names.

---

## 📁 Full `app/` Tree & File-to-Route Mapping

```text
app/
├── layout.js                 # Root shell with global navigation and styling
├── page.js                   # Route: /
├── not-found.js              # 404 handler for unrecognized URLs and notFound() calls
├── components/
│   └── ClientNavButton.js    # Client component demonstrating useRouter().push
├── menu/
│   ├── page.js               # Route: /menu
│   ├── loading.js            # Loading skeleton stream for the menu segment
│   ├── error.js              # Client error boundary ("use client") with retry
│   ├── DishList.jsx          # Colocated component (NOT a route)
│   ├── CategoryBar.jsx       # Colocated component (NOT a route)
│   ├── MenuExplorer.js       # Colocated client component
│   └── [id]/
│       └── page.js           # Dynamic Route: /menu/[id] (e.g. /menu/kitfo)
├── cart/
│   └── page.js               # Route: /cart
└── checkout/
    └── page.js               # Route: /checkout
```

### Route Table

| Route URL | File Path | Type | Description |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.js` | ○ Static | Landing page with hero, route architecture breakdown, and featured dishes. |
| `/menu` | `app/menu/page.js` | ƒ Dynamic | Server component rendering menu items, category filters, and state test panels. |
| `/menu/[id]` | `app/menu/[id]/page.js` | ƒ Dynamic | Dynamic dish route reading `params.id` from props. Calls `notFound()` if id is invalid. |
| `/cart` | `app/cart/page.js` | ○ Static | Order basket and summary with `useRouter` checkout pusher. |
| `/checkout` | `app/checkout/page.js` | ○ Static | Delivery details, Telebirr/CBE payment method selector, and order placement. |
| `*` (404) | `app/not-found.js` | ○ Static | Custom not-found screen triggered by missing URLs or `notFound()` calls. |

---

## 🎯 Verification of Graded Requirements

### 1. Five routes created as folders, each with a default-export `page.js`
- `/` -> `app/page.js` (`export default async function HomePage()`)
- `/menu` -> `app/menu/page.js` (`export default async function MenuPage()`)
- `/menu/[id]` -> `app/menu/[id]/page.js` (`export default async function DishDetailPage()`)
- `/cart` -> `app/cart/page.js` (`export default function CartPage()`)
- `/checkout` -> `app/checkout/page.js` (`export default function CheckoutPage()`)

### 2. A dynamic `/menu/[id]` route reading `params` from its props rather than a hook
- Handled in `app/menu/[id]/page.js`:
  ```javascript
  export default async function DishDetailPage({ params }) {
    const { id } = await params; // Read from component props
    const dish = await getDishById(id);
    if (!dish) notFound();
    return <h1>{dish.name}</h1>;
  }
  ```
- Renders directly on the server without client-side hooks like `useParams()`.

### 3. Menu components colocated in `app/menu/` and demonstrably not routable
- `DishList.jsx` and `CategoryBar.jsx` are placed directly in `app/menu/`.
- In Next.js App Router, only files named `page.js` define reachable routes.
- Navigating to `/menu/DishList` or `/menu/CategoryBar` returns a 404 because neither contains a `page.js`.

### 4. `loading.js` and `error.js` on the menu segment, both proven to render
- **`app/menu/loading.js`**: Automatically wraps the menu segment in a React Suspense boundary. Shows an animated skeleton when the connection is throttled or when testing `/menu?loading=true`.
- **`app/menu/error.js`**: Declared with `"use client"`. Catches runtime errors (tested via `/menu?error=true`), displaying a structured error card and a `reset()` retry button.

### 5. `not-found.js`, reached both by a bad URL and by calling `notFound()`
- **Bad URL**: Navigating to `/random-invalid-url` triggers `app/not-found.js`.
- **Calling `notFound()`**: Requesting an unregistered dish (e.g. `/menu/unknown-dish`) calls `notFound()` from `next/navigation` in `app/menu/[id]/page.js`, rendering `app/not-found.js`.

### 6. Every navigation using `next/link`, with no plain anchors between internal routes
- All cross-route navigation throughout `app/layout.js`, `app/page.js`, `app/menu/page.js`, `app/menu/[id]/page.js`, `app/cart/page.js`, and `app/checkout/page.js` strictly uses `<Link href="...">` from `next/link`.
- Programmatic client-side navigation is implemented with `useRouter().push()` in `app/components/ClientNavButton.js`.

---

## 🧪 "Check Yourself" Self-Assessment

| Question | Status | Proof / Evidence |
| :--- | :---: | :--- |
| **Does `npm run build` list every route you expected, and no routes you did not?** | **PASS** | Output lists `/`, `/_not-found`, `/cart`, `/checkout`, `/menu`, and `/menu/[id]`. No unexpected routes. |
| **Is `DishList.jsx` unreachable as a URL even though it sits inside `app/`?** | **PASS** | `curl http://localhost:3000/menu/DishList` triggers `notFound()` (HTTP 404). Only `page.js` creates a route. |
| **Does the dish page work when typed directly into the address bar?** | **PASS** | `http://localhost:3000/menu/kitfo` loads "Special Gurage Kitfo" with full price, description, and Amharic text. |
| **Does throttling the connection reveal your `loading.js`?** | **PASS** | `app/menu/loading.js` renders with skeleton pulses during network delay or `/menu?loading=true`. |
| **Does a deliberate throw show `error.js`, and an unknown dish id show `not-found.js`?** | **PASS** | `/menu?error=true` renders the `error.js` boundary with `reset()`. `/menu/invalid-id` renders `not-found.js`. |
