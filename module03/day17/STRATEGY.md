# Routing, Security & Rendering Strategy

This document details the rendering and security strategy implemented for each route in Day 17 (Module 3 · Day 42).

---

## Route Strategy Table

| Route | Rendering Strategy | Security Tier | Protection Mechanism | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| `/` | **Dynamic / Static** | Public | None | High-speed marketing landing. Features Habesha culinary traditions with zero friction for guests. |
| `/menu` | **Dynamic / Static** | Public | None | Catalog browsing open to all prospective diners. |
| `/menu/[id]` | **Dynamic (Params)** | Public | None | Dish details pre-rendered for instant viewing and sharing. |
| `/login` | **Dynamic** | Public / Auth Gateway | `sanitizeNextUrl` | Gateway for authenticating users. Sets signed cookie and prevents open redirect phishing via `next` sanitization. |
| `/register` | **Dynamic** | Public / Auth Gateway | None | Account creation endpoint for new customers. |
| `/orders` | **Dynamic (`force-dynamic`)** | Protected (Customer) | Middleware + SSR `getSession()` + Scoped Query | Private customer data. Scoped strictly to `getOrdersByUser(user.id)`. Any query string manipulation is ignored. |
| `/checkout` | **Dynamic (`force-dynamic`)** | Protected (Customer) | Middleware + SSR `getSession()` + Action Scoping | Real-time order creation requiring valid customer session. |
| `/kitchen` | **Dynamic (`force-dynamic`)** | Protected (Staff Role) | Server Component RBAC + Action Role Gate | High-privilege operations center. Returns HTTP 403 Forbidden to non-staff users even if directly visited. |
| `/security-lab`| **Dynamic (`force-dynamic`)** | Public Audit Tool | Sandboxed Server Actions | Interactive penetration testing environment to test all 4 attack vectors in real-time. |
| `/api/orders` | **Dynamic (Route Handler)** | Protected (REST) | `getSession()` header check | Programmatic API returning orders for authenticated session or 401 Unauthorized. |
| `/api/dishes` | **Dynamic (Route Handler)** | Public (REST) | None | REST endpoint serving JSON dishes list. |

---

## The Three Defense Rings

```
                     [ OUTER RING: Edge Middleware ]
                     Intercepts requests to /orders and /checkout.
                     Prevents unauthorized traffic from initiating SSR.
                                    │
                                    ▼
                 [ MIDDLE RING: Server Component SSR ]
                 Re-evaluates getSession() during server component execution.
                 Prevents data leakage if middleware configuration changes.
                                    │
                                    ▼
                 [ INNER RING: Action & Query Isolation ]
                 Action checks level-1 authentication and level-2 ownership.
                 DB queries are parameterized strictly by session.id.
```

1. **Why three rings?**
   If a developer mistakenly updates the Edge Middleware matcher pattern or temporarily disables middleware, the application does not collapse into an IDOR vulnerability. The Middle Ring (SSR check) and Inner Ring (Scoped Query & Action Ownership) still guarantee zero unauthorized reads or writes.
