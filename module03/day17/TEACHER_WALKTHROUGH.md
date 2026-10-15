# Teacher & Evaluator Walkthrough Guide

**Project:** Addis Eats · Module 03 · Day 42 (Day 17)  
**Topic:** Authentication, Cryptographic Sessions, Middleware Route Protection & Defense-in-Depth Security  

---

## Quick Setup

```bash
cd module03/day17
npm install
npm run dev
# Open browser to http://localhost:3000
```

---

## Step-by-Step Evaluation Walkthrough

### Step 1: Sign-In with 1-Click Test Accounts
1. Navigate to `http://localhost:3000/login`.
2. Notice the **⚡ 1-Click Test Accounts** panel at the bottom:
   - **Abebe Kebede** (`abebe@mesobhouse.et` / `customer123`) — Customer 1
   - **Chala Tadesse** (`chala@mesobhouse.et` / `customer123`) — Customer 2
   - **Chef Tigist** (`chef@mesobhouse.et` / `kitchen123`) — Staff Role
3. Click **Abebe Kebede** and hit **Sign In with Secure Session**.
4. Observe the redirection to `/orders`.

---

### Step 2: Verify Multi-Tenant Order Isolation
1. On `/orders`, observe the greeting:
   `Signed in as Abebe Kebede (customer) • Session ID: user_abebe_001`.
2. Notice that **only Abebe's orders** (`ord_001`, `ord_002`) are visible.
3. Chala's orders (`ord_003`, `ord_004`) are completely invisible.
4. Try adding `?userId=user_chala_002` to the URL bar and pressing enter.
5. **Expected Result:** The page still displays only Abebe's orders. The query is strictly parameterized server-side by `user.id` from the cryptographically verified session.

---

### Step 3: Test Attack #2 (Cross-Account IDOR) on `/orders`
1. Scroll down to the **Security Audit Lab: Attack #2** panel on `/orders`.
2. Notice the target order ID is pre-filled with `ord_003` (which belongs to Chala).
3. Click **Launch Attack: Attempt Unauthorized Cancel**.
4. **Expected Result:** The attack is instantly blocked with:
   `Forbidden: Ownership mismatch. Order "ord_003" belongs to "user_chala_002", not session "user_abebe_001".`
   Enforced at `app/actions.js:155`.

---

### Step 4: Test Edge Middleware Route Protection
1. Click **Sign Out** in the top navbar.
2. Now, while signed out, manually type `http://localhost:3000/orders` into the browser URL bar.
3. **Expected Result:**
   - Edge Middleware intercepts the request before SSR execution.
   - You are redirected to `/login?next=%2Forders`.
   - The login page displays the banner:
     `Protected destination: /orders (Middleware held this destination and will restore it safely upon authentication)`.
4. Sign in as Abebe again. You are immediately returned to `/orders`.

---

### Step 5: Test Attack #3 (Open Redirect Phishing)
1. Sign out and visit:
   `http://localhost:3000/login?next=https://evil-phishing.et/steal`
2. Sign in with any valid account.
3. **Expected Result:** You are NOT redirected to `evil-phishing.et`. `sanitizeNextUrl()` intercepts the scheme, discards the external URL, and safely redirects to `/orders`.

---

### Step 6: Test Attack #4 & RBAC (Customer vs Staff)
1. While logged in as customer Abebe, manually navigate to `http://localhost:3000/kitchen`.
2. **Expected Result:**
   - The server renders an **HTTP 403 Forbidden** refusal screen.
   - It explains: `You are authenticated as Abebe Kebede with role customer. The /kitchen route is strictly guarded by server-side role validation.`
   - Kitchen tickets and customer data are NEVER leaked down the wire.
3. Click **Switch to Staff Account** and sign in as **Chef Tigist**.
4. Notice that:
   - The top navbar now displays the golden **👨‍🍳 Kitchen** tab.
   - Visiting `/kitchen` renders the **Hearth Expediter & Kitchen** dashboard with full status controls (`Pending`, `Preparing`, `Ready`, `Completed`).

---

### Step 7: Comprehensive Security Laboratory (`/security-lab`)
1. In the top navbar, click **🛡️ Audit Lab** (or navigate to `/security-lab`).
2. Run each interactive penetration test:
   - **Attack 1:** Simulate direct unauthenticated server action call.
   - **Attack 2:** Test cross-account IDOR with custom target IDs.
   - **Attack 3:** Test URL sanitizer with external URLs, protocol-relative paths (`//attacker.com`), and javascript pseudo-schemes.
   - **Attack 4:** Test kitchen status escalation.
3. Inspect the cryptographic cookie breakdown explaining the HMAC-SHA256 signature format.

---

## Code Inspection Checklist

| Defense Line | File | Lines | Verification Check |
| :--- | :--- | :--- | :--- |
| **HMAC Sign & Verify** | `lib/session.js` | 57-119 | Uses `crypto.subtle.sign` and `crypto.subtle.verify` (HMAC-SHA256). |
| **HttpOnly Cookie** | `lib/session.js` | 165-172 | `httpOnly: true`, `sameSite: "lax"`, `secure` in production. |
| **Open Redirect Defense** | `lib/session.js` | 183-203 | `sanitizeNextUrl` validates single slash, rejects `://`, `//`, `\`. |
| **Edge Middleware** | `middleware.js` | 12-38 | Narrow matcher for `/checkout` and `/orders`. Preserves `next`. |
| **Attack 1 Defense** | `app/actions.js` | 143-146 | `const user = await getSession(); if (!user) throw Error(...)`. |
| **Attack 2 Defense** | `app/actions.js` | 155-159 | `if (order.userId !== user.id) throw Error(...)`. |
| **Attack 4 (RBAC) Defense** | `app/actions.js` | 185-187 | `if (user.role !== 'staff') throw Error(...)`. |
| **Server Component RBAC** | `app/kitchen/page.js`| 32-34 | Evaluates `user.role !== 'staff'` server-side before rendering tickets. |
