/**
 * app/checkout/page.js — Checkout page shell (Server Component)
 *
 * Reads the dish list server-side and passes it as serialisable props to the
 * client component. Functions cannot cross the boundary; data can.
 *
 * Pre-selects a dish when ?dishId= is in the URL.
 */
import { getDishes } from "@/lib/data";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "Checkout | Mesob House Restaurant",
  description: "Place your Addis Eats · Mesob House order. Fast, warm delivery across Addis Ababa.",
};

export default async function CheckoutPage({ searchParams }) {
  const { dishId } = await searchParams;
  // Serialisable data — safe to pass as props to a client component
  const dishes = getDishes().map(({ id, name, price, currency, category }) => ({
    id, name, price, currency, category,
  }));

  return (
    <main className="container" style={{ maxWidth: 660 }}>
      <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span style={{
          display: "inline-block",
          fontSize: "0.85rem",
          fontWeight: 700,
          color: "var(--color-turmeric)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "0.35rem"
        }}>
          ትዕዛዝ ማረጋገጫ · Fast Kitchen Delivery
        </span>
        <h1>Place Your Order</h1>
        <p>Enter your contact details and location for piping hot delivery.</p>
      </div>
      <CheckoutForm dishes={dishes} preselectedDishId={dishId ?? ""} />
    </main>
  );
}
