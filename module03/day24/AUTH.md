# AUTH.md — Access Control Decisions, Layer Attribution & Security Attack Audit

> **Addis Eats · Mesob House Restaurant**  
> **CodeOps Full Stack · Module 3 · Day 49 (Week 10 Frontend Capstone Build)**  
> **Lead Engineer:** Mehran Dasgar  
> **Course Director:** Mehran Dasgar  

---

## 1. Decision One: "Who May See What" (Capstone Standard)

> *"Write the fourth column. The habit that matters is the last column. 'Protected by middleware' is not an answer — middleware only proves a cookie exists. Saying exactly what each layer establishes is what shows you where the gap is, and the gap is almost always an action that trusts an id it was handed."*

| ROUTE | WHO | PROTECTED BY | WHAT THAT PROVES |
| :--- | :--- | :--- | :--- |
| **`/menu`** | Everyone | Nothing | It is public, and should stay indexable |
| **`/orders`** | The owner | Middleware + page + scoped query | Signed in, and only their own records |
| **`/orders/[id]`** | The owner or Staff | Page check + API ownership gate | Caller is order owner or expediter staff |
| **`/checkout`**| Any signed-in | Middleware + page + form schema | Signed in — the write checks the rest |
| **`/kitchen`** | Staff only | Page + role check in every action | Signed in, and verified `role === 'staff'` |
| **`/dashboard`**| Staff / Admin | Middleware + page role check | Signed in, and authorized for operational ledger |
| **`/track/[id]`**| The owner or Staff | Server SSR seeding + ownership check | Authenticated and permitted to track live courier GPS |

---

## 2. Granular Layer-by-Layer Proof Breakdown

### For `/orders` (Customer Orders & Aggregated Ledger)
```text
/orders
├── Layer 1: Edge Middleware  -> Cookie exists and has valid cryptographic HMAC-SHA256 signature
├── Layer 2: Server Page SSR   -> Session verified via getSession() at SSR runtime; redirects to /login?next=/orders if absent
├── Layer 3: Scoped Query      -> getOrdersByUser(user.id) strictly bound to session ID; URL parameters ignored
└── Layer 4: Server Action     -> cancelOrder(id) re-checks getSession() + validates order.userId === session.user.id
```

### For `/checkout` (Communal Dining Ordering Form)
```text
/checkout
├── Layer 1: Edge Middleware  -> Rejects unauthenticated visitors with 307 Redirect to /login?next=/checkout
├── Layer 2: Server Page SSR   -> session verified via getSession(); loads available menu items
└── Layer 3: Server Action     -> placeOrder(formData) reads user.id strictly from getSession(), never from hidden form fields
```

### For `/kitchen` (Staff Expediter Board)
```text
/kitchen
├── Layer 1: Edge Middleware  -> Intercepts requests, redirects guests to /login?next=/kitchen
├── Layer 2: Server Page SSR   -> Enforces user.role === 'staff' (renders HTTP 403 Access Restricted if customer)
└── Layer 3: Server Action     -> updateKitchenStatus(id, status) enforces user.role === 'staff' before modifying state
```

### For `/orders/[id]` (Order Status & Live Polling)
```text
/orders/[id]
├── Layer 1: Server Page SSR   -> Loads order via getOrderById(id); verifies order.userId === user.id || user.role === 'staff'
└── Layer 2: Client Route API  -> GET /api/orders/:id re-verifies session + returns HTTP 403 if user is not the owner
```

### For `/track/[id]` (Live Courier GPS & Real-Time Delivery Tracking)
```text
/track/[id]
├── Layer 1: Edge Middleware  -> Intercepts requests; redirects unauthenticated guests with 307 Redirect to /login?next=/track/:id
├── Layer 2: Server Page SSR   -> session verified via getSession(); verifies order.userId === user.id || user.role === 'staff'; renders HTTP 403 on ownership mismatch
└── Layer 3: SSE Route Stream  -> GET /api/orders/:id/stream verifies getSession() (401) + verifies order.userId === user.id || user.role === 'staff' (403) before opening ReadableStream
```

---

## 3. DevTools Cookie Flags Verification

Addis Eats sessions use **HMAC-SHA256 cryptographically signed tokens** implemented with native Web Crypto (`crypto.subtle`) in [`lib/session.js`](./lib/session.js).

Inspected directly in DevTools (`Application` → `Storage` → `Cookies`):

| Cookie Name | Value / Format | Domain | Path | Expires / Max-Age | Size | HttpOnly | Secure | SameSite | What it Proves |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `mesob_session` | `<base64urlPayload>.<signature>` | `localhost` / `addis-eats.vercel.app` | `/` | 86,400s (24h) | ~240 B | **✓ Checked** | **✓ Checked** | **Lax** | JavaScript cannot access token via `document.cookie` (mitigates credential theft via XSS), sent over HTTPS in production (`Secure`), and protected against cross-site POSTs via `SameSite=Lax` and Server Action origin verification. |

