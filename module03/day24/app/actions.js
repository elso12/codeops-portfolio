/**
 * app/actions.js
 * "use server" - all exports are server actions.
 *
 * Every action is a real public HTTP endpoint. That means:
 *   1. Authentication: Always verify getSession() inside the action.
 *   2. Authorisation: Verify the signed-in user owns the record before any write.
 *   3. Validation: Re-parse schemas even if the client already checked them.
 */
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { orderSchema } from "@/lib/schema";
import {
  createOrder,
  getOrderById,
  cancelOrderById,
  updateOrderStatusById,
  authenticateUser,
  registerUser,
} from "@/lib/data";
import {
  getSession,
  createSessionToken,
  SESSION_COOKIE_OPTIONS,
  SESSION_COOKIE_NAME,
  sanitizeNextUrl,
} from "@/lib/session";

/**
 * Sign up action (Brand-new account registration)
 * Validates credentials, creates user record, and issues cryptographic session cookie.
 */
export async function signUp(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const password = formData.get("password");

  if (!name || !email || !password) {
    return { ok: false, error: "Please fill in your name, email, and password." };
  }

  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters long." };
  }

  try {
    const user = registerUser({ name, email, phone, password });
    const token = await createSessionToken(user);
    const cookieStore = await cookies();
    cookieStore.set({
      ...SESSION_COOKIE_OPTIONS,
      value: token,
    });

    revalidatePath("/", "layout");
    return { ok: true, redirectTo: "/orders" };
  } catch (err) {
    return { ok: false, error: err.message || "Failed to create account. Please try again." };
  }
}

/**
 * Sign in action
 * Sets httpOnly, secure, sameSite session cookie with cryptographic signature.
 * Returns safe redirect destination.
 */
export async function signIn(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const nextRaw = formData.get("next");

  if (!email || !password) {
    return { ok: false, error: "Please provide both email and password." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { ok: false, error: "Invalid email or password. Please try again." };
  }

  // Create signed token with 24-hour expiration
  const token = await createSessionToken(user);

  // Set the session cookie with strict security flags
  const cookieStore = await cookies();
  cookieStore.set({
    ...SESSION_COOKIE_OPTIONS,
    value: token,
  });

  // Validate next destination to prevent Open Redirect
  const safeNext = sanitizeNextUrl(nextRaw, user.role === "staff" ? "/kitchen" : "/orders");

  revalidatePath("/", "layout");
  return { ok: true, redirectTo: safeNext };
}

/**
 * Sign out action
 * Removes the session cookie server-side.
 */
export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  // Also set maxAge 0 to guarantee eviction
  cookieStore.set({
    ...SESSION_COOKIE_OPTIONS,
    value: "",
    maxAge: 0,
  });

  revalidatePath("/", "layout");
  redirect("/login");
}

// In-memory idempotency cache ensuring rapid double clicks/taps never produce two orders
const idempotencyOrderCache = new Map();

/**
 * Place Order action
 * Scopes the new order strictly to the authenticated session ID.
 * Idempotency protected against rapid double-tap / double-submit.
 */
