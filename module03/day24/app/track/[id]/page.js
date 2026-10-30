/**
 * app/track/[id]/page.js — Server Component
 *
 * Seeds initial order and courier location data directly on the server
 * so the initial HTML paint has real data with zero spinners.
 * Handed over to <TrackingClient> to attach the live SSE stream via EventSource.
 */

import { getOrderById } from "@/lib/data";
import { getSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TrackingClient from "./TrackingClient";

// Area coordinates across Addis Ababa [lat, lng]
const AREA_COORDINATES = {
  "Bole Rwanda": [8.9950, 38.7896],
  "Bole": [8.9980, 38.7860],
  "Kazanchis": [9.0105, 38.7615],
  "Piassa": [9.0350, 38.7520],
  "Sarbet": [9.0020, 38.7350],
  "Mexico": [9.0120, 38.7450],
  "Old Airport": [8.9880, 38.7410],
  "CMC": [9.0230, 38.8350],
  "Merkato": [9.0310, 38.7390],
  "Lideta": [9.0150, 38.7380],
  "Yeka": [9.0310, 38.7950],
  "Nifas Silk": [8.9680, 38.7510],
  "Kolfe": [9.0220, 38.7180],
  "Gulele": [9.0620, 38.7480],
  "Addis Ketema": [9.0360, 38.7360],
};

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
  // 1. Authentication Layer: Verify session cookie at render time
  const user = await getSession();
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams?.id || "ord_001";

  if (!user) {
    redirect(`/login?next=/track/${id}`);
  }

  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  // 2. Authorization Layer: Enforce order ownership (anti-IDOR)
  if (order.userId !== user.id && user.role !== "staff") {
    return (
      <main className="container" style={{ maxWidth: 840, padding: "4rem 1rem", textAlign: "center" }}>
        <div style={{
          background: "rgba(224, 86, 36, 0.08)",
          border: "2px solid var(--color-paprika)",
          borderRadius: "var(--radius-md)",
          padding: "3rem 2rem",
          margin: "2rem auto"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h1 style={{ color: "var(--color-paprika)", fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "0.5rem" }}>
            Access Restricted (HTTP 403)
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "1.5rem" }}>
            You do not have permission to view delivery tracking for order <strong>{id}</strong>.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/orders" className="btn-figma btn-figma--primary" style={{ minHeight: "44px" }}>
              Back to My Orders
            </Link>
            <Link href="/menu" className="btn-figma btn-figma--outline" style={{ minHeight: "44px" }}>
              View Menu
            </Link>
          </div>
        </div>
      </main>
    );
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
      position: AREA_COORDINATES[order.area] || [8.9950, 38.7896],
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
      paymentMethod: order.paymentMethod || "telebirr",
      createdAt: order.createdAt || now.toISOString(),
    },
  };

  return (
    <main style={{ minHeight: "85vh", paddingBottom: "3rem" }}>
      <TrackingClient id={id} initialData={initialData} />
    </main>
  );
}
