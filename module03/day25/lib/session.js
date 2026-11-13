// Note: next/headers is imported dynamically inside getSession() to avoid
// pulling server-only Node.js APIs into Edge runtime middleware.

export const SESSION_COOKIE_NAME = "mesob_session";
export const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

// Private signing secret — kept strictly server-side, never exposed with NEXT_PUBLIC_
const SESSION_SECRET =
  process.env.SESSION_SECRET || "addis_eats_super_secret_signing_key_at_least_32_bytes_2026";

/**
 * Base64URL encoding compatible across Node.js and Edge runtime
 */
function base64UrlEncode(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Base64URL decoding compatible across Node.js and Edge runtime
 */
function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Derives a CryptoKey for HMAC-SHA256
 */
async function getCryptoKey() {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs payload into a cryptographic session token: <base64urlPayload>.<base64urlSignature>
 * @param {{ id: string; name: string; email: string; role: 'customer' | 'staff'; [key: string]: any }} payload
 * @returns {Promise<string>}
 */
export async function createSessionToken(payload) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const fullPayload = { ...payload, exp };
  const payloadJson = JSON.stringify(fullPayload);
  const payloadBytes = new TextEncoder().encode(payloadJson);
  const payloadB64 = base64UrlEncode(payloadBytes);

  const key = await getCryptoKey();
  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payloadB64)
  );
  const signatureB64 = base64UrlEncode(signatureBytes);

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies a cryptographic session token and returns the payload if valid & not expired.
 * @param {string} token
 * @returns {Promise<{ id: string; name: string; email: string; role: string } | null>}
 */
export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return null;
  }

  const [payloadB64, signatureB64] = token.split(".");
  if (!payloadB64 || !signatureB64) {
    return null;
  }

  try {
    const key = await getCryptoKey();
    const signatureBytes = base64UrlDecode(signatureB64);
    const dataBytes = new TextEncoder().encode(payloadB64);

    const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, dataBytes);
    if (!isValid) {
      return null;
    }

    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson);

    // Expiration check
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role || "customer",
    };
  } catch (err) {
    console.error("[verifySessionToken error]", err);
    return null;
  }
}

/**
 * Universal getSession helper.
 * Reads and cryptographically verifies the session cookie.
 * Can be called without arguments from Pages, Server Actions, Route Handlers,
 * or passed a NextRequest / cookies object from Middleware.
 *
 * @param {any} [reqOrCookies] Optional request or cookie store
 * @returns {Promise<{ id: string; name: string; email: string; role: string } | null>}
 */
export async function getSession(reqOrCookies = null) {
  let token = null;

  if (typeof reqOrCookies === "string") {
    token = reqOrCookies;
  } else if (
    reqOrCookies &&
    reqOrCookies.cookies &&
    typeof reqOrCookies.cookies.get === "function"
  ) {
    token = reqOrCookies.cookies.get(SESSION_COOKIE_NAME)?.value;
  } else {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    } catch {
      // In contexts without cookies() (e.g. static phase) or Edge runtime
      return null;
    }
  }

  if (!token) return null;
  return await verifySessionToken(token);
}

/**
 * Standalone cookie verifier for middleware or raw string
 */
export async function getSessionFromCookie(cookieValue) {
  return await verifySessionToken(cookieValue);
}

/**
 * Standard cookie configuration for sign-in
 */
export const SESSION_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: SESSION_MAX_AGE,
  path: "/",
};

/**
 * Validates the `next` redirect parameter to prevent Open Redirect attacks.
 * Rejects absolute URLs (e.g. https://evil.com), protocol-relative URLs (//evil.com),
 * backslashes, and schema tricks. Falls back to a safe default.
 *
 * @param {string | null | undefined} next
 * @param {string} [fallback="/orders"]
 * @returns {string}
 */
export function sanitizeNextUrl(next, fallback = "/orders") {
  if (!next || typeof next !== "string") {
    return fallback;
  }

  const trimmed = next.trim();

  // Must begin with a single slash, not double slash //, not contain protocol scheme or backslash
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
