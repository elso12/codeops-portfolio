import Link from "next/link";

/**
 * StateSwitcher
 *
 * Requirements:
 * "Loading, empty and error states all written, and each one demonstrable."
 * "write and force each of the four states."
 *
 * Provides a crisp demonstration toolbar at the top of the dashboard.
 * Preserves the active sort, order, and page URL parameters while switching states.
 */
export default function StateSwitcher({
  currentState = "normal",
  basePath = "/orders",
  params = {},
}) {
  const states = [
    { id: "normal", label: "✓ Normal (Live Data)", badge: "Loaded" },
    { id: "loading", label: "⏳ Loading State", badge: "0.000 CLS Skeleton" },
    { id: "empty", label: "📭 Empty State", badge: "0 Orders / New User" },
    { id: "error", label: "⚠️ Error State", badge: "HTTP 500 Simulation" },
  ];

  const buildUrl = (targetState) => {
    const search = new URLSearchParams();
    if (params.sort) search.set("sort", params.sort);
    if (params.order) search.set("order", params.order);
    if (params.page && params.page !== 1) search.set("page", String(params.page));
    if (targetState !== "normal") {
      search.set("state", targetState);
    }
    const q = search.toString();
    return q ? `${basePath}?${q}` : basePath;
  };

  return (
    <div
      className="state-switcher-bar"
      role="region"
      aria-label="Demonstrate the 4 Dashboard UI States"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1.25rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.1rem" }}>🧪</span>
        <div>
          <span
            style={{
              fontSize: "0.78rem",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              fontWeight: 800,
              color: "var(--color-paprika)",
              display: "block",
            }}
          >
            Mini-Project · Demonstration Control
          </span>
          <span style={{ fontSize: "0.86rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Test the 4 required UI states on demand:
          </span>
        </div>
      </div>

      <div
        className="state-buttons-group"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}
      >
        {states.map((st) => {
          const isActive = currentState === st.id;
          return (
            <Link
              key={`state-btn-${st.id}`}
              href={buildUrl(st.id)}
              className={`state-toggle-pill ${isActive ? "state-toggle-pill--active" : ""}`}
              aria-current={isActive ? "true" : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.85rem",
                borderRadius: "var(--radius-pill)",
                fontSize: "0.82rem",
                fontWeight: isActive ? 800 : 600,
                textDecoration: "none",
                background: isActive ? "var(--color-paprika)" : "rgba(0,0,0,0.04)",
                color: isActive ? "#ffffff" : "var(--text-main)",
                border: `1px solid ${isActive ? "var(--color-paprika)" : "var(--border-subtle)"}`,
                transition: "all 0.15s ease",
              }}
            >
              <span>{st.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
