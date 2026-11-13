import {
  getOrdersByUser,
  getAllOrders,
  aggregateDashboardData,
  paginateAndSortOrders,
} from "@/lib/data";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevenueChart from "./RevenueChart";
import OrdersLineChart from "@/components/dashboard/OrdersLineChart";
import OrderTable from "@/app/orders/OrderTable";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import DashboardErrorState from "@/components/dashboard/DashboardErrorState";
import StateSwitcher from "@/components/dashboard/StateSwitcher";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Addis Eats Dashboard · Data Representation & Operational Ledger",
  description:
    "Addis Eats analytics dashboard: revenue by neighbourhood bar chart, orders over time line chart, and accessible paginated order ledger.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default async function DashboardPage({ searchParams }) {
  const resolvedParams = searchParams ? await searchParams : {};
  const page = resolvedParams.page || "1";
  const sort = resolvedParams.sort || "createdAt";
  const order = resolvedParams.order || "desc";
  const state = resolvedParams.state || "normal";
  const view = resolvedParams.view || "auto";

  // Verify session at render time
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  // --- DEMONSTRATION OF FORCED STATES ON DEMAND ---
  if (state === "loading") {
    return (
      <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
        <StateSwitcher currentState="loading" basePath="/dashboard" params={{ sort, order, page }} />
        <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
          <span className="section-eyebrow">⏳ FORCED LOADING STATE DEMONSTRATION</span>
          <h1 className="section-title-large">Streaming Dashboard Aggregates...</h1>
          <p className="section-sub-centered">
            Demonstrating fixed-height skeleton screens guaranteeing 0.000 Cumulative Layout Shift (CLS).
          </p>
        </div>
        <DashboardLoadingState forced={true} />
      </main>
    );
  }

  if (state === "error") {
    return (
      <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
        <StateSwitcher currentState="error" basePath="/dashboard" params={{ sort, order, page }} />
        <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
          <span className="section-eyebrow">⚠️ FORCED ERROR STATE DEMONSTRATION</span>
          <h1 className="section-title-large">Ledger Retrieval Error</h1>
          <p className="section-sub-centered">
            Demonstrating resilient recovery UI and accessibility attributes (role=&quot;alert&quot;) on exception.
          </p>
        </div>
        <DashboardErrorState
          forced={true}
          error={{ message: "Simulated Addis Eats Ledger DB Timeout (HTTP 500)" }}
        />
      </main>
    );
  }

  if (state === "empty") {
    return (
      <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
        <StateSwitcher currentState="empty" basePath="/dashboard" params={{ sort, order, page }} />
        <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
          <span className="section-eyebrow">📭 FORCED EMPTY STATE DEMONSTRATION</span>
          <h1 className="section-title-large">Empty Hearth Ledger</h1>
          <p className="section-sub-centered">
            Demonstrating brand-new customer view when zero orders have been recorded.
          </p>
        </div>
        <DashboardEmptyState user={user} forced={true} />
      </main>
    );
  }

  // Scoped Data Query
  const isStaff = user.role === "staff";
  const showAllOrders = isStaff && view !== "personal";
  const userOrders = getOrdersByUser(user.id);
  const ordersPool = showAllOrders ? getAllOrders() : userOrders;

  // Natural Empty State: Brand-new customer with 0 orders
  if (ordersPool.length === 0) {
    return (
      <main className="container" style={{ maxWidth: 1220, paddingBottom: "4rem" }}>
        <StateSwitcher currentState="normal" basePath="/dashboard" params={{ sort, order, page }} />
        <div className="section-header-centered" style={{ marginBottom: "2rem" }}>
          <span className="section-eyebrow">የአዲስ አበባ ዳሽቦርድ • AUTHENTICATED REALM</span>
          <h1 className="section-title-large">The Addis Eats Dashboard</h1>
          <p className="section-sub-centered">
            Signed in as <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>{" "}
            ({user.role}) •{" "}
            <span style={{ fontFamily: "monospace", fontSize: ".85rem", color: "var(--text-dim)" }}>
              Session ID: {user.id}
            </span>
          </p>
        </div>
        <DashboardEmptyState user={user} forced={false} />
      </main>
    );
  }

  // 1. Server-side Aggregation (Slide 9): ONLY summarised rows cross the boundary!
  const aggregatedData = aggregateDashboardData(ordersPool);

  // 2. Server-side Sorting and Pagination (Slide 18, 22): ONLY current page rows cross!
  const paginationResult = paginateAndSortOrders(ordersPool, {
    page,
    pageSize: 6,
    sort,
    order,
  });

  return (
    <main className="container" style={{ maxWidth: 1220, paddingBottom: "5rem" }}>
      {/* Interactive Demonstration Toolbar */}
      <StateSwitcher
        currentState="normal"
        basePath="/dashboard"
        params={{ sort, order, page, view: showAllOrders ? "all" : "personal" }}
      />

      {/* Header with Account Context & Staff Toggle */}
      <div
        className="dashboard-hero-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "1.5rem",
          marginBottom: "2.5rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div>
          <span className="section-eyebrow">የአዲስ አበባ ዳሽቦርድ • OPERATIONAL LEDGER</span>
          <h1 className="section-title-large" style={{ margin: "0.25rem 0" }}>
            The Addis Eats Dashboard
          </h1>
          <p className="section-sub" style={{ margin: 0 }}>
            Signed in as <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>{" "}
            ({user.role}) •{" "}
            <span style={{ fontFamily: "monospace", fontSize: ".85rem", color: "var(--text-dim)" }}>
              Session: {user.id}
            </span>
          </p>
        </div>

        {/* Staff Overview Toggle */}
        {isStaff && (
          <div
            className="scope-toggle-pills"
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              padding: "4px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.82rem",
            }}
          >
            <Link
              href={`/dashboard?view=all&sort=${sort}&order=${order}`}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                fontWeight: showAllOrders ? 800 : 500,
                background: showAllOrders ? "var(--color-paprika)" : "transparent",
                color: showAllOrders ? "#ffffff" : "var(--text-main)",
                textDecoration: "none",
              }}
            >
              All Restaurant Orders ({getAllOrders().length})
            </Link>
            <Link
              href={`/dashboard?view=personal&sort=${sort}&order=${order}`}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-pill)",
                fontWeight: !showAllOrders ? 800 : 500,
                background: !showAllOrders ? "var(--color-paprika)" : "transparent",
                color: !showAllOrders ? "#ffffff" : "var(--text-main)",
                textDecoration: "none",
              }}
            >
              My Scoped Orders ({userOrders.length})
            </Link>
          </div>
        )}
      </div>

      {/* KPI Overview Metrics Cards */}
      <div
        className="kpi-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        <div className="chart-card" style={{ padding: "1.25rem 1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>
            Total Revenue
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--color-paprika)", marginTop: "0.35rem" }}>
            {aggregatedData.totalRevenue.toLocaleString()} <span style={{ fontSize: "1rem" }}>ETB</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Across {aggregatedData.neighbourhoodCount} active neighbourhoods
          </span>
        </div>

        <div className="chart-card" style={{ padding: "1.25rem 1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>
            Total Orders
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--text-main)", marginTop: "0.35rem" }}>
            {aggregatedData.totalOrders} <span style={{ fontSize: "1rem" }}>Orders</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            {aggregatedData.ordersPerDay.length} recorded service days
          </span>
        </div>

        <div className="chart-card" style={{ padding: "1.25rem 1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>
            Average Order Value
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--color-turmeric)", marginTop: "0.35rem" }}>
            {aggregatedData.averageOrderValue.toLocaleString()} <span style={{ fontSize: "1rem" }}>ETB</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            Per completed dining order
          </span>
        </div>

        <div className="chart-card" style={{ padding: "1.25rem 1.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 700 }}>
            Network Boundary Rows
          </span>
          <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--color-forest)", marginTop: "0.35rem" }}>
            {aggregatedData.revenueByNeighbourhood.length + aggregatedData.ordersPerDay.length + paginationResult.items.length}{" "}
            <span style={{ fontSize: "1rem" }}>Summaries</span>
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.25rem" }}>
            vs 4,000+ raw unaggregated rows
          </span>
        </div>
      </div>

      {/* SECTION 2: Visual Charts (Client Leaves on Server Page) */}
      <div
        className="charts-dual-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))",
          gap: "2rem",
          marginBottom: "3.5rem",
        }}
      >
        {/* Requirement 2: Revenue Bar Chart (Recharts / SVG Leaf with Zero Baseline, ETB Ticks) */}
        <div>
          <RevenueChart
            data={aggregatedData.revenueByNeighbourhood}
            currency="ETB"
          />
        </div>

        {/* Requirement 3: Orders Line Chart (Range & Unit Named in Heading, Zero Baseline) */}
        <div>
          <OrdersLineChart
            data={aggregatedData.ordersPerDay}
            range={aggregatedData.range}
          />
        </div>
      </div>

      {/* SECTION 3: Semantic Order Table with Sorting & Paging */}
      <section aria-labelledby="orders-ledger-heading">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <h2 id="orders-ledger-heading" className="section-title" style={{ margin: "0 0 0.25rem" }}>
              Operational Orders Ledger
            </h2>
            <p className="section-sub" style={{ margin: 0, fontSize: "0.9rem" }}>
              Full semantic HTML markup with right-aligned totals, URL-driven sorting, and Link pagination.
            </p>
          </div>
        </div>

        <OrderTable
          orders={paginationResult.items}
          pagination={paginationResult}
          basePath="/dashboard"
          extraParams={{
            view: showAllOrders ? "all" : undefined,
          }}
        />
      </section>
    </main>
  );
}
