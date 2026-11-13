import OrderTable from "@/components/dashboard/OrderTable";

/**
 * app/orders/OrderTable.jsx (Server Component)
 *
 * Requirements (Slide 16, 28):
 * - Built from real table markup: table, thead, tbody, tfoot, th scope="col", th scope="row", caption
 * - Right-aligned numbers for totals and currency
 * - Sorting in the URL via searchParams with aria-sort
 * - Paging using Next.js Link elements
 * - No client JavaScript required for read-only table rendering
 */
export default OrderTable;
export { OrderTable };
