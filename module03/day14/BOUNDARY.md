# Server-Client Boundary

This document tracks which components run on the server and which run on the client, along with the reasoning for placing the boundary there.

| Component / Route | Location | Reason |
| :--- | :--- | :--- |
| `app/layout.js` | **Server** | Wraps the application. Passes server-rendered children into the client provider without forcing the children to be client components. |
| `app/page.js` | **Server** | Landing page; requires no interactivity and fetches data directly on the server to render static HTML. |
| `app/menu/page.js` | **Server** | Fetches the dish catalog from the data layer on the server, keeping the data-fetching code out of the browser bundle. |
| `app/menu/[id]/page.js` | **Server** | Dish detail pre-rendered via `generateStaticParams()`. Reads params server-side with zero client JS overhead. |
| `app/menu/layout.js` | **Server** | Category navigation and layout wrapper. Server component passing children through. |
| `app/menu/loading.js` | **Server** | Instant streaming loading state skeleton while data resolves. |
| `app/menu/error.js` | **Client** | Next.js requires error boundaries to be client components to hook into React's error lifecycle. |
| `app/not-found.js` | **Server** | Static 404 page shell triggered when `notFound()` is invoked. |
| `app/cart/page.js` | **Client** | Displays the contents of the client-side cart store and includes interactive quantity modifiers. |
| `app/checkout/page.js` | **Server** | Pre-fetches dish catalog and passes serialized dish options down to client form. |
| `app/checkout/CheckoutForm.jsx` | **Client** | Interactive form leaf. Uses `useActionState(placeOrder)` for progressive enhancement and form state management. |
| `app/orders/page.js` | **Server** | Reads authenticated session and queries user orders directly on the server for data privacy. |
| `app/orders/CancelButton.jsx` | **Client** | Interactive button leaf. Uses `useTransition` to trigger `cancelOrder` server action with optimistic or pending indicator. |
| `components/Providers.jsx` | **Client** | "use client" context boundary. Wraps children so they can consume React context (Cart) while remaining server components themselves. |
| `components/CartContext.jsx` | **Client** | Manages React state (`useState`) and browser APIs (`localStorage`) to persist the cart. Must be client-side. |
| `components/AddToCartButton.jsx` | **Client** | Leaf component. Needs an `onClick` handler to add items to the cart context. |
| `components/Navbar.jsx` | **Client** | Needs to read `cartCount` from the CartContext to display the live item badge. |