> [!NOTE]
> **Session Revocation Limitation:** Stateless cryptographic tokens avoid database lookups per request. However, early revocation of a single token before its 24-hour expiration requires maintaining a revocation blacklist (e.g. Redis) or rotating the global `SESSION_SECRET` (which invalidates all active sessions). This is documented for Module 4 backend migration.

## 4. Verifying the Protection: The Three Security Attacks

Executed live from the browser developer console and verified in [`app/security-lab/page.js`](./app/security-lab/page.js).

### Attack 1: Calling a Protected Server Action While Signed Out
```javascript
// 1. Signed out, from the browser developer console:
await fetch("/api/orders/ord_001", { method: "PATCH" });
// Or calling cancelOrder directly:
await cancelOrder("ord_001");
```
* **Expected Result:** Refused, not a crash.
* **Actual Result:** **REFUSED (Promise Rejected with Error / HTTP 401 Unauthorized)**  
  `Error: Unauthorized: Authentication required. Session is missing or invalid.`
* **Named Line of Defense That Stopped It:**  
  * In Server Action: **[`app/actions.js:159-162`](./app/actions.js#L159-L162)**  
    ```javascript
    const user = await getSession();
    if (!user) {
      throw new Error("Unauthorized: Authentication required. Session is missing or invalid.");
    }
    ```
  * In Route Handler: **[`app/api/orders/[id]/route.js:10-13`](./app/api/orders/%5Bid%5D/route.js#L10-L13)**  
    ```javascript
    const user = await getSession();
    if (!user) {
      return Response.json({ error: "Not signed in" }, { status: 401 });
    }
    ```

---

### Attack 2: Signed In as Someone Else (Cross-Account IDOR)
```javascript
// 2. Signed in as Abebe (user_abebe_001), targeting Chala's order (ord_003):
await cancelOrder("ord_003");
```
* **Expected Result:** Refused on ownership, not on session.
* **Actual Result:** **REFUSED (Ownership Mismatch Error & HTTP 403 Forbidden)**  
  `Error: Forbidden: Ownership mismatch. Order "ord_003" belongs to "user_chala_002", not session "user_abebe_001".`
* **Named Line of Defense That Stopped It:**  
  * In Server Action: **[`app/actions.js:171-175`](./app/actions.js#L171-L175)**  
    ```javascript
    if (order.userId !== user.id) {
      throw new Error(
        `Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`
      );
    }
    ```
  * In Route Handler: **[`app/api/orders/[id]/route.js:26-28`](./app/api/orders/%5Bid%5D/route.js#L26-L28)**  
    ```javascript
    if (order.userId !== user.id && user.role !== "staff") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    ```

---

### Attack 3: Crafted Open Redirect Phishing Sign-In Link
```text
// 3. A crafted return link in URL:
GET /login?next=https://example.com
// Or submitting sign-in form with next="https://evil-phishing.com"
```
* **Expected Result:** Lands on `/orders` (or `/`), not on `example.com`.
* **Actual Result:** **BLOCKED & SANITIZED**  
  Destination was sanitized to `/orders` safe relative path; external domain navigation refused.
* **Named Line of Defense That Stopped It:**  
  * In Session Sanitizer: **[`lib/session.js:185-205`](./lib/session.js#L185-L205)**  
    ```javascript
    export function sanitizeNextUrl(next, fallback = "/orders") {
      if (!next || typeof next !== "string") return fallback;
      const trimmed = next.trim();
      if (
        trimmed.startsWith("/") &&
        !trimmed.startsWith("//") &&
        !trimmed.includes("://") &&
        !trimmed.includes("\\")
      ) {
        return trimmed;
      }
      return fallback;
    }
    ```
  * In Server Action: **[`app/actions.js:61`](./app/actions.js#L61)**  
    ```javascript
    const safeNext = sanitizeNextUrl(nextRaw, user.role === "staff" ? "/kitchen" : "/orders");
    ```

---

### Attack 4: Parameter Tampering on the Private URL
```text
// Attempting to access someone else's order by changing the URL id:
GET /orders/ord_003 (while signed in as Abebe)
```
* **Expected Result:** Refusal rather than someone else's data.
* **Actual Result:** **REFUSED (HTTP 403 Access Restricted Screen)**  
  Page displays: *"Access Restricted: You do not have permission to view this order."* Zero data leakage.
* **Named Line of Defense That Stopped It:**  
  * In Server Page: **[`app/orders/[id]/page.js:39-46`](./app/orders/%5Bid%5D/page.js#L39-L46)**  
    ```javascript
    if (order.userId !== user.id && user.role !== "staff") {
      return (
        <main className="container" style={{ maxWidth: 840, padding: "4rem 1rem", textAlign: "center" }}>
          <h1 style={{ color: "var(--color-paprika)" }}>Access Restricted</h1>
          <p style={{ color: "var(--text-muted)" }}>You do not have permission to view this order.</p>
        </main>
      );
    }
    ```
