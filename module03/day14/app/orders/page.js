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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders — Addis Eats",
  description: "View and manage your Addis Eats orders.",
};

export default async function OrdersPage() {
  const user = await getSession();
  if (!user) redirect("/");          // in a real app: redirect to sign-in

  const orders = getOrdersByUser(user.id);

  return (
    <main className="container">
      <div className="section-header">
        <h1>My Orders</h1>
        <p>
          Signed in as <strong style={{ color: "var(--color-accent)" }}>{user.name}</strong>
          {" "}·{" "}
          <span style={{ fontFamily: "monospace", fontSize: ".8rem", color: "var(--color-text-dim)" }}>
            {user.id}
          </span>
        </p>
      </div>

      {orders.length === 0 && (
        <div className="empty-state">
          <span className="emoji">📋</span>
          <h3>No orders yet</h3>
          <p>Place your first order from the menu.</p>
          <a href="/menu" className="btn btn-primary" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
            Browse the Menu
          </a>
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
              <span style={{ fontSize: ".85rem", color: "var(--color-text-dim)" }}>
                {order.area} · {order.phone}
              </span>
            </div>

            <div className="order-actions">
              <span className="price" style={{ fontSize: "1rem" }}>
                {order.total}<span className="price-currency">ETB</span>
              </span>
              <span className={`badge badge-${order.status === "cancelled" ? "cancelled" : order.status === "pending" ? "pending" : "success"}`}>
                {order.status}
              </span>
              {order.status === "pending" && (
                <CancelButton orderId={order.id} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <div className="notice">
        <strong>Day 39 — cancelOrder action:</strong> Each "Cancel" button calls the{" "}
        <code>cancelOrder</code> server action, which checks the session and ownership
        before writing. Try calling it from the console with a different id — the server refuses.
      </div>
    </main>
  );
}
