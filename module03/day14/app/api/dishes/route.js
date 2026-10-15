/**
 * app/api/dishes/route.js
 * GET /api/dishes          — return all dishes (optionally filtered by ?category=)
 *
 * Caching: reading request.url forces this dynamic so the list is always fresh.
 */
import { db } from "@/lib/db";

export async function GET(request) {
  const category = new URL(request.url).searchParams.get("category");
  let dishes = await db.dish.findMany();
  
  if (category) {
    dishes = dishes.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }
  
  return Response.json(dishes);
}
