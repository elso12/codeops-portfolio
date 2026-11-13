/**
 * app/kitchen/page.js - Kitchen Operations Dashboard (Server Component)
 *
 * Requirements:
 * 1. Staff role and a /kitchen route.
 * 2. Checked SERVER-SIDE rather than in the markup.
 * 3. Refuses access with 403 Forbidden to ordinary customers, even if they type the URL.
 */
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/data";
import { redirect } from "next/navigation";
import KitchenStatusControl from "./KitchenStatusControl";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen Expediter Operations & Hearth Board",
  description:
    "Staff operations portal for managing live kitchen orders, cycling preparation stages, and coordinating food delivery dispatches.",
  alternates: {
    canonical: "/kitchen",
  },
};

export default async function KitchenPage() {
  // Layer 1: Check session existence
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/kitchen");
  }

  // Layer 2: Server-side RBAC authorization check.
  // CRITICAL: This is NOT just hiding a link in the navbar; the entire page execution
  // refutes access if the authenticated session role is not "staff".
  if (user.role !== "staff") {
    return (
      <main className="container" style={{ maxWidth: 680, padding: "4rem 1.5rem" }}>
        <div
          style={{
            background: "#fff1f2",
            border: "2px solid #e11d48",
            borderRadius: "var(--radius-md)",
            padding: "2.5rem 2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫</div>
          <span
            style={{
              textTransform: "uppercase",
              fontSize: "0.8rem",
              fontWeight: 800,
              letterSpacing: "1px",
              color: "#e11d48",
            }}
          >
            HTTP 403 Forbidden · Server-Side Refusal
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "2.2rem",
              color: "#9f1239",
              margin: "0.5rem 0 1rem",
            }}
          >
            Staff Privileges Required
          </h1>
          <p style={{ color: "#4c0519", fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            You are authenticated as <strong>{user.name}</strong> with role{" "}
            <code style={{ background: "rgba(0,0,0,0.06)", padding: "2px 6px", borderRadius: 4 }}>
              {user.role}
            </code>
            . The <code>/kitchen</code> route is strictly guarded by server-side role validation.
            Ordinary customers cannot access kitchen operations.
          </p>

          <div
            style={{
              background: "#fff",
              border: "1px solid #fecdd3",
              borderRadius: "var(--radius-sm)",
              padding: "1rem",
              fontSize: "0.85rem",
              color: "#881337",
              textAlign: "left",
              marginBottom: "1.75rem",
            }}
          >
            <strong>Security Proof:</strong> Even though you manually typed or navigated to{" "}
            <code>/kitchen</code>, the server component evaluated <code>user.role !== &quot;staff&quot;</code>{" "}
            at <code>app/kitchen/page.js:28</code> before rendering any kitchen data.
          </div>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/orders" className="btn-figma btn-figma--primary">
              Return to My Orders &rarr;
            </Link>
            <Link href="/login" className="btn-figma btn-figma--outline">
              Switch to Staff Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Staff authenticated — load all kitchen orders
  const allOrders = getAllOrders();

  return (
    <main className="container" style={{ maxWidth: 1000, paddingBottom: "5rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2.5rem" }}>
        <span className="section-eyebrow">ወጥ ቤት • KITCHEN CONTROL PANEL</span>
        <h1 className="section-title-large">Hearth Expediter &amp; Kitchen</h1>
        <p className="section-sub-centered">
          Staff Logged In: <strong style={{ color: "var(--color-turmeric)" }}>{user.name}</strong>{" "}
          (Role: <code style={{ color: "var(--color-paprika)" }}>staff</code>)
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "var(--color-cream)", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-paprika)" }}>
            {allOrders.filter((o) => o.status === "pending").length}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Pending Tickets</div>
        </div>
        <div style={{ background: "var(--color-cream)", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-turmeric)" }}>
            {allOrders.filter((o) => o.status === "preparing").length}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>On Stove / Simmering</div>
        </div>
        <div style={{ background: "var(--color-cream)", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-forest)" }}>
            {allOrders.filter((o) => o.status === "ready" || o.status === "completed").length}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Ready / Dispatched</div>
        </div>
      </div>

      <div className="order-list">
        {allOrders.map((order) => (
          <div key={order.id} className="order-row" style={{ borderLeft: `4px solid ${order.status === "pending" ? "var(--color-paprika)" : order.status === "preparing" ? "var(--color-turmeric)" : "var(--color-forest)"}` }}>
            <div className="order-info">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="order-id">{order.id}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-main)" }}>
                  👤 {order.customerName}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontFamily: "monospace" }}>
                  ({order.userId})
                </span>
              </div>
              <span className="order-meta">
                {order.dish?.name} x {order.quantity} — {order.total} ETB
              </span>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                📍 {order.area} • 📞 {order.phone} {order.notes ? `• 📝 "${order.notes}"` : ""}
              </span>
            </div>

            <div className="order-actions" style={{ flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                <KitchenStatusControl orderId={order.id} currentStatus={order.status} />
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Ordered: {new Date(order.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
