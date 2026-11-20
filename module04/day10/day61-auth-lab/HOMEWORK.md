# Module 4 – Day 61: Authentication with JWT – Lab Report & Deliverables

**Project:** `day61-auth-lab`  
**Assignment:** Module 4 – Day 61 (JWT Authentication)  

---

## 1. Decoded Test Tokens & Claim Structure

Three real tokens captured during live application testing:

### Token 1: Access Token (15-Minute Lifetime)
- **Raw Token:**
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkM2QyZGFiOS02YTI3LTQ5YTEtYjZhMy03NDdjMDZhN2NiZmYiLCJlbWFpbCI6ImhvbWV3b3JrQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiY3VzdG9tZXIiXSwiaWF0IjoxNzk1MTc1NjY0LCJleHAiOjE3OTUxNzU2Njl9.89zHMRkJtXki86pdgdmuz9xyseGroN-Wd4Mx-rOxEyQ
  ```
- **Decoded Header:**
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```
- **Decoded Payload:**
  ```json
  {
    "sub": "d3d2dab9-6a27-49a1-b6a3-747c06a7cbff",
    "email": "homework@example.com",
    "roles": [
      "customer"
    ],
    "iat": 1795175664,
    "exp": 1795175669
  }
  ```

---

### Token 2: Initial Refresh Token (7-Day Lifetime)
- **Raw Token:**
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkM2QyZGFiOS02YTI3LTQ5YTEtYjZhMy03NDdjMDZhN2NiZmYiLCJqdGkiOiJmZDA5MjNjYy0zMjk0LTRkM2YtYjcxMi04NDA1YzA2ZDViYTciLCJpYXQiOjE3OTUxNzU2NjQsImV4cCI6MTc5NTc4MDQ2NH0.95nJy8IZrvLYLgZ8hHhggyWxL9Dng8bS2jbjvuPj_48
  ```
- **Decoded Header:**
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```
- **Decoded Payload:**
  ```json
  {
    "sub": "d3d2dab9-6a27-49a1-b6a3-747c06a7cbff",
    "jti": "fd0923cc-3294-4d3f-b712-8405c06d5ba7",
    "iat": 1795175664,
    "exp": 1795780464
  }
  ```

---

### Token 3: Rotated Refresh Token (from `POST /api/auth/refresh`)
- **Raw Token:**
  ```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkM2QyZGFiOS02YTI3LTQ5YTEtYjZhMy03NDdjMDZhN2NiZmYiLCJqdGkiOiI2NmU3OWUxOC04OWQ3LTQyNmItYjVhYS1iMjczZmY2NjJmM2YiLCJpYXQiOjE3OTUxNzU2NjQsImV4cCI6MTc5NTc4MDQ2NH0.un_jv5G5bTpcSqr2aV6EtgLzttpgTdOFcAR0XWk3C04
  ```
- **Decoded Header:**
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```
- **Decoded Payload:**
  ```json
  {
    "sub": "d3d2dab9-6a27-49a1-b6a3-747c06a7cbff",
    "jti": "66e79e18-89d7-426b-b5aa-b273ff662f3f",
    "iat": 1795175664,
    "exp": 1795780464
  }
  ```

---

### Claim Analysis

| Claim | Type | Description | Notes |
| :--- | :--- | :--- | :--- |
| **`alg`** | Header | Cryptographic signing algorithm (`HS256`). | Explicitly enforced by server strategy to prevent algorithm confusion attacks. |
| **`sub`** | Standard | Subject identifier (User UUID). | Primary identifier linking the token to the database user record. |
| **`email`** | Custom | User email address. | Placed in access tokens for UI display; omitted from refresh tokens. |
| **`roles`** | Custom | Role array (`['customer']`). | Used for role-based authorization without needing database lookups per request. |
| **`iat`** | Standard | "Issued At" UNIX timestamp. | Timestamp of when the token was signed. |
| **`exp`** | Standard | "Expiration" UNIX timestamp. | Unix timestamp after which Passport rejects the token. |
| **`jti`** | Standard | Unique JWT identifier (UUID v4). | Used in refresh tokens so rapid rotations in the same second still yield distinct tokens. |

### Sensitive Data to Exclude from JWT Payloads
- **Passwords and password hashes:** Tokens are base64url-encoded and readable by anyone who inspects them.
- **Refresh hashes and secret keys:** Leaking hashes or secrets compromises authentication containment.
- **Personally Identifiable Information (PII):** SSNs, phone numbers, payment details, or home addresses should never be put in tokens.
- **Fast-changing or large state:** Session state and carts belong in server databases or caches, not inside immutable JWTs.

---

## 2. Token Expiry Experiment & Client Lifecycle

### Test Run Output

Running the application with a short access token expiration:

```text
T=0s (Before Expiry) GET /api/auth/me -> 200 OK
Body: {"id":"d3d2dab9-6a27-49a1-b6a3-747c06a7cbff","email":"homework@example.com","roles":["customer"]}

