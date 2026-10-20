# AUTH.md — Access Control Decisions, Layer Attribution & Security Attack Audit

> **Addis Eats · Mesob House Restaurant**  
> **CodeOps Full Stack · Module 3 · Day 45 (Day 20 Advanced Project Deliverable)**  
> **Designed to the Day 45 Curriculum Standard (Mehran Dasgar)**

---

## 1. Decision One: "Who May See What" (Slide 11 Standard)

> *"Write the fourth column. The habit that matters is the last column. 'Protected by middleware' is not an answer — middleware only proves a cookie exists. Saying exactly what each layer establishes is what shows you where the gap is, and the gap is almost always an action that trusts an id it was handed."*

| ROUTE | WHO | PROTECTED BY | WHAT THAT PROVES |
| :--- | :--- | :--- | :--- |
| **`/menu`** | Everyone | Nothing | It is public, and should stay indexable |
| **`/orders`** | The owner | Middleware + page + scoped query | Signed in, and only their own records |
| **`/checkout`**| Any signed-in | Middleware + page | Signed in — the write checks the rest |
| **`/kitchen`** | Staff only | Page + role check in every action | Signed in, and permitted |

### Granular Layer-by-Layer Proof Breakdown

#### For `/orders` (Private Customer Dashboard)
```text
/orders
├── middleware -> cookie exists and has valid cryptographic HMAC signature
├── page       -> session verified via getSession() at SSR runtime; redirects if absent
├── query      -> getOrdersByUser(session.user.id) strictly bound to session ID
└── action     -> cancelOrder(id) re-checks getSession() + validates order.userId === session.user.id
```

#### For `/checkout` (Private Ordering Form)
```text
/checkout
├── middleware -> cookie exists and has valid cryptographic HMAC signature
├── page       -> session verified via getSession(); loads available dishes for user
└── action     -> placeOrder(formData) reads user.id strictly from getSession(), never from hidden form inputs
```

#### For `/kitchen` (Staff Expediter Board)
```text
/kitchen
├── middleware -> cookie exists (redirects guest callers to /login?next=/kitchen)
├── page       -> session verified; enforces user.role === 'staff' (returns HTTP 403 Forbidden if customer)
└── action     -> updateKitchenStatus(id, status) enforces user.role === 'staff' before modifying state
```

---

## 2. DevTools Cookie Flags Verification

Addis Eats sessions use **HMAC-SHA256 cryptographically signed tokens** implemented with native Web Crypto (`crypto.subtle`) in [`lib/session.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js).

Inspected directly in DevTools (`Application` -> `Storage` -> `Cookies`):

| Cookie Name | Value / Format | Domain | Path | Expires / Max-Age | Size | HttpOnly | Secure | SameSite | What it Proves |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `mesob_session` | `<base64urlPayload>.<signature>` | `localhost` / `addiseats.et` | `/` | 86,400s (24h) | ~240 B | **✓ Checked** | **✓ Checked** | **Lax** | JavaScript cannot access token (XSS immune), sent over HTTPS only, CSRF protected. |

---

## 3. Verifying the Protection: The Three Attacks (Slide 17 Standard)

Executed from the browser developer console and through [`app/security-lab/page.js`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/security-lab/page.js) and [`app/orders/AttackTestBox.jsx`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/AttackTestBox.jsx).

### Attack 1: Calling a Server Action While Signed Out
```javascript
// Console command:
await cancelOrder("ord_001");
```
* **Expected Result:** Refused, not a crash.
* **Actual Result:** **REFUSED (Promise Rejected with Error)**  
  `Error: Unauthorized: Authentication required. Session is missing or invalid.`
* **Named Line of Defense That Stopped It:**  
  **[`app/actions.js:143-146`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L143-L146)**  
  ```javascript
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized: Authentication required. Session is missing or invalid.");
  }
  ```
  *(Also backed by Edge Middleware [`middleware.js:16-21`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/middleware.js#L16-L21) and Page SSR Gate [`app/orders/page.js:30-33`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/page.js#L30-L33)).*

---

### Attack 2: Signed In as Someone Else (Cross-Account IDOR)
```javascript
// Signed in as Abebe (user_abebe_001), targeting Chala's order (user_chala_002):
await cancelOrder("ord_003");
```
* **Expected Result:** Refused on ownership, not on session.
* **Actual Result:** **REFUSED (Ownership Mismatch Error & HTTP 403)**  
  `Error: Forbidden: Ownership mismatch. Order "ord_003" belongs to "user_chala_002", not session "user_abebe_001".`
* **Named Line of Defense That Stopped It:**  
  * **In Server Action:** **[`app/actions.js:155-159`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L155-L159)**  
    ```javascript
    if (order.userId !== user.id && user.role !== "staff") {
      throw new Error(`Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`);
    }
    ```
  * **In Route Handler:** **[`app/api/orders/[id]/route.js:26-28`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/api/orders/%5Bid%5D/route.js#L26-L28)**  
    ```javascript
    if (order.userId !== user.id && user.role !== "staff") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    ```

---

### Attack 3: Crafted Open Redirect Phishing Sign-In Link
```text
GET /login?next=https://example.com
// Or submitting sign-in form with next="https://evil-phishing.com"
```
* **Expected Result:** Lands on `/orders` (or `/`), not on `example.com`.
* **Actual Result:** **BLOCKED & SANITIZED**  
  Destination was sanitized to `/orders` safe relative path; external domain navigation refused.
* **Named Line of Defense That Stopped It:**  
  **[`lib/session.js:185-204`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/lib/session.js#L185-L204)** & **[`app/actions.js:61`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/actions.js#L61)**  
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

---

### Attack 4: Parameter Tampering on the Private URL
* **Attempt:** Customer navigates to `http://localhost:3000/orders?userId=user_chala_002` trying to view Chala's order history.
* **Expected Result:** Customer sees only their own orders; query parameter completely ignored.
* **Actual Result:** **IMMUNE (Zero leak)**  
  [`app/orders/page.js:37`](file:///c:/Users/hp/Desktop/IBT/codeops-portfolio/module03/day20/app/orders/page.js#L37) ignores `searchParams` and queries `getOrdersByUser(user.id)` from verified cookie session.

---

## 4. Capstone Mapping

Applied to capstone routes:
1. Every private route lists its `WHO`, `PROTECTED BY`, and `WHAT THAT PROVES`.
2. Every mutation checks `record.userId === session.user.id`.
3. The three attacks are executed against the capstone and their stopping line numbers recorded.
