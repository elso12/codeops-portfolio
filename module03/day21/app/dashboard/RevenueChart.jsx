"use client";
import RevenueBarChart from "@/components/dashboard/RevenueBarChart";

/**
 * app/dashboard/RevenueChart.jsx
 * "use client" — the only client code on the page (Slide 11, 28)
 *
 * Requirements:
 * - Fixed-height container (Slide 12)
 * - Formatted in ETB with real labels (Slide 13)
 * - Readable without colour (Slide 8)
 * - Zero baseline (Slide 8)
 * - Accompanied by the numbers in an accessible HTML table beneath it (Slide 14)
 */
export default function RevenueChart({ data, currency = "ETB" }) {
  return <RevenueBarChart data={data} currency={currency} />;
}
