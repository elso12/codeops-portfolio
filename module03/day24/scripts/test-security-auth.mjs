/**
 * scripts/test-security-auth.mjs
 *
 * Automated verification suite for Capstone Authentication, Authorization,
 * PBKDF2 Password Hashing, and Anti-IDOR Security Defense.
 */
import assert from "node:assert";
import {
  authenticateUser,
  findUserById,
  registerUser,
  hashPassword,
  verifyPassword,
  getOrderById,
  getOrdersByUser,
  users,
} from "../lib/data.js";
import {
  createSessionToken,
  getSessionFromCookie,
  sanitizeNextUrl,
} from "../lib/session.js";

console.log("==================================================================");
console.log("🔒 CAPSTONE AUTHENTICATION, AUTHORIZATION & IDOR TEST SUITE");
console.log("==================================================================\n");

// 1. Test PBKDF2 Password Hashing & Verification
console.log("1. Testing Cryptographic PBKDF2 Password Hashing & Verification...");
const rawPassword = "mySecurePassword_2026!";
const derivedHash = await hashPassword(rawPassword);
assert(derivedHash.startsWith("$pbkdf2-sha256$"), "FAIL: Hash must follow modular crypt format $pbkdf2-sha256$...");
const parts = derivedHash.split("$").filter(Boolean);
assert.strictEqual(parts.length, 4, "FAIL: Modular hash must have 4 segments: algorithm, iterations, salt, hash");
const [algo, iterStr, saltHex, hashHex] = parts;
assert.strictEqual(algo, "pbkdf2-sha256", "FAIL: Algorithm must be pbkdf2-sha256");
assert.strictEqual(iterStr, "i=210000", "FAIL: Default iterations must be i=210000");
assert.strictEqual(saltHex.length, 32, "FAIL: Salt must be 16 bytes (32 hex characters)");
assert.strictEqual(hashHex.length, 64, "FAIL: SHA-256 derived bits must be 32 bytes (64 hex characters)");

const isPasswordCorrect = await verifyPassword(rawPassword, derivedHash);
assert.strictEqual(isPasswordCorrect, true, "FAIL: Valid password must verify against stored PBKDF2 hash");

const isWrongPasswordRejected = await verifyPassword("wrongPassword!", derivedHash);
assert.strictEqual(isWrongPasswordRejected, false, "FAIL: Wrong password must fail verification");

// Test backward compatibility with legacy format (<saltHex>:<hashHex>)
const legacyHash = "a1b2c3d4e5f60718293a4b5c6d7e8f90:1e5e9d6abdb7f979ca9cd0ae53db500b54df8dd2c7fe6973c82aca49fe276fd2";
const legacyVerified = await verifyPassword("customer123", legacyHash);
assert.strictEqual(legacyVerified, true, "FAIL: Legacy <salt>:<hash> format must remain backward-compatible");

// Test malformed hashes handled gracefully without throwing
assert.strictEqual(await verifyPassword("password", null), false, "FAIL: Null hash must return false");
assert.strictEqual(await verifyPassword("password", "corrupted$hash"), false, "FAIL: Corrupted hash must return false");
assert.strictEqual(await verifyPassword("password", "$pbkdf2-sha256$invalid"), false, "FAIL: Malformed modular hash must return false");

// Verify seed users have zero plaintext passwords
for (const u of users) {
  assert.strictEqual(u.password, undefined, `FAIL: User ${u.id} has plaintext password stored!`);
  assert(typeof u.passwordHash === "string" && u.passwordHash.startsWith("$pbkdf2-sha256$"), `FAIL: User ${u.id} missing valid modular PBKDF2 hash`);
}
console.log("   ✓ Modular PBKDF2-SHA256 format verified ($pbkdf2-sha256$i=210000$salt$hash)");
console.log("   ✓ Candidate password verified against cryptographic hash");
console.log("   ✓ Legacy hash format supported backward-compatibly");
console.log("   ✓ Malformed hashes safely rejected without unhandled exceptions");
console.log("   ✓ Zero plaintext passwords exist in seed database\n");

// 2. Test Credentials Authentication
console.log("2. Testing Credentials Authentication (authenticateUser)...");
const validUser = await authenticateUser("abebe@mesobhouse.et", "customer123");
assert(validUser !== null, "FAIL: Valid credentials must authenticate");
assert.strictEqual(validUser.id, "user_abebe_001", "FAIL: Must return correct user ID");
assert.strictEqual(validUser.password, undefined, "FAIL: Plaintext password must never appear in user object");
assert.strictEqual(validUser.passwordHash, undefined, "FAIL: Password hash must be stripped from user object");

const badPass = await authenticateUser("abebe@mesobhouse.et", "wrongpass");
assert.strictEqual(badPass, null, "FAIL: Bad password must return null");

const badEmail = await authenticateUser("nonexistent@mesobhouse.et", "customer123");
assert.strictEqual(badEmail, null, "FAIL: Nonexistent email must return null");
console.log("   ✓ Valid credentials authenticate against PBKDF2 hash");
console.log("   ✓ Sensitive passwordHash stripped from session object");
console.log("   ✓ Bad password rejected cleanly");
console.log("   ✓ Nonexistent email rejected cleanly\n");

