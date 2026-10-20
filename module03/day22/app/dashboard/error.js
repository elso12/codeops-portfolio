"use client";
import DashboardErrorState from "@/components/dashboard/DashboardErrorState";

/**
 * app/dashboard/error.js
 * Next.js App Router error boundary leaf for the dashboard segment.
 */
export default function DashboardError({ error, reset }) {
  return (
    <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
        <span className="section-eyebrow">⚠️ SEGMENT EXCEPTION</span>
        <h1 className="section-title-large">Ledger Retrieval Failure</h1>
        <p className="section-sub-centered">
          The server encountered an error while resolving dashboard aggregates.
        </p>
      </div>

      <DashboardErrorState error={error} reset={reset} forced={false} />
    </main>
  );
}
