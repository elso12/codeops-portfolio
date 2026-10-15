/**
 * app/orders/page.js — My Orders page (Server Component)
 *
 * Reads orders for the current user directly on the server.
 * revalidatePath("/orders") in the actions keeps this up to date after writes.
 *
 * The CancelButton is a client component because it needs onClick + useTransition.
 */
import { getOrdersByUser } from "@/lib/data";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CancelButton from "./CancelButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders | Mesob House Restaurant",
  description: "View and manage your Addis Eats · Mesob House orders.",
};

export default async function OrdersPage() {
  const user = await getSession();
  if (!user) redirect("/");

  const orders = getOrdersByUser(user.id);

  return (
    <main className="container" style={{ maxWidth: 880 }}>
      <div className="section-header-centered" style={{ marginBottom: "2.5rem" }}>
        <span className="section-eyebrow">የትዕዛዝ ሁኔታ · LIVE STATUS</span>
        <h1 className="section-title-large">My Mesob Orders</h1>
        <p className="section-sub-centered">
          Signed in as <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>
          {" "}·{" "}
          <span style={{ fontFamily: "monospace", fontSize: ".85rem", color: "var(--text-dim)" }}>
            {user.id}
          </span>
        </p>
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <span className="emoji">🧺</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>
            No orders placed yet
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.75rem", fontSize: "1.05rem" }}>
            Start by choosing your favorite slow-simmered wats or sizzling tibs from our kitchen.
          </p>
          <Link href="/menu" className="btn-figma btn-figma--primary">
            Browse Banquet Menu &rarr;
          </Link>
        </div>
      )}

      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-row">
            <div className="order-info">
              <span className="order-id">{order.id}</span>
              <span className="order-meta">
                {order.dish.name} × {order.quantity}
              </span>
              <span style={{ fontSize: ".85rem", color: "var(--text-muted)" }}>
                📍 {order.area} · 📞 {order.phone}
              </span>
            </div>

            <div className="order-actions">
              <span className="price" style={{ fontSize: "1.2rem" }}>
                {order.total}<span className="price-currency">ETB</span>
              </span>
              <span className={`badge badge-${order.status === "cancelled" ? "cancelled" : order.status === "pending" ? "pending" : "success"}`}>
                {order.status}
              </span>
              <Link
                href={`/orders/${order.id}`}
                className="btn-figma btn-figma--sand btn-figma--sm"
                id={`track-${order.id}`}
                style={{ textDecoration: "none" }}
              >
                Track Live &rarr;
              </Link>
              {order.status === "pending" && (
                <CancelButton orderId={order.id} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="divider" style={{ marginTop: "3rem" }} />
      <div className="notice">
        <strong>Server Action (cancelOrder):</strong> Each &ldquo;Cancel&rdquo; button calls the{" "}
        <code>cancelOrder</code> server action, verifying session and user ownership on the server before mutating data.
      </div>
    </main>
  );
}
