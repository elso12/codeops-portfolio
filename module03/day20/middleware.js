import { NextResponse } from "next/server";
import { getSessionFromCookie, SESSION_COOKIE_NAME } from "./lib/session";

/**
 * Addis Eats Edge Middleware
 *
 * Requirements:
 * 1. Narrow matcher covering ONLY /checkout and /orders.
 * 2. Does NOT intercept static assets, images, public routes, or APIs.
 * 3. Redirects signed-out visitors to /login, preserving their destination in ?next=
 */
export async function middleware(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await getSessionFromCookie(token) : null;

  if (!session) {
    const destination = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", destination);
    return NextResponse.redirect(loginUrl);
  }

  // Session is cryptographically valid — allow request to proceed to the page layer
  return NextResponse.next();
}

/**
 * Narrow matcher: ONLY /checkout and /orders routes are intercepted.
 * Images (/images/*), API routes, static assets, and public pages are never touched.
 */
export const config = {
  matcher: [
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
    "/kitchen",
    "/kitchen/:path*",
  ],
};
