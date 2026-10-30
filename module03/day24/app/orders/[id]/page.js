/**
 * app/orders/[id]/page.js — Server Component
 *
 * Section 4 (Server & Client Together):
 * 1. The server reads the order directly (zero internal HTTP round-trips).
 * 2. It renders the first paint with real data — so the user and search crawlers
 *    see the order immediately (zero spinner on arrival).
 * 3. It passes `order` to <OrderStatus> as `fallbackData` (or `initial`),
 *    handing over to SWR for background polling every 5 seconds.
 */

import { getOrderById, getDishById, dishes } from "@/lib/data";
import { getSession } from "@/lib/session";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import OrderStatus from "./OrderStatus";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order Status #${id} | Addis Eats · Mesob House`,
    description: `Track real-time preparation and delivery for order #${id}.`,
  };
}

export default async function OrderPage({ params }) {
  const user = await getSession();
  if (!user) redirect("/");

  const { id } = await params;

  // Cross-lambda Serverless check: Attempt to read active order from cookie first
  let order = null;
  try {
    const cookieStore = await cookies();
    const cookieVal = cookieStore.get("mesob_active_order")?.value;
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      if (parsed.id === id) {
        order = {
          ...parsed,
          dish: getDishById(parsed.dishId) || dishes[0],
        };
      }
    }
  } catch (_) {}

  if (!order) {
    order = getOrderById(id, user.id);
  }

  if (!order) {
    notFound();
  }

  // Authorisation check on server
  if (order.userId !== user.id && user.role !== "staff") {
    return (
      <main className="container" style={{ maxWidth: 840, padding: "4rem 1rem", textAlign: "center" }}>
        <h1 style={{ color: "var(--color-paprika)" }}>Access Restricted</h1>
        <p style={{ color: "var(--text-muted)" }}>You do not have permission to view this order.</p>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: 880, padding: "3rem 1rem" }}>
      <OrderStatus id={id} initial={order} />
    </main>
  );
}
