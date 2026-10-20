"use client";
import DashboardErrorState from "@/components/dashboard/DashboardErrorState";

export default function OrdersErrorBoundary({ error, reset }) {
  return (
    <main className="container" style={{ maxWidth: 900, paddingBottom: "4rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
        <span className="section-eyebrow">ስህተት • CLIENT ERROR BOUNDARY</span>
        <h1 className="section-title-large">Ledger Retrieval Error</h1>
        <p className="section-sub-centered">
          The server encountered an exception while retrieving or aggregating order data.
        </p>
      </div>

      <DashboardErrorState error={error} reset={reset} forced={false} />
    </main>
  );
}
