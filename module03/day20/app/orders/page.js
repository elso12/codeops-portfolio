/**
 * app/orders/page.js - My Orders page (Server Component)
 *
 * Security Layers:
 * 1. Middleware: Intercepts unauthenticated users before page execution.
 * 2. Server Component Render Check: Calls getSession() during render (defense in depth).
 * 3. Scoped Query: getOrdersByUser(user.id) — strictly bound to the authenticated
 *    session id, ignoring any manipulated URL parameters or request bodies.
 */
import { getOrdersByUser } from "@/lib/data";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CancelButton from "./CancelButton";
import AttackTestBox from "./AttackTestBox";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders & Live Order Status",
  description:
    "Track your active Addis Eats orders in real time, view meal preparation progress in the kitchen, and review previous dining history.",
  alternates: {
    canonical: "/orders",
  },
};

export default async function OrdersPage({ searchParams }) {
  // Layer 2: Verify session at render time (defense-in-depth)
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/orders");
  }

  // Layer 3: Scope query strictly to verified session user ID.
  // URL manipulation (e.g. ?userId=user_chala_002) has zero effect on this query.
  const orders = getOrdersByUser(user.id);

  return (
    <main className="container" style={{ maxWidth: 900, paddingBottom: "4rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
        <span className="section-eyebrow">የእኔ ትዕዛዞች • AUTHENTICATED REALM</span>
        <h1 className="section-title-large">My Mesob Orders</h1>
        <p className="section-sub-centered">
          Signed in as <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>{" "}
          ({user.role}) •{" "}
          <span style={{ fontFamily: "monospace", fontSize: ".85rem", color: "var(--text-dim)" }}>
            Session ID: {user.id}
          </span>
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="emoji">🍲</span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "var(--text-main)",
            }}
          >
            No orders found for this account
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.75rem", fontSize: "1.05rem" }}>
            This query is strictly isolated to session ID <code>{user.id}</code>. Other users&apos;
            orders are completely invisible.
          </p>
          <Link href="/menu" className="btn-figma btn-figma--primary">
            Order Warm Habesha Meals &rarr;
          </Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-row">
              <div className="order-info">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="order-id">{order.id}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "12px",
                      background: "rgba(0,0,0,0.05)",
                      fontFamily: "monospace",
                    }}
                  >
                    Owner: {order.userId}
                  </span>
                </div>
                <span className="order-meta">
                  {order.dish?.name || "Traditional Feast"} x {order.quantity}
                </span>
                <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
                  📍 {order.area} • 📞 {order.phone}
                </span>
              </div>

              <div className="order-actions">
                <span className="price" style={{ fontSize: "1.2rem" }}>
                  {order.total}
                  <span className="price-currency">ETB</span>
                </span>
                <span
                  className={`badge badge-${
                    order.status === "cancelled"
                      ? "cancelled"
                      : order.status === "pending"
                      ? "pending"
                      : "success"
                  }`}
                >
                  {order.status}
                </span>
                <Link
                  href={`/orders/${order.id}`}
                  className="btn-link"
                  style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-paprika)" }}
                >
                  Track Live &rarr;
                </Link>
                {order.status === "pending" && <CancelButton orderId={order.id} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Demonstration & Attack Simulation Panel */}
      <AttackTestBox currentUserId={user.id} />
    </main>
  );
}
