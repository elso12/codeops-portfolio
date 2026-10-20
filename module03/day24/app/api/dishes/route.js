/**
 * app/api/dishes/route.js
 * GET /api/dishes          — return all dishes (optionally filtered by ?category=)
 *
 * Caching: reading request.url forces this dynamic so the list is always fresh.
 */
import { getDishes, searchDishes } from "@/lib/data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  if (q !== null && q !== undefined) {
    const dishes = searchDishes(q, category);
    return Response.json(dishes);
  }

  const dishes = getDishes(category ?? undefined);
  return Response.json(dishes);
}
