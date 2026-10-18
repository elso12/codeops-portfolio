/**
 * app/actions.js
 * "use server" — all exports are server actions.
 *
 * A server action is a function that:
 *   • runs only on the server (the directive guarantees this)
 *   • can be called directly from a client component or <form action={...}>
 *   • never needs a URL, method, or JSON.stringify in the caller
 *
 * Every action is also a real HTTP endpoint. That means:
 *   • Authentication  — check the session inside the action, not just in UI
 *   • Authorisation   — verify the signed-in user owns the record
 *   • Validation      — re-run the schema even when the form already ran it
 */
"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/lib/schema";
import { createOrder, getOrderById, cancelOrderById } from "@/lib/data";
import { getSession } from "@/lib/session";

/* ── placeOrder ─────────────────────────────────────────────────────────────
 * Called by the checkout form via <form action={placeOrder}> or
 * useActionState(placeOrder, null).
 *
 * FormData is what the browser sends natively; we coerce types before
 * passing to the schema so Zod sees numbers, not strings, where needed.
 *
 * Returns:
 *   { ok: true,  order: { id, total, currency } }   — on success
 *   { ok: false, fieldErrors: { field: [msg] } }    — on validation failure
 *   { ok: false, error: string }                    — on other server error
 * ─────────────────────────────────────────────────────────────────────────── */
export async function placeOrder(prevState, formData) {
  /* 1. Authentication */
  const user = await getSession();
  if (!user) {
    return { ok: false, error: "You must be signed in to place an order." };
  }

  /* 2. Pull fields from FormData and coerce types */
  const raw = {
    name: formData.get("name"),
    phone: formData.get("phone"),
    dishId: formData.get("dishId"),
    quantity: Number(formData.get("quantity")),
    area: formData.get("area"),
    notes: formData.get("notes") || undefined,
  };

  /* 3. Validate with the shared schema */
  const result = orderSchema.safeParse(raw);
  if (!result.success) {
    return {
      ok: false,
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  /* 4. Create order */
  try {
    const order = createOrder(result.data, user.id);

    /* 5. Invalidate cached pages that list orders */
    revalidatePath("/orders");

    return {
      ok: true,
      order: { id: order.id, total: order.total, currency: order.currency },
    };
  } catch (err) {
    console.error("[placeOrder action]", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/* ── cancelOrder ────────────────────────────────────────────────────────────
 * Cancels an order.  Two things are checked inside the action — never outside:
 *   1. Is the user signed in?
 *   2. Does this order belong to them?
 *
 * Hiding the "Cancel" button in the UI is UX. This check is security.
 * Anyone can POST to this endpoint from curl or the browser console.
 * ─────────────────────────────────────────────────────────────────────────── */
export async function cancelOrder(orderId) {
  /* 1. Authentication */
  const user = await getSession();
  if (!user) {
    throw new Error("Not signed in");
  }

  /* 2. Load the record from the server — never trust an id from the client alone */
  const order = getOrderById(orderId);
  if (!order) {
    throw new Error(`Order "${orderId}" not found`);
  }

  /* 3. Authorisation — confirm the signed-in user owns this order */
  if (order.userId !== user.id) {
    throw new Error("You are not allowed to cancel this order");
  }

  /* 4. Perform the write */
  const cancelled = cancelOrderById(orderId);

  /* 5. Revalidate — any cached page showing this order now has stale data */
  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { id: cancelled.id, status: cancelled.status };
}
