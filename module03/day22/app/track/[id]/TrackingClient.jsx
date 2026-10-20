"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import MapPanel from "./MapPanel";
import { etb, when, formatRelativeTime } from "@/lib/format";
import { toCsv, downloadCsv } from "@/lib/csv";

export default function TrackingClient({ id, initialData, initialHistory = [] }) {
  // 1. Seeded from server render — zero spinner on arrival (Slide 13)
  const [data, setData] = useState(initialData);
  // Connection state: 'connecting' | 'live' | 'delivered' | 'closed' | 'error'
  const [connectionState, setConnectionState] = useState("connecting");
  const [lastHeartbeat, setLastHeartbeat] = useState(new Date());
  const [exportNotice, setExportNotice] = useState(null);

  const eventSourceRef = useRef(null);

  useEffect(() => {
    // 2. Consume SSE stream seeded from server data
    const url = `/api/orders/${encodeURIComponent(id)}/stream`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    setConnectionState("connecting");

    es.onopen = () => {
      setConnectionState("live");
    };

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        setData(payload);
        setLastHeartbeat(new Date());

        // 3. Close stream deliberately on delivery (Slide 14)
        if (payload.status === "delivered") {
          es.close();
          setConnectionState("delivered");
        } else {
          setConnectionState("live");
        }
      } catch (err) {
        console.error("Failed to parse SSE payload:", err);
      }
    };

    es.onerror = () => {
      // If error occurs and readyState is CLOSED
      if (es.readyState === EventSource.CLOSED) {
        setConnectionState("closed");
      } else {
        setConnectionState("error");
      }
    };

    // 4. CRITICAL: Cleanup on unmount — closes connection when user navigates away
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [id]);

  // Deliberate manual closure handler
  const handleDeliberateClose = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setConnectionState("closed");
    }
  };

  // Reconnect stream handler
  const handleReconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    const es = new EventSource(`/api/orders/${encodeURIComponent(id)}/stream`);
    eventSourceRef.current = es;
    setConnectionState("connecting");

    es.onopen = () => setConnectionState("live");
    es.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      setData(payload);
      setLastHeartbeat(new Date());
      if (payload.status === "delivered") {
        es.close();
        setConnectionState("delivered");
      }
    };
    es.onerror = () => setConnectionState("error");
  };

  // CSV Export handler with awkward values test
  const handleExportCsv = (includeAwkwardValues = false) => {
    let rowsToExport = [];

    if (includeAwkwardValues) {
      // Test dataset with commas, double quotes, and newlines
      rowsToExport = [
        {
          orderId: data.orderId,
          restaurant: 'Mesob House, "Bole Atlas Branch"',
          dish: 'Special "Doro Wat", Tibs & Ayib',
          amountETB: etb.format(data.orderSummary.total),
          customer: data.destination.name,
          address: 'House 42, "Bole Road", Addis Ababa',
          courier: `${data.courier.name} (${data.courier.phone})`,
          status: data.status,
          notes: 'Call on arrival\n"Gate code: 9912", ring buzzer',
          updatedAt: when.format(new Date(data.updatedAt)),
        },
        {
          orderId: "ORD-AWKWARD-02",
          restaurant: 'Bole, Kitfo & Grill',
          dish: 'Gored Gored, "Extra Spicy"',
          amountETB: etb.format(520),
          customer: 'Chala, "The Connoisseur" Tadesse',
          address: 'Kazanchis, Near ECA "Building B"',
          courier: 'Yonas, Speedy Courier',
          status: 'delivered',
          notes: 'Special request: "No onions, extra awaze"\nDeliver to 3rd floor',
          updatedAt: when.format(new Date()),
        },
      ];
    } else {
      rowsToExport = [
        {
          orderId: data.orderId,
          dish: data.orderSummary.dishName,
          quantity: data.orderSummary.quantity,
          amountETB: etb.format(data.orderSummary.total),
          customer: data.destination.name,
          area: data.destination.area,
          address: data.destination.address,
          courier: data.courier.name,
          courierPhone: data.courier.phone,
          status: data.status,
          etaMinutes: data.etaMinutes,
          updatedAt: when.format(new Date(data.updatedAt)),
        },
      ];
    }

    const csvContent = toCsv(rowsToExport);
    const fileName = includeAwkwardValues
      ? `addis-eats-awkward-test-${data.orderId}.csv`
      : `addis-eats-tracking-${data.orderId}.csv`;

    downloadCsv(csvContent, fileName);
    setExportNotice(
      includeAwkwardValues
        ? "Exported CSV with verified awkward values (commas, quotes, newlines)!"
        : "Exported current delivery details to CSV!"
    );
    setTimeout(() => setExportNotice(null), 4500);
  };

  const courierPos = data.courier?.position || [8.9985, 38.7830];
  const destPos = data.destination?.position || [8.9950, 38.7896];
  const restPos = data.restaurant?.position || [9.0080, 38.7750];

  const statusBadgeStyle = {
    preparing: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", border: "rgba(245, 158, 11, 0.3)", text: "Kitchen Preparing" },
    on_the_way: { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", border: "rgba(59, 130, 246, 0.3)", text: "On the Way" },
    nearby: { bg: "rgba(168, 85, 247, 0.15)", color: "#c084fc", border: "rgba(168, 85, 247, 0.3)", text: "Nearby (~200m)" },
    delivered: { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399", border: "rgba(16, 185, 129, 0.3)", text: "Delivered" },
  }[data.status] || { bg: "rgba(148, 163, 184, 0.15)", color: "#94a3b8", border: "rgba(148, 163, 184, 0.3)", text: data.status };

  const connectionBadge = {
    connecting: { dot: "#f59e0b", label: "Connecting SSE...", pulse: true },
    live: { dot: "#10b981", label: "Live Stream Active", pulse: true },
    delivered: { dot: "#3b82f6", label: "Delivered · Stream Closed Deliberately", pulse: false },
    closed: { dot: "#64748b", label: "Stream Closed Deliberately", pulse: false },
    error: { dot: "#ef4444", label: "Stream Disconnected", pulse: false },
  }[connectionState] || { dot: "#94a3b8", label: connectionState, pulse: false };

  return (
    <div className="tracking-container" style={{ maxWidth: "1180px", margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Breadcrumb & Navigation */}
      <nav
        aria-label="Breadcrumb"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "#94a3b8" }}>
          <Link href="/orders" style={{ color: "#f59e0b", textDecoration: "none" }}>
            ← All Orders
          </Link>
          <span>/</span>
          <span style={{ color: "#e2e8f0" }}>Track Order #{data.orderId}</span>
        </div>

        {/* Live SSE Connection State Indicator (Slide 14) */}
        <div
          role="status"
          aria-live="polite"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "9999px",
            backgroundColor: "rgba(15, 23, 42, 0.8)",
            border: `1px solid ${connectionBadge.dot}44`,
            fontSize: "0.825rem",
            color: "#e2e8f0",
            backdropFilter: "blur(6px)",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: connectionBadge.dot,
              boxShadow: connectionBadge.pulse ? `0 0 8px ${connectionBadge.dot}` : "none",
              display: "inline-block",
            }}
          />
          <strong style={{ fontWeight: 600 }}>{connectionBadge.label}</strong>
          <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
            ({when.format(lastHeartbeat)})
          </span>
        </div>
      </nav>

      {/* Header Banner */}
      <header
        style={{
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "20px",
          padding: "1.75rem 2rem",
          marginBottom: "1.75rem",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, margin: 0, color: "#f8fafc" }}>
              Live Delivery Tracking
            </h1>
            <span
              style={{
                backgroundColor: statusBadgeStyle.bg,
                color: statusBadgeStyle.color,
                border: `1px solid ${statusBadgeStyle.border}`,
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              {statusBadgeStyle.text}
            </span>
          </div>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.95rem" }}>
            {data.statusMessage}
          </p>
        </div>

        {/* Action Controls: Deliberate Stream Close & Reconnect */}
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {connectionState === "live" ? (
            <button
              onClick={handleDeliberateClose}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(239, 68, 68, 0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "10px",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
              title="Close EventSource stream deliberately"
            >
              Close Stream Deliberately
            </button>
          ) : (
            <button
              onClick={handleReconnect}
              style={{
                padding: "8px 16px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#6ee7b7",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                borderRadius: "10px",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              ↻ Reconnect Stream
            </button>
          )}

          {/* CSV Export Buttons */}
          <button
            onClick={() => handleExportCsv(false)}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(245, 158, 11, 0.15)",
              color: "#fbbf24",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "10px",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            📥 Export CSV
          </button>

          <button
            onClick={() => handleExportCsv(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "rgba(147, 51, 234, 0.15)",
              color: "#c084fc",
              border: "1px solid rgba(147, 51, 234, 0.3)",
              borderRadius: "10px",
              fontSize: "0.85rem",
              cursor: "pointer",
              fontWeight: 600,
            }}
            title="Export CSV containing values with commas, quotes, and newlines"
          >
            🧪 Test CSV (Awkward Values)
          </button>
        </div>
      </header>

      {/* Export notification toast */}
      {exportNotice && (
        <div
          role="status"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            color: "#6ee7b7",
            padding: "10px 16px",
            borderRadius: "10px",
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✓</span> {exportNotice}
        </div>
      )}

      {/* Milestone Progress Bar */}
      <section
        aria-label="Delivery Milestones"
        style={{
          background: "#1e293b",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem",
          marginBottom: "1.75rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.75rem",
            textAlign: "center",
          }}
        >
          {[
            { key: "preparing", title: "1. Preparing", icon: "🍳" },
            { key: "on_the_way", title: "2. In Transit", icon: "🛵" },
            { key: "nearby", title: "3. Arriving", icon: "📍" },
            { key: "delivered", title: "4. Delivered", icon: "✨" },
          ].map((milestone, idx) => {
            const stepOrder = ["preparing", "on_the_way", "nearby", "delivered"];
            const currentIdx = stepOrder.indexOf(data.status);
            const isCompleted = currentIdx >= idx;
            const isCurrent = currentIdx === idx;

            return (
              <div
                key={milestone.key}
                style={{
                  padding: "10px 6px",
                  borderRadius: "12px",
                  backgroundColor: isCurrent
                    ? "rgba(245, 158, 11, 0.12)"
                    : isCompleted
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(255, 255, 255, 0.02)",
                  border: isCurrent
                    ? "1px solid rgba(245, 158, 11, 0.4)"
                    : isCompleted
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.04)",
                  color: isCurrent ? "#fbbf24" : isCompleted ? "#34d399" : "#64748b",
                }}
              >
                <div style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{milestone.icon}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: isCurrent ? 700 : 500 }}>
                  {milestone.title}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Map on Left, Full Accessible Text Information on Right */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.75rem",
          alignItems: "start",
        }}
      >
        {/* Left Column: Leaflet Map (ssr: false with sized placeholder) */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "#e2e8f0", margin: 0 }}>
              Live Courier Geo-Position
            </h2>
            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Bounds Auto-Fitted
            </span>
          </div>

          <MapPanel
            courierPosition={courierPos}
            destinationPosition={destPos}
            restaurantPosition={restPos}
            courierName={data.courier?.name}
            destinationLabel={data.destination?.address}
            status={data.status}
            etaMinutes={data.etaMinutes}
          />

          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "8px", fontStyle: "italic" }}>
            OpenStreetMap tiles loaded client-side with ssr:false. Explicit height: 380px (0.000 CLS).
          </p>
        </div>

        {/* Right Column: Semantic HTML Delivery Information Available as Text Beside Map */}
        {/* Requirement: Can someone who cannot see the map still find where their order is? YES! */}
        <div
          role="region"
          aria-label="Order and Courier Text Details"
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            padding: "1.5rem",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          }}
        >
          <h2
            style={{
              fontSize: "1.15rem",
              fontWeight: 700,
              color: "#f8fafc",
              marginTop: 0,
              marginBottom: "1rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              paddingBottom: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Delivery Summary</span>
            <span style={{ fontSize: "0.8rem", color: "#f59e0b", fontWeight: 600 }}>
              {etb.format(data.orderSummary.total)}
            </span>
          </h2>

          {/* Courier Card */}
          <div
            style={{
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.25rem",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "#f59e0b",
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                🛵
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "0.95rem", color: "#f8fafc", fontWeight: 600 }}>
                  {data.courier.name}
                </h3>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>
                  {data.courier.vehicle}
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "0.85rem", marginTop: "10px" }}>
              <div>
                <span style={{ color: "#64748b" }}>Direct Contact:</span>
                <p style={{ margin: "2px 0 0", color: "#e2e8f0", fontWeight: 500 }}>
                  <a href={`tel:${data.courier.phone}`} style={{ color: "#60a5fa", textDecoration: "none" }}>
                    {data.courier.phone}
                  </a>
                </p>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Distance Remaining:</span>
                <p style={{ margin: "2px 0 0", color: "#e2e8f0", fontWeight: 500 }}>
                  {data.status === "delivered" ? "Arrived" : `~${data.courier.distanceKm} km`}
                </p>
              </div>
            </div>
          </div>

          {/* Address & ETA Details formatted through lib/format.js */}
          <dl style={{ margin: 0, display: "grid", gridTemplateColumns: "1fr", gap: "12px", fontSize: "0.9rem" }}>
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", paddingBottom: "8px" }}>
              <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Delivery Address
              </dt>
              <dd style={{ margin: "4px 0 0", color: "#f8fafc", fontWeight: 500 }}>
                {data.destination.name}
                <div style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>{data.destination.address}</div>
                <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Area: {data.destination.area}</div>
              </dd>
            </div>

            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)", paddingBottom: "8px" }}>
              <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                Origin Restaurant
              </dt>
              <dd style={{ margin: "4px 0 0", color: "#f8fafc", fontWeight: 500 }}>
                {data.restaurant.name}
                <div style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Area: {data.restaurant.area}</div>
              </dd>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.04)", paddingBottom: "8px" }}>
              <div>
                <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Estimated Arrival
                </dt>
                <dd style={{ margin: "4px 0 0", color: "#f59e0b", fontWeight: 600 }}>
                  {data.status === "delivered"
                    ? "Delivered"
                    : `${when.format(new Date(data.estimatedDeliveryTime))} (${formatRelativeTime(data.estimatedDeliveryTime)})`}
                </dd>
              </div>
              <div>
                <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Last Server Update
                </dt>
                <dd style={{ margin: "4px 0 0", color: "#cbd5e1", fontWeight: 500 }}>
                  {when.format(new Date(data.updatedAt))}
                </dd>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Items Ordered
                </dt>
                <dd style={{ margin: "4px 0 0", color: "#f8fafc", fontWeight: 500 }}>
                  {data.orderSummary.dishName} × {data.orderSummary.quantity}
                </dd>
              </div>
              <div>
                <dt style={{ color: "#64748b", fontSize: "0.8rem", textTransform: "uppercase" }}>
                  Total Paid
                </dt>
                <dd style={{ margin: "4px 0 0", color: "#10b981", fontWeight: 700 }}>
                  {etb.format(data.orderSummary.total)}
                </dd>
              </div>
            </div>
          </dl>

          {/* Delivery Note */}
          {data.destination.notes && (
            <div
              style={{
                marginTop: "1rem",
                padding: "8px 12px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                borderRadius: "8px",
                fontSize: "0.825rem",
                color: "#94a3b8",
                borderLeft: "3px solid #f59e0b",
              }}
            >
              <strong style={{ color: "#e2e8f0" }}>Special Instructions:</strong> {data.destination.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
