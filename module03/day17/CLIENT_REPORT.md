# Addis Eats — Security Audit & Client Penetration Test Report

**Target Application:** Addis Eats · Mesob House Restaurant Web Application  
**Module / Project:** Module 03 · Day 42 (Day 17)  
**Security Evaluation Standard:** OWASP Top 10 (A01: Broken Access Control, A07: Identification and Authentication Failures)  
**Audit Status:** <span style="color: #10b981; font-weight: bold;">PASSED — ALL 3 CORE ATTACKS DEFEATED</span>  

---

## 1. Executive Summary

This security assessment audited the authentication and authorization mechanics of the Addis Eats / Mesob House web application. Modern web applications utilizing React Server Components and Next.js Server Actions expose public RPC entry points that bypass traditional client-side form controls.

Our testing evaluated the application's resistance against:
1. **Direct RPC execution without authenticated cookies (Broken Authentication)**
2. **Horizontal privilege escalation between accounts (IDOR)**
3. **Phishing and credential harvesting via redirect manipulation (Open Redirect)**
4. **Vertical privilege escalation into staff administrative functions (RBAC)**

All penetration vectors were successfully neutralized by multi-layered, line-level defenses enforced on the server.

---

## 2. Penetration Test Log & Findings

### Test Case 1: Direct Unauthenticated Server Action Invocation
- **Objective:** Attempt to execute state-changing action `cancelOrder("ord_001")` without providing a session cookie.
- **Attack Payload:**
  ```bash
  curl -X POST http://localhost:3000/ \
    -H "Next-Action: [ACTION_ID_CANCEL_ORDER]" \
    -H "Content-Type: text/plain;charset=UTF-8" \
    --data '["ord_001"]'
  ```
- **Observed Server Response:**
  ```json
  { "error": "Unauthorized: Authentication required. Session is missing or invalid." }
  ```
- **Defense Verification:** Defeated at `app/actions.js:143-146`. The action calls `getSession()` before any database query or write occurs.
- **Status:** **PASS**

---

### Test Case 2: Cross-Account Insecure Direct Object Reference (IDOR)
- **Objective:** Sign in as Customer Abebe (`user_abebe_001`) and invoke `cancelOrder("ord_003")` where `ord_003` belongs to Customer Chala (`user_chala_002`).
- **Attack Simulation:** Executed through both the interactive `/security-lab` audit runner and direct programmatic invocation.
- **Observed Server Response:**
  ```
  Forbidden: Ownership mismatch. Order "ord_003" belongs to "user_chala_002", not session "user_abebe_001".
  ```
- **Defense Verification:** Defeated at `app/actions.js:155-159`. The order's owner (`order.userId`) is compared against the cryptographically verified session (`user.id`).
- **Status:** **PASS**

---

### Test Case 3: Open Redirect Phishing Attack
- **Objective:** Supply malicious external URLs into the `next` query parameter during sign-in to divert authentic users to a credential-harvesting replica.
- **Test Payloads Tested:**
  1. `https://evil-phishing.et/steal-credentials`
  2. `//attacker.com/fake-login`
  3. `javascript:alert(document.cookie)`
  4. `/\evil.com`
- **Observed Behavior:**
  All four malicious inputs were stripped by `sanitizeNextUrl()` in `lib/session.js:183-203`. The server reverted the redirect destination safely to the internal default `/orders`.
- **Status:** **PASS**

---

### Test Case 4: Kitchen Operations Privilege Escalation
- **Objective:** Authenticate as customer `user_abebe_001` and attempt direct HTTP navigation to `/kitchen` as well as calling `updateKitchenStatus("ord_001", "ready")`.
- **Observed Behavior:**
  1. Navigation to `/kitchen` returns an HTTP 403 Forbidden server component screen. Kitchen data is never sent down the wire.
  2. Server Action `updateKitchenStatus` throws `"Forbidden: Staff privileges required"`.
- **Status:** **PASS**

---

## 3. Cryptographic Token & Cookie Review

| Metric | Configured Value | Security Implication |
| :--- | :--- | :--- |
| **Algorithm** | `HMAC-SHA256` | Tamper-proof signatures using Web Crypto API. |
| **HttpOnly Flag** | `true` | Prevents document.cookie access by malicious client scripts (XSS protection). |
| **Secure Flag** | `true` in production | Restricts transmission strictly to encrypted HTTPS channels. |
| **SameSite Flag** | `"lax"` | Mitigates CSRF across cross-site navigations. |
| **Key Secrecy** | `SESSION_SECRET` (server env) | No `NEXT_PUBLIC_` prefix; secret is never exposed to browser bundles. |

---

## 4. Conclusion & Certification

The security implementation in Addis Eats meets professional standards for multi-tenant isolation, cryptographic integrity, and defense-in-depth. No critical, high, or medium severity vulnerabilities were identified during this audit.
