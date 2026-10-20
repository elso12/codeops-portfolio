/**
 * app/checkout/page.js — Checkout page shell (Server Component)
 *
 * Security Layers:
 * 1. Edge Middleware: Intercepts unsigned visitors and redirects to /login?next=/checkout
 * 2. Server Component Render Check: getSession() executes during SSR (Defense in depth)
 * 3. Server Action Authentication: placeOrder() binds the record to session.id
 */
import { getDishes } from "@/lib/data";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Secure Express Checkout & Platter Ordering",
  description:
    "Confirm your delivery location in Addis Ababa, customize cooking preferences, and place your warm Mesob House banquet order.",
  alternates: {
    canonical: "/checkout",
  },
};

export default async function CheckoutPage({ searchParams }) {
  // Layer 2: Render-time authentication check (defense-in-depth)
  const user = await getSession();
  if (!user) {
    redirect("/login?next=/checkout");
  }

  const resolvedParams = await searchParams;
  const dishId = resolvedParams?.dishId;

  // Serialisable data — safe to pass as props to client component
  const dishes = getDishes().map(({ id, name, price, currency, category }) => ({
    id,
    name,
    price,
    currency,
    category,
  }));

  return (
    <main className="container" style={{ maxWidth: 660, paddingBottom: "4rem" }}>
      <div className="section-header" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <span
          style={{
            display: "inline-block",
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--color-turmeric)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "0.35rem",
          }}
        >
          ትዕዛዝ ማረጋገጫ · Fast Kitchen Delivery
        </span>
        <h1>Place Your Order</h1>
        <p>
          Ordering as <strong style={{ color: "var(--color-paprika)" }}>{user.name}</strong>{" "}
          (<code>{user.id}</code>)
        </p>
      </div>
      <CheckoutForm
        dishes={dishes}
        preselectedDishId={dishId ?? ""}
        userName={user.name}
      />
    </main>
  );
}
