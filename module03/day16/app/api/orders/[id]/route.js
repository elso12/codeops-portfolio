/**
 * app/api/orders/[id]/route.js
 * GET /api/orders/:id — return one order (only the owner may see it).
 * Used by the client polling loop on the order-status page via useSWR.
 *
 * PATCH /api/orders/:id — advance the order status (for simulation/testing of live polling).
 */
import { getOrderById, advanceOrderStatus } from "@/lib/data";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return Response.json(
      { error: "Not found", detail: `No order with id "${id}"` },
      { status: 404 }
    );
  }

  /* 403 — signed in, but this is someone else's order */
  if (order.userId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  return Response.json(order);
}

export async function PATCH(request, { params }) {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const { id } = await params;
  const existing = getOrderById(id);
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.userId !== user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = advanceOrderStatus(id);
  return Response.json(updated);
}
