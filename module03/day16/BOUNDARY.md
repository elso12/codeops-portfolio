# Server-Client Boundary

This document tracks which components run on the server and which run on the client, along with the reasoning for placing the boundary there.

| Component / Route | Location | Reason |
| :--- | :--- | :--- |
| `app/layout.js` | **Server** | Wraps the application shell, header, and communal Habesha footer without forcing children into client bundle. |
| `app/page.js` | **Server** | Landing page; renders static Figma hero, culinary pillars, and featured dishes directly on the server. |
| `app/menu/page.js` | **Server** | Fetches the dish catalog from the data layer on the server, keeping the data-fetching code out of the browser bundle (ISR 3600). |
| `app/menu/[id]/page.js` | **Server** | Dish detail pre-rendered via `generateStaticParams()`. Reads params server-side with zero client JS overhead. |
| `app/menu/layout.js` | **Server** | Category navigation and layout wrapper. Server component passing children through. |
| `app/menu/loading.js` | **Server** | Instant streaming loading state skeleton while data resolves. |
| `app/menu/error.js` | **Client** | Next.js requires error boundaries to be client components to hook into React's error lifecycle. |
| `app/not-found.js` | **Server** | Static 404 page shell triggered when `notFound()` is invoked. |
| `app/offers/page.js` | **Server** | Static promotional catalog displaying curated Figma banquet specials and discounts. |
| `app/reservations/page.js` | **Server** | Server shell for table reservation view passing down to interactive form leaf. |
| `app/reservations/ReservationForm.jsx` | **Client** | Interactive form leaf managing reservation state, date picker, seating selection, and dynamic confirmation. |
| `app/login/page.js` | **Server** | Static shell for authentication portal. |
| `app/login/LoginForm.jsx` | **Client** | Interactive form leaf for member credentials and redirect state. |
| `app/register/page.js` | **Server** | Static shell for new member registration. |
| `app/register/RegisterForm.jsx` | **Client** | Interactive form leaf for registration input handling. |
| `app/cart/page.js` | **Client** | Displays the contents of the client-side cart store and includes interactive quantity modifiers. |
| `app/checkout/page.js` | **Server** | Pre-fetches dish catalog and passes serialized dish options down to client form. |
| `app/checkout/CheckoutForm.jsx` | **Client** | Interactive form leaf. Uses `useActionState(placeOrder)` for progressive enhancement and form state management. |
| `app/orders/page.js` | **Server** | Reads authenticated session and queries user orders directly on the server for data privacy. |
| `app/orders/CancelButton.jsx` | **Client** | Interactive button leaf. Uses `useTransition` to trigger `cancelOrder` server action with optimistic or pending indicator. |
| `app/orders/[id]/page.js` | **Server** | Queries order from data store without HTTP round-trips; validates session authorization and seeds `fallbackData` to avoid client spinner. |
| `app/orders/[id]/OrderStatus.jsx` | **Client** | Interactive tracker leaf. Manages `useSWR` 5-second polling (`refreshInterval: 5000`), stage stepper timeline, and state advancement simulation. |
| `app/menu/SearchBox.jsx` | **Client** | Search leaf. Buffers input with 300ms debounce, applies conditional `null` key when empty, and keeps previous results mounted via `keepPreviousData`. |
| `app/menu/PagedDishList.jsx` | **Client** | Pagination leaf. Syncs page number to URL query string (`?page=2`), queries paged API via `useSWR`, and preserves card display between transitions. |
| `components/Providers.jsx` | **Client** | "use client" context boundary. Wraps children so they can consume React context (Cart) while remaining server components themselves. |
| `components/CartContext.jsx` | **Client** | Manages React state (`useState`) and browser APIs (`localStorage`) to persist the cart. Must be client-side. |
| `components/AddToCartButton.jsx` | **Client** | Leaf component. Needs an `onClick` handler to add items to the cart context. |
| `components/CategoryBar.jsx` | **Client** | Interactive category filter leaf; manages selection state and wraps server-rendered dishes as children. |
| `components/Navbar.jsx` | **Client** | Needs to read `cartCount` from the CartContext to display the live item badge across all Figma routes. |