Waiting for token to expire...
T=6s (After Expiry)  GET /api/auth/me -> 401 Unauthorized
Body: {"message":"Unauthorized","statusCode":401}
```

### Managing Short-Lived Access Tokens in Client Applications

In frontend applications (React, Vue, mobile apps), handling expired access tokens smoothly requires:

1. **HTTP 401 Interceptor:** When an API request fails with `401 Unauthorized`, intercept the response instead of surfacing the error to the user immediately.
2. **Refresh Mutex (Single-Flight Lock):** If multiple requests fail with 401 simultaneously, ensure only one request calls `POST /api/auth/refresh`. Other requests wait for that promise to resolve so the old refresh token isn't reused concurrently.
3. **Storage:** Keep the `accessToken` in memory (or secure mobile storage) and the `refreshToken` in an `httpOnly`, `secure`, `SameSite=Strict` cookie.
4. **Retry Once:** After the refresh call succeeds, update the stored tokens and replay the original request with the new access token.
5. **Session Teardown:** If `POST /api/auth/refresh` itself returns 401 (token expired or revoked), clear client state and navigate to the login page.

---

## 3. Logout Timing & The Stateless Trade-off

### Test Measurement

```text
POST /api/auth/logout completed in: 2ms (Status: 200 OK)

Immediate POST /api/auth/refresh -> 401 Unauthorized
Body: {"message":"Invalid refresh token","error":"Unauthorized","statusCode":401}

