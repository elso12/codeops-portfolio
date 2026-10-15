# Routing and Rendering Strategy

This document outlines the rendering strategy chosen for each route in the application. Every choice is deliberate and optimizes for the user experience and freshness required by the route.

| Route | Strategy | Reason |
| :--- | :--- | :--- |
| `/` | **Static** | Nobody in particular is asking. The landing page has no user-specific data, so it can be fully pre-rendered and served from a CDN. |
| `/menu` | **ISR (3600)** | The menu items change a few times a day (availability, price). `revalidate = 3600` ensures it stays fast (Static/ISR) but never goes stale beyond an hour. |
| `/menu/[id]` | **Static (Params)** | We know all the dish IDs at build time. Using `generateStaticParams` pre-renders them once as static HTML for instant loading. |
| `/offers` | **Static** | Promotional seasonal banquet discounts and specials with fixed pricing for CDN edge caching. |
| `/reservations` | **Static Shell + Client Leaf** | Static page shell with interactive reservation booking leaf for date/table selections. |
| `/login` | **Static Shell + Client Leaf** | Static authentication portal shell with client-side credential handler. |
| `/register` | **Static Shell + Client Leaf** | Static member registration shell with client-side onboarding form. |
| `/cart` | **Client** | Private to one browser tab. The cart lives in local storage, so it must be rendered on the client. |
| `/checkout` | **Dynamic** | Submits a form using a Server Action (which implies a dynamic POST). Validates and writes data directly to the server. |
| `/orders` | **Dynamic** | Private user data. It reads the user session server-side to show only their orders, meaning it must render on request. |
| `/orders/[id]` | **Dynamic (RSC) + SWR Polling** | Server Component reads the order for zero-spinner first paint (`fallbackData`). Client `useSWR` takes over with 5s background polling (`refreshInterval: 5000`). |
| `/api/orders/[id]` | **Dynamic Route Handler** | Target of client SWR polling. Returns real-time order status JSON and supports PATCH for status simulation. |
| `/api/dishes` | **Dynamic Route Handler** | Serves debounced search queries (`?q=`) and paged catalog queries (`?page=&limit=`) with custom pagination metadata. |
