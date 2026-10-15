# Addis Eats — Day 42 · Authentication, Authorization & Security Architecture

> **CodeOps Full Stack · Module 3 · Day 42 (Day 17 Project)**  
> Production-grade authentication, cryptographic session cookies, Edge middleware route protection, and bulletproof defense-in-depth against the 3 core web security attacks.

---

## Architecture Overview

```
                      ┌───────────────────────────────────────┐
                      │            Browser Client             │
                      └──────────────────┬────────────────────┘
                                         │
                                         ▼
                      ┌───────────────────────────────────────┐
                      │       Layer 1: Edge Middleware       │
                      │   (middleware.js - matcher checks)    │
                      └───────┬───────────────────────┬───────┘
            Unauthenticated   │                       │ Authenticated
            (Redirect /login) │                       │ (Proceed)
                              ▼                       ▼
              ┌─────────────────────────┐   ┌─────────────────────────┐
              │      /login Page        │   │ Layer 2: Server Comp    │
              │  (?next= safe sanitized)│   │ (getSession() SSR check)│
              └─────────────────────────┘   └────────────┬────────────┘
                                                         │
                                                         ▼
                                            ┌─────────────────────────┐
                                            │ Layer 3: Server Action  │
                                            │ - Level 1: Auth check   │
                                            │ - Level 2: IDOR check   │
                                            │ - Scoped DB Queries     │
                                            └─────────────────────────┘
```

---

## The 3 Core Security Attacks & Line-Level Defense

### Attack 1: Broken Authentication (Direct Server Action Invocation)
- **The Threat:** Server Actions are exposed public HTTP POST endpoints. An attacker can construct automated HTTP requests using `curl` or scripts without presenting a valid session cookie.
- **Vulnerability if unmitigated:** The server executes mutations or reads private records for an anonymous caller.
- **Line-Level Defense (`app/actions.js:143-146`):**
  ```javascript
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized: Authentication required. Session is missing or invalid.");
  }
  ```

### Attack 2: Insecure Direct Object References (Cross-Account IDOR)
- **The Threat:** An attacker signs into their legitimate account (`user_abebe_001`), but tampers with form parameters or action arguments to cancel an order (`ord_003`) owned by another customer (`user_chala_002`).
- **Vulnerability if unmitigated:** Authentication alone (`is logged in?`) allows horizontal privilege escalation across tenant boundaries.
- **Line-Level Defense (`app/actions.js:155-159`):**
  ```javascript
  if (order.userId !== user.id) {
    throw new Error(
      `Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`
    );
  }
  ```

### Attack 3: Open Redirect Vulnerability (Phishing Trap via `?next=`)
- **The Threat:** Attackers construct malicious links such as `/login?next=https://evil-phishing.et` or protocol-relative `//evil.com`. After logging into the authentic app, the user is redirected to the attacker's phishing site.
- **Vulnerability if unmitigated:** The trusted domain is abused to bypass user skepticism and steal secondary credentials.
- **Line-Level Defense (`lib/session.js:183-203`):**
  ```javascript
  export function sanitizeNextUrl(next, fallback = "/orders") {
    if (!next || typeof next !== "string") return fallback;
    const trimmed = next.trim();
    if (
      trimmed.startsWith("/") &&
      !trimmed.startsWith("//") &&
      !trimmed.includes("://") &&
      !trimmed.includes("\\") &&
      !trimmed.includes("\n") &&
      !trimmed.includes("\r")
    ) {
      return trimmed;
    }
    return fallback;
  }
  ```

### Attack 4: Privilege Escalation & Role-Based Access Control (RBAC)
- **The Threat:** An ordinary customer attempts to navigate directly to `/kitchen` or call kitchen status mutation actions.
- **Vulnerability if unmitigated:** Front-end menu hiding is bypassed by direct URL entry or crafted RPC requests.
- **Line-Level Defense (`app/kitchen/page.js:32-34` & `app/actions.js:185-187`):**
  ```javascript
  if (user.role !== "staff") {
    throw new Error("Forbidden: Staff privileges required to update kitchen status.");
  }
  ```

---

## Cryptographic Session Token System

Sessions are signed server-side using the native **Web Crypto API** (`crypto.subtle`), ensuring full compatibility with both Edge runtime and Node.js.

### Token Format
```
<base64urlPayload>.<base64urlSignature>
```
1. **Payload:** JSON containing `id`, `name`, `email`, `role`, and expiration timestamp `exp`.
2. **Signature:** HMAC-SHA256 signature calculated over the Base64URL-encoded payload with `SESSION_SECRET`.

### Cookie Security Flags
```javascript
export const SESSION_COOKIE_OPTIONS = {
  name: "mesob_session",
  httpOnly: true,                         // Inaccessible to JavaScript (XSS mitigation)
  secure: process.env.NODE_ENV === "production", // Transmitted only via HTTPS in prod
  sameSite: "lax",                        // CSRF mitigation across third-party navigations
  maxAge: 60 * 60 * 24,                   // 24 hours
  path: "/",
};
```

---

## Test Accounts Matrix

| Name | Role | Email | Password | Seeded Orders | Authorized Access |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Abebe Kebede** | `customer` | `abebe@mesobhouse.et` | `customer123` | `ord_001`, `ord_002` | `/orders`, `/checkout`, `/cart` |
| **Chala Tadesse** | `customer` | `chala@mesobhouse.et` | `customer123` | `ord_003`, `ord_004` | `/orders`, `/checkout`, `/cart` |
| **Chef Tigist** | `staff` | `chef@mesobhouse.et` | `kitchen123` | All Orders (Read/Write) | `/kitchen`, `/orders`, `/checkout` |

---

## Route Protection & Middleware Configuration

Protected routes are configured via a narrow matcher in `middleware.js`:
```javascript
export const config = {
  matcher: [
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
  ],
};
```
- **Zero Overhead on Public Pages:** `/`, `/menu`, `/offers`, `/security-lab`, and static images `/images/*` bypass Edge middleware completely.
- **Destination Preservation:** Unauthenticated users hitting `/orders` or `/checkout` are redirected to `/login?next=...` and returned safely post-login.

---

## Interactive Security Laboratory (`/security-lab`)

Visit `/security-lab` in the browser to run live penetration tests against:
1. Direct unauthenticated server action calls.
2. Cross-account IDOR attempts between Abebe and Chala.
3. Open redirect attacks with malicious external protocols and domain schemes.
4. Kitchen privilege escalation attempts by customer accounts.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build
npm run build
npm start
```
