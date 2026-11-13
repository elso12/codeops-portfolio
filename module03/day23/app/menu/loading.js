/**
 * app/menu/loading.js - Loading UI for the /menu segment
 *
 * Next.js renders this file automatically while the menu page suspends.
 * On slow connections (Slow 3G) this skeleton appears instantly because
 * it is part of the static shell — only the data-dependent children wait.
 *
 * Streaming: the navbar and this skeleton are sent first; the dish grid
 * streams in once the server component resolves.
 */
export default function MenuLoading() {
  return (
    <main className="container">
      <div className="section-header">
        <div
          style={{
            height: "2rem",
            width: "12rem",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-sm)",
            marginBottom: ".75rem",
          }}
        />
        <div
          style={{
            height: "1rem",
            width: "22rem",
            background: "var(--color-surface-2)",
            borderRadius: "var(--radius-sm)",
            maxWidth: "100%",
          }}
        />
      </div>

      {/* Skeleton category filters */}
      <div style={{ display: "flex", gap: ".75rem", marginBottom: "1.5rem" }}>
        {[80, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            style={{
              height: "2rem",
              width: w,
              background: "var(--color-surface-2)",
              borderRadius: "999px",
              animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Skeleton dish cards */}
      <div className="dish-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card"
            style={{ animation: `pulse 1.5s ease-in-out ${i * 0.08}s infinite` }}
          >
            <div
              className="card__img"
              style={{ background: "var(--color-surface-2)", height: 180 }}
            />
            <div className="card__body">
              <div style={{ height: ".75rem", width: "4rem", background: "var(--color-surface-2)", borderRadius: "999px", marginBottom: ".75rem" }} />
              <div style={{ height: "1.25rem", width: "70%", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", marginBottom: ".5rem" }} />
              <div style={{ height: ".875rem", width: "90%", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", marginBottom: ".4rem" }} />
              <div style={{ height: ".875rem", width: "60%", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }} />
              <div style={{ height: "2.25rem", background: "var(--color-surface-2)", borderRadius: "var(--radius-sm)" }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .45; }
        }
      `}</style>
    </main>
  );
}
