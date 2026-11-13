"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/navigation";
import fetcher from "@/lib/fetcher";

export default function MenuOrdersBar() {
  const router = useRouter();
  const [trackInput, setTrackInput] = useState("");
  const [trackError, setTrackError] = useState("");
  const [showLookup, setShowLookup] = useState(false);

  // Poll user orders quietly in the background
  const { data: orders } = useSWR("/api/orders", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000,
    shouldRetryOnError: false,
  });

  const orderList = Array.isArray(orders) ? orders : [];
  // Find in-flight active order (pending, preparing, out_for_delivery)
  const activeOrder = orderList.find(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "out_for_delivery"
  ) || orderList[0];

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const clean = trackInput.trim();
    if (!clean) {
      setTrackError("Enter Order ID");
      return;
    }
    setTrackError("");
    router.push(`/track/${encodeURIComponent(clean)}`);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "⏳ Order Received (In Queue)";
      case "preparing":
        return "🔥 Simmering in Kitchen";
      case "out_for_delivery":
        return "🛵 Courier En Route";
      case "delivered":
      case "completed":
        return "✅ Delivered";
      default:
        return status;
    }
  };

  return (
    <div className="menu-orders-bar" aria-label="Order status and quick tracking">
      {activeOrder ? (
        <div className="menu-orders-banner">
          <div className="menu-orders-banner__info">
            <span className="menu-orders-badge">
              <span className="menu-orders-pulse" aria-hidden="true" />
              LIVE ORDER
            </span>
            <div style={{ lineHeight: 1.25 }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-main)" }}>
                Order #{activeOrder.id}: {getStatusText(activeOrder.status)}
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {activeOrder.dish?.name || "Habesha Feast"} · {activeOrder.total} {activeOrder.currency} · 📍 {activeOrder.area}
              </span>
            </div>
          </div>

          <div className="menu-orders-banner__actions">
            <Link
              href={`/track/${activeOrder.id}`}
              className="btn-figma btn-figma--primary btn-figma--sm"
              title="Track live GPS delivery"
            >
              🛵 Track Live Map
            </Link>
            <Link
              href={`/orders/${activeOrder.id}`}
              className="btn-figma btn-figma--sand btn-figma--sm"
              title="View full order status"
            >
              📋 Details
            </Link>
            <Link
              href="/orders"
              className="btn-figma btn-figma--outline btn-figma--sm"
              title="View all your orders"
            >
              📦 My Orders ({orderList.length})
            </Link>
          </div>
        </div>
      ) : (
        <div className="menu-orders-bar__compact">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.2rem" }}>📦</span>
            <div>
              <strong style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>Have an Active Feast?</strong>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block" }}>
                Track courier dispatch across Addis Ababa or check order history.
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {!showLookup ? (
              <button
                type="button"
                onClick={() => setShowLookup(true)}
                className="btn-figma btn-figma--sand btn-figma--sm"
              >
                🔍 Track Order by ID
              </button>
            ) : (
              <form onSubmit={handleTrackSubmit} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Order ID (e.g. ord_001)"
                  value={trackInput}
                  onChange={(e) => {
                    setTrackInput(e.target.value);
                    if (trackError) setTrackError("");
                  }}
                  className="menu-track-input"
                  aria-label="Order ID to track"
                />
                <button type="submit" className="btn-figma btn-figma--primary btn-figma--sm">
                  Track 🛵
                </button>
                <button
                  type="button"
                  onClick={() => setShowLookup(false)}
                  className="btn-figma btn-figma--outline btn-figma--sm"
                  aria-label="Cancel track lookup"
                >
                  ✕
                </button>
              </form>
            )}
            <Link href="/orders" className="btn-figma btn-figma--outline btn-figma--sm">
              My Orders &rarr;
            </Link>
          </div>
        </div>
      )}
      {trackError && (
        <div style={{ color: "var(--color-paprika)", fontSize: "0.8rem", padding: "0.25rem 0.5rem", fontWeight: 600 }}>
          {trackError}
        </div>
      )}
    </div>
  );
}

