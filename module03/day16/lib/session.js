/**
 * lib/session.js
 * Minimal session helper — replaces a real auth library (NextAuth, Clerk, etc.).
 * In dev we always return a fixed demo user so we can exercise the
 * ownership checks in cancelOrder without a full auth setup.
 *
 * IMPORTANT: The demo user id is looked up server-side only.
 * No secret ever reaches client code.
 */

/** @returns {{ id: string; name: string } | null} */
export async function getSession() {
  // In a real app: read the session cookie, verify a JWT, call an auth provider.
  // For this exercise we return a hardcoded user so the action checks can run.
  return { id: "user_demo_001", name: "Abebe Kebede" };
}
