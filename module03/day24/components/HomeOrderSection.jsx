"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomeOrderSection({ user, initialOrders = [] }) {
  const router = useRouter();
  const [orderIdInput, setOrderIdInput] = useState("");
  const [inputError, setInputError] = useState("");

  const sampleOrders = [
    { id: "ord_001", label: "ord_001 (Doro Wat · Bole)" },
    { id: "ord_002", label: "ord_002 (Tibs · Kazanchis)" },
    { id: "ord_003", label: "ord_003 (Kitfo · Kazanchis)" },
  ];

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim();
    if (!cleanId) {
      setInputError("Please enter an Order ID (e.g., ord_001)");
      return;
    }
    setInputError("");
    router.push(`/track/${encodeURIComponent(cleanId)}`);
  };

  const handleSelectSample = (id) => {
    setOrderIdInput(id);
    setInputError("");
    router.push(`/track/${encodeURIComponent(id)}`);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { label: "⏳ Order Received", className: "badge badge-pending" },
      preparing: { label: "🔥 Preparing in Kitchen", className: "badge badge-preparing" },
      out_for_delivery: { label: "🛵 Out for Delivery", className: "badge badge-preparing", bg: "#0284c7" },
      delivered: { label: "✅ Delivered", className: "badge badge-success" },
      completed: { label: "✅ Delivered", className: "badge badge-success" },
      cancelled: { label: "❌ Cancelled", className: "badge badge-cancelled" },
    };
    return map[status] || { label: status, className: "badge" };
  };

  const recentOrders = initialOrders.slice(0, 4);

  return (
    <section id="track-orders" className="home-orders-section" aria-labelledby="home-orders-title">
      <div className="section-header-flex" style={{ marginBottom: "2rem" }}>
        <div>
          <span className="section-eyebrow">የእርስዎ ትዕዛዞች • LIVE HEARTH TRACKING</span>
          <h2 id="home-orders-title" className="section-title">
            Track &amp; Manage Your Orders
          </h2>
          <p className="section-sub">
            Follow real-time kitchen preparation, stone-ground injera baking, and live courier delivery across Addis Ababa.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/orders" className="btn-figma btn-figma--primary">
            📦 View All Orders &rarr;
          </Link>
          <Link href="/menu" className="btn-figma btn-figma--sand">
            🍽️ Order More Food
          </Link>
        </div>
      </div>

      {/* Quick Lookup Bar */}
      <div className="home-orders-lookup-card">
        <form onSubmit={handleTrackSubmit} className="home-orders-lookup-form" role="search" aria-label="Quick order lookup">
          <div style={{ flex: 1, minWidth: "260px" }}>
            <label htmlFor="home-order-id-input" className="home-orders-lookup-label">
              Have an Order Number? Track Live Courier GPS:
            </label>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <input
                id="home-order-id-input"
                type="text"
                value={orderIdInput}
                onChange={(e) => {
                  setOrderIdInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                placeholder="Enter Order ID (e.g. ord_001)"
                className="home-orders-lookup-input"
                aria-invalid={!!inputError}
                aria-describedby={inputError ? "order-lookup-err" : undefined}
              />
              <button
                type="submit"
                className="btn-figma btn-figma--primary"
                style={{ padding: "0.75rem 1.75rem", whiteSpace: "nowrap" }}
              >
                🛵 Track Live Map &rarr;
              </button>
            </div>
            {inputError && (
              <p id="order-lookup-err" style={{ color: "var(--color-paprika)", fontSize: "0.85rem", marginTop: "0.35rem", fontWeight: 600 }}>
                {inputError}
              </p>
            )}
          </div>

          <div className="home-orders-quick-chips">
            <span style={{ fontSize: "0.8rem", color: "var(--text-dim)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.5px" }}>
              Quick Test Orders:
            </span>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
              {sampleOrders.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.id)}
                  className="home-orders-chip"
                  title={`Track ${sample.label} live`}
                >
                  #{sample.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Orders Grid or Sign-in Prompt */}
      {user ? (
        recentOrders.length > 0 ? (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", color: "var(--text-main)", margin: 0 }}>
                Recent Orders for <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>
              </h3>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Showing {recentOrders.length} of {initialOrders.length} orders
              </span>
            </div>

            <div className="home-orders-grid">
              {recentOrders.map((ord) => {
                const statusMeta = getStatusBadge(ord.status);
                const orderDate = new Date(ord.createdAt);
                const formattedDate = !isNaN(orderDate.getTime())
                  ? orderDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                  : ord.createdAt;

                return (
                  <article key={ord.id} className="home-order-card">
                    <div className="home-order-card__header">
                      <div>
                        <span className="home-order-card__id">#{ord.id}</span>
                        <span className="home-order-card__date">{formattedDate}</span>
                      </div>
                      <span
                        className={statusMeta.className}
                        style={statusMeta.bg ? { backgroundColor: statusMeta.bg, color: "#fff" } : undefined}
                      >
                        {statusMeta.label}
                      </span>
                    </div>

                    <div className="home-order-card__body">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <div>
                          <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1.1rem", color: "var(--text-main)" }}>
                            {ord.dish?.name || "Authentic Habesha Platter"}
                          </h4>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            Qty: <strong>{ord.quantity}</strong> · Area: <strong>📍 {ord.area}</strong>
                          </span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-paprika)" }}>
                            {ord.total} {ord.currency}
                          </span>
                        </div>
                      </div>

                      {ord.notes && (
                        <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", margin: "0.25rem 0 0.75rem", fontStyle: "italic" }}>
                          &ldquo;{ord.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="home-order-card__footer">
                      <Link
                        href={`/track/${ord.id}`}
                        className="btn-figma btn-figma--primary btn-figma--sm"
                        style={{ flex: 1, textAlign: "center", justifyContent: "center" }}
                      >
                        🛵 Live GPS Tracking
                      </Link>
                      <Link
                        href={`/orders/${ord.id}`}
                        className="btn-figma btn-figma--sand btn-figma--sm"
                        style={{ flex: 1, textAlign: "center", justifyContent: "center" }}
                      >
                        📋 Order Status
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {initialOrders.length > 4 && (
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <Link href="/orders" className="btn-figma btn-figma--sand" style={{ padding: "0.75rem 2rem" }}>
                  View All {initialOrders.length} Orders in Ledger &rarr;
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="home-orders-empty">
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "0.5rem" }}>🧺</span>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.4rem", margin: "0 0 0.5rem 0" }}>
              No Orders Yet, {user.name}
            </h3>
            <p style={{ color: "var(--text-muted)", maxWidth: "480px", margin: "0 auto 1.5rem" }}>
              Your hearth ledger is fresh and ready. Gather around our communal mesob for slow-simmered wats and stone-ground teff injera.
            </p>
            <Link href="/menu" className="btn-figma btn-figma--primary" style={{ padding: "0.75rem 2rem" }}>
              Explore Menu &amp; Place Your First Order &rarr;
            </Link>
          </div>
        )
      ) : (
        <div className="home-orders-guest-box">
          <div style={{ maxWidth: "560px" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: "0 0 0.5rem 0", color: "var(--text-main)" }}>
              Are you a Mesob Dining Member?
            </h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Sign in to view your complete order history, track active kitchen preparation, and earn Gursha loyalty points on every communal meal.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/login?next=/orders" className="btn-figma btn-figma--primary">
              Sign In to View Orders
            </Link>
            <Link href="/register" className="btn-figma btn-figma--sand">
              Create Free Account &rarr;
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