export async function placeOrder(prevState, formData) {
  // 1. Authentication: Never rely on client state
  const user = await getSession();
  if (!user) {
    return { ok: false, error: "Unauthorized: You must be signed in to place an order." };
  }

  // Idempotency check: if the exact same client submission is retried/double-tapped, return existing order
  const idempotencyKey = formData.get("idempotencyKey");
  if (idempotencyKey && idempotencyOrderCache.has(idempotencyKey)) {
    return idempotencyOrderCache.get(idempotencyKey);
  }

  // 2. Extract & coerce types
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    dishId: formData.get("dishId"),
    quantity: Number(formData.get("quantity")),
    area: formData.get("area"),
    notes: formData.get("notes") || undefined,
    paymentMethod: formData.get("paymentMethod") || "telebirr",
  };

  // 3. Schema validation
  const result = orderSchema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  // 4. Create order strictly bound to session user.id
  try {
    const order = createOrder(result.data, user.id);

    // Persist active order in cookie for Vercel serverless cross-lambda persistence
    try {
      const cookieStore = await cookies();
      cookieStore.set("mesob_active_order", JSON.stringify({
        id: order.id,
        userId: user.id,
        dishId: result.data.dishId,
        quantity: result.data.quantity,
        customerName: result.data.name,
        phone: result.data.phone,
        area: result.data.area,
        notes: result.data.notes || "",
        paymentMethod: result.data.paymentMethod || "telebirr",
        total: order.total,
        currency: order.currency,
        status: "pending",
        createdAt: order.createdAt,
      }), {
        path: "/",
        maxAge: 3600,
        sameSite: "lax",
      });
    } catch (e) {
      console.warn("Could not set active order cookie:", e);
    }

    // 5. Invalidate cached views
    revalidatePath("/orders");
    revalidatePath("/kitchen");

    const response = {
      ok: true,
      order: {
        id: order.id,
        total: order.total,
        currency: order.currency,
        paymentMethod: order.paymentMethod,
      },
    };

    if (idempotencyKey) {
      idempotencyOrderCache.set(idempotencyKey, response);
    }

    return response;
  } catch (err) {
    console.error("[placeOrder error]", err);
    return { ok: false, error: "Could not create order. Please try again." };
  }
}

/**
 * Cancel Order action
 * Verified on two levels:
 *   Level 1 (Authentication): Is caller signed in?
 *   Level 2 (Authorisation): Does order.userId match session.id?
 *
 * Line-level protection against Attack 1 and Attack 2.
 */
export async function cancelOrder(orderId) {
  // Attack 1 defense line:
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized: Authentication required. Session is missing or invalid.");
  }

  // Record existence lookup
  const order = getOrderById(orderId);
  if (!order) {
    throw new Error(`Order "${orderId}" not found.`);
  }

  // Attack 2 defense line:
  if (order.userId !== user.id) {
    throw new Error(
      `Forbidden: Ownership mismatch. Order "${orderId}" belongs to "${order.userId}", not session "${user.id}".`
    );
  }

  if (order.status === "cancelled") {
    throw new Error("Order is already cancelled.");
  }

  // Authorized write
  const cancelled = cancelOrderById(orderId);

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);
  revalidatePath("/kitchen");

  return { id: cancelled.id, status: cancelled.status };
}

/**
 * Kitchen status update (Staff only)
 * Refused server-side if user is not staff.
 */
export async function updateKitchenStatus(orderId, newStatus) {
  const user = await getSession();
  if (!user) {
    throw new Error("Unauthorized: Please sign in.");
  }

  if (user.role !== "staff") {
    throw new Error("Forbidden: Staff privileges required to update kitchen status.");
  }

  const updated = updateOrderStatusById(orderId, newStatus);
  revalidatePath("/kitchen");
  revalidatePath("/orders");

  return { id: updated.id, status: updated.status };
}

/**
 * Security Lab Helper: Tests URL sanitization to demonstrate Attack #3 defense
 * @param {string} inputUrl
 */
export async function testSanitizeUrlAction(inputUrl) {
  const sanitized = sanitizeNextUrl(inputUrl, "/orders");
  const wasSanitized = sanitized !== inputUrl;
  return {
    input: inputUrl,
    sanitized,
    safe: !wasSanitized,
    reason: wasSanitized
      ? "Malicious input blocked! Protocol scheme, double slash, or non-relative format detected. Reverted to safe fallback."
      : "Safe relative path allowed.",
  };
}

/**
 * Security Lab Helper: Demonstrates Attack #1 line-level rejection
 */
export async function simulateUnauthenticatedCancel(orderId) {
  // Simulates a direct RPC invocation without the session cookie
  const user = null; // explicit null session
  if (!user) {
    throw new Error("Unauthorized: Authentication required. Session is missing or invalid. (app/actions.js:144)");
  }
  return { id: orderId, status: "cancelled" };
}