Immediate GET /api/auth/me with old access token -> 200 OK
Body: {"id":"d3d2dab9-6a27-49a1-b6a3-747c06a7cbff","email":"homework@example.com","roles":["customer"]}
```

### Analysis of the Trade-off

- **Refresh token invalidation is instant:** Because refresh token validation checks `user.refreshHash` on the server, setting `refreshHash: null` during logout immediately cuts off the user's ability to get new access tokens.
- **Access tokens are stateless:** Access tokens are verified purely by checking the cryptographic signature and the `exp` timestamp in `JwtStrategy`. Because no database lookup occurs during access token validation, an issued access token remains valid until its `exp` time arrives.

### Approaches for Immediate Access Token Invalidation

1. **Short access token TTL (recommended):** Keeping the access token lifetime short (e.g. 5–15 minutes) ensures the window of post-logout validity is small without adding database overhead.
2. **Redis Token Denylist:** Store revoked token IDs (`jti`) in Redis with a TTL matching the token's remaining lifespan. The auth guard checks Redis on each request.
3. **Token Version / Epoch:** Maintain a `tokenVersion` number on the user entity and embed it in the access token. On logout or password reset, increment `tokenVersion` so older tokens are rejected.

---

## 4. Extra Credit: Argon2 Hashes of `"Password123!"`

Hashing `"Password123!"` five consecutive times produced:

```text
Hash 1: $argon2id$v=19$m=65536,t=3,p=4$rSTSGRxbMONiNoOuv15ohg$imrruGJPBZXk3yBl7lGEbHBArneVbT9eB1dtlowcy+U
Hash 2: $argon2id$v=19$m=65536,t=3,p=4$C+UkAE7fUPwy+HxjdBm5hg$d2yrOgxwJKrklBJNjIiKJccVnpZ7KUmil2XGh0IGsAs
Hash 3: $argon2id$v=19$m=65536,t=3,p=4$BXzlzELPIeyq8LSV5AvaHg$e/zHXNmpdDxczV3p1Y00E3bTKSpUWfKXqiJRmJMP4oQ
Hash 4: $argon2id$v=19$m=65536,t=3,p=4$le/t85hv7EHt5+6jyLCJOA$q6ynj+s58DcNZihMFwO8ghH9aoLoiUa5WrGvYdp1O5Y
Hash 5: $argon2id$v=19$m=65536,t=3,p=4$pCRxnEWPHYgvD8DMQ/V5ow$RCLeVV6VSrTQKTm+psuSCXvXhopBwjCfzFCTeWY1Bao
```
*All 5 hashes verified `true` when tested with `argon2.verify()` against `"Password123!"`.*

### Why the Hashes Differ

Each hash is completely different because Argon2 automatically generates a unique 16-byte cryptographically random salt for every hashing operation. This guarantees that two identical passwords never share the same hash and defeats precomputed rainbow table attacks.

### PHC String Breakdown (Using Hash 1)

`$argon2id$v=19$m=65536,t=3,p=4$rSTSGRxbMONiNoOuv15ohg$imrruGJPBZXk3yBl7lGEbHBArneVbT9eB1dtlowcy+U`

- **`$argon2id`**: The hybrid Argon2 variant combining data-dependent and data-independent memory access.
- **`$v=19`**: Argon2 version 1.3 (`0x13`).
- **`$m=65536`**: Memory cost of 64 MB (65,536 KB), raising the hardware cost for brute-force attacks.
- **`$t=3`**: Time cost (3 iterations over memory).
- **`$p=4`**: Parallelism factor (4 threads computed in parallel).
- **`$rSTSGRxbMONiNoOuv15ohg`**: The Base64-encoded random salt.
- **`$imrruGJPBZXk3yBl...`**: The derived 32-byte hash output.

---

## 5. Review Questions & Answers

1. **Why does login return the exact same error for unknown email and wrong password?**  
   To prevent user enumeration. If the server returned "User not found" versus "Wrong password", an attacker could test email lists to discover which accounts exist on the platform.
2. **Why store the refresh token as an Argon2 hash instead of plaintext?**  
   If the database is leaked or accessed through an injection vulnerability, attackers cannot use the stored records to forge refresh requests or impersonate users.
3. **Why rotate the refresh token on every refresh request?**  
   Rotation enables replay detection. If a stolen refresh token is used, either the attacker or the legitimate user will attempt to reuse the previous token. The second request fails and exposes the compromise.
4. **Why is a global default-deny guard with `@Public()` opt-out safer than per-route guards?**  
   It defaults to safe behavior. If a developer creates a new route and forgets to add a guard, the route remains protected by default rather than accidentally public.

---

## 6. Acceptance Checklist Summary

- [x] Register returns 201 with `{ id, email, roles }` and no password/hash fields
- [x] Duplicate register returns 409 (`Email already registered`)
- [x] Invalid email returns 400
- [x] Short password (< 8 chars) returns 400
- [x] Extra `roles: ["admin"]` field returns 400
- [x] Login returns 200 with `accessToken` & `refreshToken`
- [x] Wrong password returns 401 (`Invalid credentials`)
- [x] Unknown email returns 401 (`Invalid credentials`)
- [x] Protected routes return 401 without token
- [x] `/api/auth/me` returns 200 with valid Bearer token and 401 with tampered token
- [x] Refresh returns 200 with rotated pair
- [x] Replaying old refresh token returns 401, new refresh token rotates again
- [x] Logout returns 200, blocks refresh (401), access token works until exp
- [x] Swagger docs load at `/api/docs` and OpenAPI JSON at `/api/docs-json` with bearer auth
