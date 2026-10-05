# Addis Eats on Next.js — File-Based Routing

A Next.js project carrying the whole Addis Eats route tree, built entirely from folders and App Router reserved files: home, menu, dynamic dish detail, cart, and checkout, with `loading.js`, `error.js`, and `not-found.js` states.

---

## Folder Tree

```text
app/
├── layout.js                 # root shell wrapping all pages with global navigation
├── page.js                   # /
├── not-found.js              # 404 handler for unknown URLs and notFound() calls
├── components/
│   └── ClientNavButton.js    # client component pushing with useRouter
├── menu/
│   ├── page.js               # /menu
│   ├── loading.js            # loading UI skeleton for menu segment
│   ├── error.js              # client error boundary ("use client")
│   ├── DishList.jsx          # colocated component (not a route)
│   ├── CategoryBar.jsx       # colocated component (not a route)
│   ├── MenuExplorer.js       # colocated client component
│   └── [id]/
│       └── page.js           # /menu/[id] (e.g. /menu/kitfo)
├── cart/
│   └── page.js               # /cart
└── checkout/
    └── page.js               # /checkout
```

---

## Route & File Mapping

| Route | Producing File | Description |
| :--- | :--- | :--- |
| `/` | `app/page.js` | Home page with featured dishes and navigation |
| `/menu` | `app/menu/page.js` | Full menu listing with category filtering |
| `/menu/[id]` | `app/menu/[id]/page.js` | Dynamic dish detail reading `params.id` from props |
| `/cart` | `app/cart/page.js` | Order cart summary and checkout button |
| `/checkout` | `app/checkout/page.js` | Delivery and payment details |
| `*` (404) | `app/not-found.js` | Missing resource and explicit `notFound()` handler |

---

## Check Yourself

### • Does `npm run build` list every route you expected, and no routes you did not?
Yes. Running `npm run build` prints:
```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /cart
├ ○ /checkout
├ ƒ /menu
└ ƒ /menu/[id]
```
All five routes and `_not-found` are listed. Colocated components (`DishList.jsx`, `CategoryBar.jsx`) do not produce routes.

### • Is `DishList.jsx` unreachable as a URL even though it sits inside `app/`?
Yes. Only files named `page.js` define reachable routes in the App Router. Navigating to `/menu/DishList` triggers `notFound()` because `DishList` is not a registered route or valid dish ID, returning a 404.

### • Does the dish page work when typed directly into the address bar?
Yes. Typing `/menu/kitfo` or `/menu/doro-wat` into the browser address bar reads the dynamic parameter directly from `params.id` in `app/menu/[id]/page.js` and renders the dish details on the server.

### • Does throttling the connection reveal your `loading.js`?
Yes. When network throttling is enabled or when navigating to `/menu?loading=true`, Next.js displays `app/menu/loading.js` (skeleton fallback) via React Suspense until data fetching finishes.

### • Does a deliberate throw show `error.js`, and an unknown dish id show `not-found.js`?
Yes.
- Navigating to `/menu?error=true` forces a server-side exception, which triggers `app/menu/error.js` with retry capability (`reset()`).
- Navigating to an invalid dish ID such as `/menu/invalid-dish` invokes `notFound()` in `app/menu/[id]/page.js` and renders `app/not-found.js`.
