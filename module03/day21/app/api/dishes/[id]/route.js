/**
 * app/api/dishes/[id]/route.js
 * GET /api/dishes/:id   — return one dish, or 404 with a standard error shape.
 *
 * The id comes from the second argument (params), not from the query string.
 * Params are always strings — validate them before use.
 */
import { getDishById } from "@/lib/data";

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return Response.json({ error: "Bad request", detail: "id is required" }, { status: 400 });
  }

  const dish = getDishById(id);

  if (!dish) {
    return Response.json(
      { error: "Not found", detail: `No dish with id "${id}"` },
      { status: 404 }
    );
  }

  return Response.json(dish);
}
