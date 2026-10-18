/**
 * app/api/orders/[id]/route.js
 * GET /api/orders/:id — return one order (only the owner may see it).
 * Used by the client polling loop on the order-status page.
 */
import { getOrderById } from "@/lib/data";
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

  /* 403 — signed in, but this is someone else's order and user is not staff */
  if (order.userId !== user.id && user.role !== "staff") {
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
  const order = getOrderById(id);

  if (!order) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (order.userId !== user.id && user.role !== "staff") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const nextStageMap = {
    pending: "preparing",
    preparing: "out_for_delivery",
    out_for_delivery: "delivered",
    delivered: "delivered",
  };

  const nextStatus = nextStageMap[order.status] || "preparing";
  order.status = nextStatus;

  return Response.json(order);
}
