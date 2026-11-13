"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import fetcher from "@/lib/fetcher";

export default function FloatingOrderTracker() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Poll orders quietly every 12 seconds
  const { data: orders } = useSWR("/api/orders", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 12000,
    shouldRetryOnError: false,
  });

  // Do not display if user is already on the tracking or order status page
  if (pathname?.startsWith("/track") || pathname?.startsWith("/orders/")) {
    return null;
  }

  if (dismissed) {
    return null;
  }

  const orderList = Array.isArray(orders) ? orders : [];
  // Find in-flight order (pending, preparing, out_for_delivery)
  const activeOrder = orderList.find(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "out_for_delivery"
  );

  if (!activeOrder) {
    return null;
  }

  const statusLabel =
    activeOrder.status === "pending"
      ? "Order Received"
      : activeOrder.status === "preparing"
      ? "Simmering in Kitchen"
      : "Courier En Route";

  if (isMinimized) {
    return (
      <div className="floating-order-tracker floating-order-tracker--minimized">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="floating-order-btn-min"
          title="Expand active order status"
          aria-label="Expand active order tracker"
        >
          <span className="floating-pulse" aria-hidden="true" />
          <span>🛵 #{activeOrder.id}</span>
        </button>
      </div>
    );
  }

  return (
    <aside className="floating-order-tracker" aria-label="Active order progress">
      <div className="floating-order-tracker__inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="floating-pulse" aria-hidden="true" />
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
              Order #{activeOrder.id}
            </div>
            <span style={{ fontSize: "0.74rem", color: "var(--color-paprika)", fontWeight: 600 }}>
              {statusLabel}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Link
            href={`/track/${activeOrder.id}`}
            className="btn-figma btn-figma--primary btn-figma--sm"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", minHeight: "44px", display: "inline-flex", alignItems: "center" }}
          >
            🛵 Track Live
          </Link>
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="floating-close-btn"
            title="Minimize order tracker"
            aria-label="Minimize order tracker"
          >
            –
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="floating-close-btn"
            title="Dismiss until next update"
            aria-label="Dismiss order tracker"
          >
            ×
          </button>
        </div>
      </div>
    </aside>
  );
}

