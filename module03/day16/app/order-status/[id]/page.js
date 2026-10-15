import { redirect } from "next/navigation";

export default async function OrderStatusRedirect({ params }) {
  const { id } = await params;
  redirect(`/orders/${id}`);
}
