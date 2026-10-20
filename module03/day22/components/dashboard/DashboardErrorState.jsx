import Link from "next/link";

/**
 * DashboardErrorState
 *
 * Requirements:
 * 1. Error state written and demonstrable on demand.
 * 2. High-contrast accessible error alert markup (role="alert").
 * 3. Clear explanation of error with retry mechanisms.
 */
export default function DashboardErrorState({
  error = { message: "Ledger server database connection simulated failure" },
  reset,
  forced = false,
}) {
  return (
    <section
      role="alert"
      aria-live="assertive"
      className="dashboard-error-card"
      style={{
        background: "#fff1f2",
        border: "2px solid #e11d48",
        borderRadius: "var(--radius-lg)",
        padding: "3.5rem 2rem",
        textAlign: "center",
        boxShadow: "var(--shadow-card)",
        maxWidth: 720,
        margin: "2rem auto",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          lineHeight: "72px",
          borderRadius: "50%",
          background: "#ffe4e6",
          fontSize: "2.5rem",
          margin: "0 auto 1.5rem",
          border: "2px solid #fda4af",
        }}
        aria-hidden="true"
      >
        ⚠️
      </div>

      <span
        style={{
          display: "inline-block",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#be123c",
          marginBottom: "0.5rem",
        }}
      >
        {forced ? "FORCED ERROR DEMONSTRATION" : "HTTP 500 · SERVER LEDGER EXCEPTION"}
      </span>

      <h2
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "2rem",
          color: "#9f1239",
          marginBottom: "1rem",
        }}
      >
        Failed to Fetch Dashboard Ledger
      </h2>

      <p
        style={{
          color: "#4c0519",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          maxWidth: 540,
          margin: "0 auto 1.75rem",
        }}
      >
        An unexpected error occurred while communicating with the Addis Eats order ledger store.
        The server was unable to retrieve raw records or aggregate neighbourhood totals.
      </p>

      {/* Technical error display for evaluation */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #fecdd3",
          borderRadius: "var(--radius-sm)",
          padding: "1rem 1.25rem",
          textAlign: "left",
          maxWidth: 540,
          margin: "0 auto 2rem",
          fontSize: "0.85rem",
          color: "#881337",
          fontFamily: "monospace",
          overflowX: "auto",
        }}
      >
        <strong>Captured Exception:</strong> {error?.message || "Unknown ledger retrieval failure"}
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        {reset ? (
          <button
            type="button"
            onClick={() => reset()}
            className="btn-figma btn-figma--primary"
            style={{ background: "#e11d48", borderColor: "#be123c" }}
          >
            🔄 Try Again (Reset Error Boundary)
          </button>
        ) : (
          <Link
            href="/orders?state=normal"
            className="btn-figma btn-figma--primary"
            style={{ background: "#e11d48", borderColor: "#be123c" }}
          >
            🔄 Clear Error Simulation &rarr; Normal State
          </Link>
        )}
        <Link href="/menu" className="btn-figma btn-figma--outline" style={{ color: "#9f1239" }}>
          Browse Menu Instead
        </Link>
      </div>
    </section>
  );
}
