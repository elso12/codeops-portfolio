/**
 * app/cart/page.js - Cart Page Shell (Server Component)
 *
 * Provides human-readable route metadata and canonical link,
 * with server-rendered semantic heading structure.
 */
import CartClient from "./CartClient";

export const metadata = {
  title: "Cart",
  description:
    "Review your selected Habesha platters, slow-cooked wats, and ceremonial beverages before placing your order.",
  alternates: {
    canonical: "/cart",
  },
};

export default function CartPage() {
  return (
    <main className="container" style={{ maxWidth: "860px" }}>
      <div className="section-header-centered" style={{ marginBottom: "2.5rem" }}>
        <span className="section-eyebrow">የቅርጫት እቃዎች · SELECTED FEASTS</span>
        <h1 className="section-title-large">Your Mesob Dining Cart</h1>
        <p className="section-sub-centered">
          Review your communal platters before confirming delivery or dine-in service.
        </p>
      </div>
      <CartClient />
    </main>
  );
}
