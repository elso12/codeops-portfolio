# Addis Eats — Day 39 · API Routes & Route Handlers

> **CodeOps Full Stack · Module 3 · Day 39**  
> Next.js application with route handlers, server actions, and authorisation — all in one repository.

---

## Endpoints

| Method | Path | Status codes | Description |
|--------|------|-------------|-------------|
| `GET` | `/api/dishes` | 200 | All dishes. Optional `?category=Main\|Breakfast\|Drinks` |
| `GET` | `/api/dishes/[id]` | 200, 404 | One dish. 404 + error shape for unknown id |
| `GET` | `/api/orders` | 200, 401 | Orders for the signed-in user |
| `GET` | `/api/orders/[id]` | 200, 401, 403, 404 | One order (owner only) |
| `POST` | `/api/orders` | 201, 400, 401, 404, 422, 500 | Place an order — validates with shared Zod schema |

### Error shape (always the same keys)

```json
{ "error": "Validation failed", "fieldErrors": { "phone": ["Use 09... or +2519..."] } }
```

---

## Server Actions (`app/actions.js`)

| Action | Description |
|--------|-------------|
| `placeOrder(prevState, formData)` | Validates with `orderSchema`, creates order, calls `revalidatePath("/orders")` |
| `cancelOrder(orderId)` | Checks session **and** ownership before cancelling |

---

## Pages

| Route | Type | Rendering |
|-------|------|-----------|
| `/` | Server Component | Featured dishes, hero banner, culinary pillars |
| `/menu` | Server Component | Full menu, `?category=` filter with ISR |
| `/menu/[id]` | Server Component | Dish detail, `notFound()` for unknowns (SSG) |
| `/offers` | Server Component | Special promotional feasts and banquet packages |
| `/reservations` | Server + Client | Table and mesob reservation booking form |
| `/cart` | Client Component | Interactive shopping cart persisted with localStorage |
| `/checkout` | Server + Client | Form uses `useActionState(placeOrder)` |
| `/orders` | Server Component | Order list with `CancelButton` client leaf |
| `/login` | Server + Client | Authentication and guest sign-in portal |
| `/register` | Server + Client | Member onboarding and rewards registration |

---

## curl Examples

```bash
# All dishes
curl http://localhost:3000/api/dishes

# Filter by category
curl "http://localhost:3000/api/dishes?category=Main"

# One dish (valid)
curl http://localhost:3000/api/dishes/dish_001

# One dish (unknown id → 404)
curl http://localhost:3000/api/dishes/dish_999

# Place a valid order → 201
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"0912345678","dishId":"dish_001","quantity":2,"area":"Bole"}'

# Invalid phone → 422 with fieldErrors
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"name":"Abebe","phone":"invalid","dishId":"dish_001","quantity":2,"area":"Bole"}'

# List orders
curl http://localhost:3000/api/orders

# One order (replace ord_001 with real id)
curl http://localhost:3000/api/orders/ord_001
```

---

## Security Checklist

- [x] Validation runs on the **server** — the client form is only a courtesy
- [x] `cancelOrder` checks the session **and** that `order.userId === user.id`
- [x] `DATABASE_URL`, `TELEBIRR_SECRET`, `SESSION_SECRET` have **no** `NEXT_PUBLIC_` prefix — invisible to browsers
- [x] `.env.local` is in `.gitignore` (added by `create-next-app`)
- [x] Stack traces are logged server-side; callers receive only a safe message

---

## Running Locally

```bash
npm run dev   # http://localhost:3000
```

## Project Structure

```
app/
  api/
    dishes/
      route.js          ← GET /api/dishes
      [id]/route.js     ← GET /api/dishes/[id]  (404 for unknown)
    orders/
      route.js          ← GET + POST /api/orders
      [id]/route.js     ← GET /api/orders/[id]  (auth + ownership)
  actions.js            ← "use server" — placeOrder, cancelOrder
  checkout/
    page.js             ← server shell (passes dish list as props)
    CheckoutForm.jsx    ← "use client" — useActionState, pending state
  menu/
    page.js             ← server component, ?category filter
    [id]/page.js        ← server component, notFound()
  orders/
    page.js             ← server component (revalidated after writes)
    CancelButton.jsx    ← "use client" — useTransition
lib/
  schema.js             ← shared Zod schema (form + server)
  data.js               ← in-memory store (replace with DB in production)
  session.js            ← session helper (replace with NextAuth/Clerk)
```