// 3. Test Cryptographic HMAC-SHA256 Token Lifecycle
console.log("3. Testing Web Crypto HMAC-SHA256 Session Token Signing & Verification...");
const testPayload = { id: "user_test_999", email: "test@mesobhouse.et", role: "customer", name: "Test User" };
const token = await createSessionToken(testPayload);
assert(typeof token === "string" && token.includes("."), "FAIL: Token must be base64url payload with signature separated by dot");

const verifiedUser = await getSessionFromCookie(token);
assert(verifiedUser !== null, "FAIL: Valid token must verify");
assert.strictEqual(verifiedUser.id, "user_test_999", "FAIL: Verified user id mismatch");
assert.strictEqual(verifiedUser.role, "customer", "FAIL: Verified user role mismatch");

// Tampered token test (signature corruption)
const tamperedToken = token.slice(0, -6) + "XXXXXX";
const tamperedResult = await getSessionFromCookie(tamperedToken);
assert.strictEqual(tamperedResult, null, "FAIL: Tampered token signature must fail verification");
console.log("   ✓ Cryptographic HMAC token generated and verified");
console.log("   ✓ Tampered token signature rejected\n");

// 4. Test Attack 3: Open Redirect Sanitization
console.log("4. Testing Attack 3: Malicious Return URL Sanitization (sanitizeNextUrl)...");
assert.strictEqual(sanitizeNextUrl("https://evil-phishing.com"), "/orders", "FAIL: Absolute external URL must be rejected");
assert.strictEqual(sanitizeNextUrl("//evil-phishing.com"), "/orders", "FAIL: Protocol-relative // URL must be rejected");
assert.strictEqual(sanitizeNextUrl("javascript:alert(1)"), "/orders", "FAIL: javascript: URI must be rejected");
assert.strictEqual(sanitizeNextUrl("/checkout"), "/checkout", "FAIL: Valid safe relative path must be allowed");
assert.strictEqual(sanitizeNextUrl("/orders?page=2"), "/orders?page=2", "FAIL: Valid relative path with query must be allowed");
console.log("   ✓ External phishing domains sanitized to safe fallback");
console.log("   ✓ Protocol-relative bypasses neutralized");
console.log("   ✓ Safe internal application routes permitted\n");

// 5. Test Attack 2: Cross-Account Data Scoping & Anti-IDOR (Scoped Queries)
console.log("5. Testing Attack 2: Cross-Account Data Scoping & Anti-IDOR (Scoped Queries)...");
const abebeOrders = getOrdersByUser("user_abebe_001");
assert(abebeOrders.length > 0, "FAIL: Abebe should have orders");
for (const o of abebeOrders) {
  assert.strictEqual(o.userId, "user_abebe_001", `FAIL: Order ${o.id} belongs to ${o.userId}, not Abebe`);
}

// Chala's order
const chalaOrder = getOrderById("ord_003");
assert(chalaOrder !== null, "FAIL: Order ord_003 must exist");
assert.strictEqual(chalaOrder.userId, "user_chala_002", "FAIL: ord_003 belongs to Chala");

// Verify that Abebe cannot see Chala's order in their scoped list
const abebeOrderIds = abebeOrders.map((o) => o.id);
assert(!abebeOrderIds.includes("ord_003"), "FAIL: Abebe's scoped orders must NEVER include Chala's order ord_003");
console.log("   ✓ getOrdersByUser strictly scopes records to session user ID");
console.log("   ✓ Cross-account order ord_003 is completely hidden from Abebe\n");

// 6. Test Brand-New Account Registration & Natural Empty State
console.log("6. Testing Brand-New User Registration (registerUser)...");
const uniqueEmail = `intern_${Date.now()}@mesobhouse.et`;
const registered = await registerUser({
  name: "New Student Tester",
  email: uniqueEmail,
  phone: "0911998877",
  password: "securePassword123",
});

assert(registered.id.startsWith("user_"), "FAIL: New user must receive prefixed ID");
assert.strictEqual(registered.email, uniqueEmail, "FAIL: Email mismatch");
assert.strictEqual(registered.role, "customer", "FAIL: New user role must be customer");
assert.strictEqual(registered.password, undefined, "FAIL: Plaintext password must not be returned");
assert.strictEqual(registered.passwordHash, undefined, "FAIL: Password hash must not be returned");

// Verify that the stored record in users has passwordHash and NOT plaintext password
const storedUser = users.find((u) => u.id === registered.id);
assert.strictEqual(storedUser.password, undefined, "FAIL: Stored record must not contain plaintext password");
assert(storedUser.passwordHash.startsWith("$pbkdf2-sha256$"), "FAIL: Stored record must contain modular PBKDF2 hash");

// Verify empty state: newly registered user has 0 orders
const newAccountOrders = getOrdersByUser(registered.id);
assert.strictEqual(newAccountOrders.length, 0, "FAIL: Brand-new user must have exactly 0 orders (Empty State)");

// Duplicate registration test
await assert.rejects(
  async () => {
    await registerUser({
      name: "Duplicate",
      email: uniqueEmail,
      password: "securePassword123",
    });
  },
  /already exists/,
  "FAIL: Duplicate email registration must reject"
);
console.log("   ✓ Brand-new user registered in store with PBKDF2 hashed password");
console.log("   ✓ Brand-new user has exactly 0 orders, validating natural empty state");
console.log("   ✓ Duplicate email registration rejected\n");

console.log("==================================================================");
console.log("🎉 ALL CAPSTONE SECURITY & AUTHENTICATION TESTS PASSED!");
console.log("==================================================================");
