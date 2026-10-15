/**
 * app/api/dishes/route.js
 * GET /api/dishes
 *
 * Supports:
 * - ?category=Main|Vegetarian|Breakfast|Drinks
 * - ?q=... (search-as-you-type)
 * - ?page=... & ?limit=... (paged dishes for linkable pagination)
 */
import { getDishes, getDishesPaginated, searchDishes } from "@/lib/data";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");

  // Paged query: ?page=1
  if (pageParam !== null) {
    const page = Math.max(1, parseInt(pageParam, 10) || 1);
    const limit = Math.max(1, parseInt(limitParam, 10) || 4);
    const result = getDishesPaginated({ category, q, page, limit });
    return Response.json(result);
  }

  // Search query without explicit paging: ?q=doro
  if (q !== null && q !== undefined) {
    const dishes = searchDishes(q, category);
    return Response.json(dishes);
  }

  // Base catalog: ?category=... or all
  const dishes = getDishes(category ?? undefined);
  return Response.json(dishes);
}
