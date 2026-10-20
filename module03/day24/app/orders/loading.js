import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";

export default function OrdersLoading() {
  return (
    <main className="container" style={{ maxWidth: 1200, paddingBottom: "4rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
        <span className="section-eyebrow">የእኔ ትዕዛዞች • STREAMING SUSPENSE</span>
        <h1 className="section-title-large">Loading Addis Eats Dashboard...</h1>
        <p className="section-sub-centered">
          Aggregating neighbourhood revenue curves and customer orders ledger...
        </p>
      </div>

      <DashboardLoadingState forced={false} />
    </main>
  );
}
