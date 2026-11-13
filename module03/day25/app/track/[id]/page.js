/**
 * app/track/[id]/page.js — Server Component
 *
 * Seeds initial order and courier location data directly on the server
 * so the initial HTML paint has real data with zero spinners.
 * Handed over to <TrackingClient> to attach the live SSE stream via EventSource.
 */

import { getOrderById, getAllOrders } from "@/lib/data";
import { notFound } from "next/navigation";
import TrackingClient from "./TrackingClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id || "ord_001";
  return {
    title: `Track Order #${id} | Addis Eats · Live Delivery`,
    description: `Real-time courier GPS tracking and live order milestones for order #${id}.`,
  };
}

export default async function TrackOrderPage({ params }) {
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id || "ord_001";

  const order = getOrderById(id);
  const allOrders = getAllOrders();

  if (!order) {
    notFound();
  }

  // Pre-seed initial state matching the server stream starting point
  const now = new Date();
  const etaMinutes = 18;
  const etaDate = new Date(now.getTime() + etaMinutes * 60 * 1000);

  const initialData = {
    orderId: id,
    step: 0,
    totalSteps: 6,
    status: order.status === "completed" ? "delivered" : "preparing",
    statusMessage: "Kitchen is preparing your fresh order...",
    etaMinutes,
    estimatedDeliveryTime: etaDate.toISOString(),
    updatedAt: now.toISOString(),
    restaurant: {
      name: "Mesob House · Bole Atlas",
      area: "Bole Atlas",
      position: [9.0080, 38.7750],
    },
    destination: {
      name: order.customerName || "Customer Destination",
      area: order.area || "Bole Rwanda",
      position: [8.9950, 38.7896],
      address: order.address || `${order.area || "Bole Rwanda"}, House 42`,
      notes: order.notes || "Fragile — handle with care",
    },
    courier: {
      name: "Almaz Worku",
      phone: "+251 91 123 4567",
      vehicle: "TVS Apache 160 (Motorcycle - AA 3-B9201)",
      position: [9.0060, 38.7770],
      distanceKm: 3.4,
    },
    orderSummary: {
      id: order.id,
      dishName: order.dish?.name || "Traditional Mesob Selection",
      quantity: order.quantity || 1,
      total: order.total || 360,
      currency: order.currency || "ETB",
      area: order.area || "Bole Rwanda",
      createdAt: order.createdAt || now.toISOString(),
    },
  };

  return (
    <main style={{ minHeight: "85vh", paddingBottom: "3rem" }}>
      <TrackingClient id={id} initialData={initialData} initialHistory={allOrders} />
    </main>
  );
}
