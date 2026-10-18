/**
 * app/api/dishes/route.js
 * GET /api/dishes          — return all dishes (optionally filtered by ?category=)
 *
 * Caching: reading request.url forces this dynamic so the list is always fresh.
 */
import { getDishes } from "@/lib/data";

export async function GET(request) {
  const category = new URL(request.url).searchParams.get("category");
  const dishes = getDishes(category ?? undefined);
  return Response.json(dishes);
}
