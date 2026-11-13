import { redirect } from "next/navigation";
import { getAllOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function TrackIndexPage() {
  const orders = getAllOrders();
  const activeOrder = orders.find((o) => o.status !== "completed") || orders[0];
  const targetId = activeOrder?.id || "ord_001";
  redirect(`/track/${targetId}`);
}
