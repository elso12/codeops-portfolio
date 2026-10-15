# AGENTS.md — Day 17 (Module 3 · Day 42) Guidelines

This document provides architectural rules, critical invariants, and development guidelines for AI agents working in this repository.

---

## Security Invariants (NEVER VIOLATE)

1. **Authentication in Server Actions:**
   - Every state-changing server action in `app/actions.js` is a public HTTP POST endpoint.
   - You MUST call `const user = await getSession();` at the very beginning of the action.
   - If `!user`, throw an error or return `{ ok: false, error: "Unauthorized" }`. Never execute mutations or database calls for unauthenticated callers.

2. **Authorization & Record Ownership (Anti-IDOR):**
   - NEVER accept a `userId` from client form data or RPC arguments to determine record ownership.
   - Always load the record by ID, then verify `record.userId === user.id`.
   - If mismatch, throw a 403 Forbidden error immediately.

3. **Role-Based Access Control (RBAC):**
   - Hiding links in the navigation bar is for UX only, NOT security.
   - Always verify `user.role === 'staff'` in the Server Component (`app/kitchen/page.js`) and in any staff server action (`updateKitchenStatus`).

4. **Open Redirect Prevention:**
   - Any redirection based on user input (such as `nextDestination`) MUST be sanitized through `sanitizeNextUrl(next)`.
   - Never use unsanitized `redirect(searchParams.next)`.

5. **Session Secrets & Environment Variables:**
   - Never prefix `SESSION_SECRET` with `NEXT_PUBLIC_`.
   - Secrets must remain strictly server-side.

6. **Edge Runtime Compatibility:**
   - `lib/session.js` utilizes native `crypto.subtle` (Web Crypto API) so it runs cleanly in both Edge Middleware and Node.js.
   - Do NOT import `next/headers` at the top level of `lib/session.js`. It must be imported dynamically inside `getSession()` to avoid bundling server-only Node.js APIs into Edge middleware.

---

## Key Files & Responsibilities

- `middleware.js`: Edge middleware guarding `/checkout` and `/orders`. Narrow matcher only.
- `lib/session.js`: Cryptographic token creation, HMAC-SHA256 signature, verification, and `sanitizeNextUrl`.
- `lib/data.js`: In-memory data store with foreign key relationships (`order.userId -> user.id`).
- `app/actions.js`: Server actions with line-level defense against Attacks 1, 2, 3, and 4.
- `app/orders/page.js`: Multi-tenant user orders view, strictly scoped to `getOrdersByUser(user.id)`.
- `app/kitchen/page.js`: Staff-only operations board, gated server-side with HTTP 403 response for non-staff.
- `app/security-lab/page.js`: Interactive penetration test environment demonstrating the 3 core attacks and RBAC.

---

## Test Accounts

- `abebe@mesobhouse.et` / `customer123` (`user_abebe_001`, customer role)
- `chala@mesobhouse.et` / `customer123` (`user_chala_002`, customer role)
- `chef@mesobhouse.et` / `kitchen123` (`staff_tigist_001`, staff role)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
