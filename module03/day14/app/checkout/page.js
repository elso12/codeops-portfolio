/**
 * app/checkout/page.js — Checkout page shell (Server Component)
 *
 * Reads the dish list server-side and passes it as serialisable props to the
 * client component.  Functions cannot cross the boundary; data can.
 *
 * Pre-selects a dish when ?dishId= is in the URL.
 */
import { getDishes } from "@/lib/data";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout — Addis Eats",
  description: "Place your Addis Eats order. Fast delivery anywhere in Addis Ababa.",
};

export default async function CheckoutPage({ searchParams }) {
  const { dishId } = await searchParams;
  // Serialisable data — safe to pass as props to a client component
  const dishes = getDishes().map(({ id, name, price, currency, category }) => ({
    id, name, price, currency, category,
  }));

  return (
    <main className="container" style={{ maxWidth: 640 }}>
      <div className="section-header" style={{ textAlign: "center" }}>
        <h1>Place Your Order</h1>
        <p>Fill in your details and we'll have it there in 30 minutes.</p>
      </div>
      <CheckoutForm dishes={dishes} preselectedDishId={dishId ?? ""} />
    </main>
  );
}
