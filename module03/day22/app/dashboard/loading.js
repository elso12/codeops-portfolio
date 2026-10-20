import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

/**
 * app/dashboard/loading.js (Slide 24)
 * Streaming suspense skeleton matching the layout shape to prevent CLS.
 */
export default function DashboardLoading() {
  return (
    <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
        <span className="section-eyebrow">የአዲስ አበባ ዳሽቦርድ • STREAMING SUSPENSE</span>
        <h1 className="section-title-large">Loading Addis Eats Dashboard...</h1>
        <p className="section-sub-centered">
          Aggregating neighbourhood revenue curves and customer orders ledger...
        </p>
      </div>

      <DashboardLoadingState forced={false} />
    </main>
  );
}
