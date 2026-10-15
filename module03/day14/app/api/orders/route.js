/**
 * app/api/orders/route.js
 * GET  /api/orders       — list orders for the signed-in user
 * POST /api/orders       — place a new order (validates body with orderSchema)
 *
 * Error shape is always:
 *   { "error": "<message>", "fieldErrors"?: { "<field>": ["<msg>"] } }
 *
 * Status codes used:
 *   201  — order created
 *   400  — body could not be parsed as JSON
 *   401  — not signed in
 *   404  — dishId does not exist
 *   422  — JSON parsed but values failed schema validation
 *   500  — unexpected server error
 */
import { orderSchema } from "@/lib/schema";
import { createOrder, getDish, db } from "@/lib/db";
import { getSession } from "@/lib/db";

/* ── GET /api/orders ──────────────────────────────────────────────────────── */
export async function GET() {
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  const allOrders = await db.order.findMany();
  const orders = allOrders.filter(o => o.userId === user.id);
  return Response.json(orders);
}

/* ── POST /api/orders ─────────────────────────────────────────────────────── */
export async function POST(request) {
  /* 1. Authentication -------------------------------------------------------- */
  const user = await getSession();
  if (!user) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }

  /* 2. Parse body ------------------------------------------------------------ */
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  /* 3. Schema validation ----------------------------------------------------- */
  const result = orderSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      {
        error: "Validation failed",
        fieldErrors: result.error.flatten().fieldErrors,
      },
      { status: 422 }
    );
  }

  /* 4. Business rule: dish must exist ---------------------------------------- */
  const dish = await getDish(result.data.dishId);
  if (!dish) {
    return Response.json(
      { error: "Not found", detail: `No dish with id "${result.data.dishId}"` },
      { status: 404 }
    );
  }

  /* 5. Create order ---------------------------------------------------------- */
  try {
    const order = await createOrder(result.data);
    return Response.json(order, { status: 201 });
  } catch (err) {
    // Log full error on the server; send a safe message to the caller.
    console.error("[POST /api/orders]", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
