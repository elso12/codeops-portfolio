import Link from "next/link";

/**
 * OrderTable
 *
 * Requirements:
 * 1. Real semantic markup: table, caption, thead, th with scope="col", tbody, tr, th with scope="row", td.
 * 2. Right-aligned totals: header and cells right-aligned, formatted cleanly in ETB.
 * 3. Sorting via searchParams:
 *    - aria-sort="ascending" or aria-sort="descending" on active column header.
 *    - aria-sort="none" on other sortable headers.
 * 4. Paging with Link elements:
 *    - Allows linking directly to page 3 sorted by total (?page=3&sort=total&order=desc).
 * 5. Spreadsheet copyable:
 *    - Survives being copied into a spreadsheet (clean tabular semantics without flex/div table hacks).
 */
export default function OrderTable({
  orders = [],
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    pageSize: 6,
    startIndex: 1,
    endIndex: 6,
    sort: "createdAt",
    order: "desc",
  },
  basePath = "/orders",
  extraParams = {},
}) {
  const { currentPage, totalPages, totalOrders, pageSize, startIndex, endIndex, sort, order } =
    pagination;

  // Build URL helper preserving active query parameters
  const createQueryUrl = (newParams) => {
    const params = new URLSearchParams();

    // Preserve any existing state/filter parameters
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.set(k, String(v));
      }
    });

    // Default or passed sort/order/page
    const currentSort = newParams.sort ?? sort;
    const currentOrder = newParams.order ?? order;
    const currentPageNum = newParams.page ?? currentPage;

    if (currentSort) params.set("sort", currentSort);
    if (currentOrder) params.set("order", currentOrder);
    if (currentPageNum && currentPageNum !== 1) params.set("page", String(currentPageNum));

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  // Helper for sortable column headers
  const renderSortableHeader = (columnKey, label, align = "left") => {
    const isActive = sort === columnKey;
    const nextOrder = isActive && order === "desc" ? "asc" : "desc";
    const ariaSortValue = isActive
      ? order === "asc"
        ? "ascending"
        : "descending"
      : "none";

    const sortIndicator = isActive ? (order === "asc" ? " ▲" : " ▼") : " ⇅";

    return (
      <th
        scope="col"
        aria-sort={ariaSortValue}
        style={{
          textAlign: align,
          userSelect: "none",
          padding: "0.85rem 1rem",
        }}
        className={isActive ? "th--sorted" : ""}
      >
        <Link
          href={createQueryUrl({ sort: columnKey, order: nextOrder, page: 1 })}
          className="sort-header-link"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: isActive ? "var(--color-paprika)" : "var(--text-main)",
            fontWeight: 700,
            textDecoration: "none",
            justifyContent: align === "right" ? "flex-end" : "flex-start",
          }}
          title={`Sort by ${label} (${isActive && order === "desc" ? "ascending" : "descending"})`}
        >
          <span>{label}</span>
          <span
            aria-hidden="true"
            style={{
              fontSize: "0.75rem",
              opacity: isActive ? 1 : 0.45,
            }}
          >
            {sortIndicator}
          </span>
        </Link>
      </th>
    );
  };

  return (
    <div className="order-table-container">
      <div className="order-table-scroll-wrapper">
        <table className="dashboard-order-table" id="orders-accessible-table">
          <caption className="table-caption-semantic">
            Customer Orders Ledger — Showing {startIndex} to {endIndex} of {totalOrders} total
            records (Sorted by {sort} {order})
          </caption>
          <thead>
            <tr>
              {renderSortableHeader("id", "Order ID")}
              {renderSortableHeader("createdAt", "Date & Time")}
              {renderSortableHeader("customerName", "Customer")}
              {renderSortableHeader("area", "Neighbourhood")}
              {renderSortableHeader("dish", "Dish")}
              {renderSortableHeader("quantity", "Qty", "right")}
              {renderSortableHeader("status", "Status")}
              {renderSortableHeader("total", "Total (ETB)", "right")}
              <th scope="col" style={{ textAlign: "center", padding: "0.85rem 1rem" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                  No orders match the current sort or page parameters.
                </td>
              </tr>
            ) : (
              orders.map((orderItem) => {
                const dateObj = new Date(orderItem.createdAt);
                const dateFormatted = !isNaN(dateObj.getTime())
                  ? dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) +
                    " " +
                    dateObj.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : orderItem.createdAt;

                return (
                  <tr key={orderItem.id} className="order-row-tr">
                    {/* th with scope="row" for accessible table semantics */}
                    <th scope="row" className="order-cell-id" style={{ fontWeight: 700, fontFamily: "monospace" }}>
                      {orderItem.id}
                    </th>
                    <td className="order-cell-date" style={{ whiteSpace: "nowrap", color: "var(--text-muted)" }}>
                      {dateFormatted}
                    </td>
                    <td className="order-cell-customer">
                      <span style={{ fontWeight: 600 }}>{orderItem.customerName}</span>
                      <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-dim)" }}>
                        {orderItem.phone}
                      </span>
                    </td>
                    <td className="order-cell-area">
                      <span className="neighbourhood-tag">📍 {orderItem.area}</span>
                    </td>
                    <td className="order-cell-dish">
                      <span style={{ fontWeight: 600 }}>{orderItem.dish?.name || "Habesha Feast"}</span>
                    </td>
                    <td
                      className="order-cell-qty"
                      style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}
                    >
                      {orderItem.quantity}
                    </td>
                    <td className="order-cell-status">
                      <span
                        className={`badge badge-${
                          orderItem.status === "cancelled"
                            ? "cancelled"
                            : orderItem.status === "pending"
                            ? "pending"
                            : orderItem.status === "preparing"
                            ? "preparing"
                            : "success"
                        }`}
                      >
                        {orderItem.status}
                      </span>
                    </td>
                    {/* Right-aligned totals with tabular numbers for spreadsheet precision */}
                    <td
                      className="order-cell-total"
                      style={{
                        textAlign: "right",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 700,
                        color: "var(--text-main)",
                      }}
                    >
                      ETB {Number(orderItem.total).toFixed(2)}
                    </td>
                    <td className="order-cell-action" style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                      <Link
                        href={`/orders/${orderItem.id}`}
                        className="btn-link"
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          color: "var(--color-paprika)",
                        }}
                      >
                        Track &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: "rgba(0, 0, 0, 0.02)", borderTop: "2px solid var(--border-color)" }}>
              <th scope="row" colSpan={5} style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                Page {currentPage} Subtotal ({orders.length} orders on this page)
              </th>
              <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>
                {orders.reduce((sum, o) => sum + (Number(o.quantity) || 0), 0)}
              </td>
              <td></td>
              {/* Right-aligned footer total */}
              <td
                style={{
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 800,
                  color: "var(--color-paprika)",
                  fontSize: "1.05rem",
                }}
              >
                ETB {orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0).toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination Controls built exclusively with Next.js Link Elements */}
      {totalPages > 1 && (
        <nav
          className="order-pagination"
          aria-label="Order history pages navigation"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1.5rem",
            padding: "0.75rem 0",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div className="pagination-info" style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of{" "}
            <strong>{totalOrders}</strong> total orders • Page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </div>

          <div
            className="pagination-controls"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            {/* Previous Page Link */}
            {currentPage > 1 ? (
              <Link
                href={createQueryUrl({ page: currentPage - 1 })}
                className="btn-figma btn-figma--outline btn-sm"
                aria-label="Go to previous page"
              >
                &larr; Previous
              </Link>
            ) : (
              <span
                className="btn-figma btn-figma--outline btn-sm btn--disabled"
                aria-disabled="true"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                &larr; Previous
              </span>
            )}

            {/* Page Number Links with Link elements */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isCurrent = pageNum === currentPage;
              return (
                <Link
                  key={`page-link-${pageNum}`}
                  href={createQueryUrl({ page: pageNum })}
                  className={`pagination-num-link ${isCurrent ? "pagination-num-link--active" : ""}`}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={isCurrent ? "page" : undefined}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "36px",
                    height: "36px",
                    padding: "0 8px",
                    borderRadius: "var(--radius-sm)",
                    fontWeight: isCurrent ? 800 : 600,
                    fontSize: "0.88rem",
                    background: isCurrent ? "var(--color-paprika)" : "var(--bg-surface)",
                    color: isCurrent ? "#ffffff" : "var(--text-main)",
                    border: `1px solid ${isCurrent ? "var(--color-paprika)" : "var(--border-color)"}`,
                    textDecoration: "none",
                  }}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* Next Page Link */}
            {currentPage < totalPages ? (
              <Link
                href={createQueryUrl({ page: currentPage + 1 })}
                className="btn-figma btn-figma--outline btn-sm"
                aria-label="Go to next page"
              >
                Next &rarr;
              </Link>
            ) : (
              <span
                className="btn-figma btn-figma--outline btn-sm btn--disabled"
                aria-disabled="true"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              >
                Next &rarr;
              </span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
