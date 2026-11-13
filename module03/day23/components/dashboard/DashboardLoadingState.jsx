import Link from "next/link";

/**
 * DashboardLoadingState
 *
 * Requirements:
 * 1. Loading state written and demonstrable on demand.
 * 2. Fixed-height skeleton containers matching live charts to preserve 0.000 CLS.
 * 3. Semantic loading markup with accessible announcements.
 */
export default function DashboardLoadingState({ forced = false }) {
  return (
    <div
      className="dashboard-loading-view"
      aria-busy="true"
      aria-live="polite"
      style={{ opacity: 0.95 }}
    >
      <div className="sr-only">Loading Addis Eats Dashboard data and aggregating metrics...</div>

      {/* Metrics Row Skeleton */}
      <div
        className="metrics-row"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`metric-skel-${i}`}
            className="chart-card skeleton-pulse"
            style={{
              height: "105px",
              padding: "1.25rem",
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              style={{
                width: "45%",
                height: "14px",
                background: "rgba(0,0,0,0.08)",
                borderRadius: "4px",
                marginBottom: "0.75rem",
              }}
            />
            <div
              style={{
                width: "70%",
                height: "26px",
                background: "rgba(0,0,0,0.12)",
                borderRadius: "4px",
              }}
            />
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton (Fixed Height guarantees 0.000 CLS) */}
      <div
        className="charts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(440px, 1fr))",
          gap: "1.75rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Revenue Bar Chart Skeleton (Height: 380px) */}
        <div
          className="chart-card skeleton-pulse"
          style={{
            height: "380px",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <div
                style={{
                  width: "180px",
                  height: "20px",
                  background: "rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                style={{
                  width: "240px",
                  height: "14px",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                width: "110px",
                height: "32px",
                background: "rgba(0,0,0,0.08)",
                borderRadius: "6px",
              }}
            />
          </div>

          {/* Pulsing Bar Placeholders starting from zero baseline */}
          <div
            style={{
              height: "240px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-around",
              borderBottom: "2px solid #1f1916",
              paddingBottom: "10px",
            }}
          >
            {[45, 80, 60, 95, 30, 70].map((h, idx) => (
              <div
                key={`bar-skel-${idx}`}
                style={{
                  width: "42px",
                  height: `${h}%`,
                  background: "linear-gradient(180deg, rgba(143, 42, 21, 0.4) 0%, rgba(143, 42, 21, 0.15) 100%)",
                  borderRadius: "4px 4px 0 0",
                  border: "1px dashed rgba(143, 42, 21, 0.3)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Timeline Line Chart Skeleton (Height: 380px) */}
        <div
          className="chart-card skeleton-pulse"
          style={{
            height: "380px",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-color)",
            padding: "1.5rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <div
                style={{
                  width: "200px",
                  height: "20px",
                  background: "rgba(0,0,0,0.1)",
                  borderRadius: "4px",
                  marginBottom: "0.5rem",
                }}
              />
              <div
                style={{
                  width: "260px",
                  height: "14px",
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div
              style={{
                width: "110px",
                height: "32px",
                background: "rgba(0,0,0,0.08)",
                borderRadius: "6px",
              }}
            />
          </div>

          <div
            style={{
              height: "240px",
              borderBottom: "2px solid #1f1916",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ textAlign: "center", color: "var(--text-dim)" }}>
              <span className="spinner-dots" style={{ fontSize: "1.5rem" }}>
                ⏳
              </span>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Streaming live order timeline aggregates...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div
        className="chart-card skeleton-pulse"
        style={{
          background: "var(--bg-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          padding: "1.75rem",
        }}
      >
        <div
          style={{
            width: "300px",
            height: "22px",
            background: "rgba(0,0,0,0.1)",
            borderRadius: "4px",
            marginBottom: "1.25rem",
          }}
        />
        {[1, 2, 3, 4, 5, 6].map((rowIdx) => (
          <div
            key={`row-skel-${rowIdx}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1.5fr 1fr 1fr 1fr",
              gap: "1rem",
              padding: "0.85rem 0",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ height: "16px", background: "rgba(0,0,0,0.08)", borderRadius: "3px" }} />
            <div style={{ height: "16px", background: "rgba(0,0,0,0.06)", borderRadius: "3px" }} />
            <div style={{ height: "16px", background: "rgba(0,0,0,0.06)", borderRadius: "3px" }} />
            <div style={{ height: "16px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }} />
            <div style={{ height: "16px", background: "rgba(0,0,0,0.08)", borderRadius: "3px" }} />
            <div style={{ height: "16px", background: "rgba(0,0,0,0.1)", borderRadius: "3px" }} />
          </div>
        ))}
      </div>

      {forced && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link href="/orders?state=normal" className="btn-figma btn-figma--primary">
            Exit Loading Simulation &rarr; Return to Normal State
          </Link>
        </div>
      )}
    </div>
  );
}
