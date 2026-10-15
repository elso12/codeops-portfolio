"use client";
/**
 * app/cart/page.js - Cart Page (Client Component)
 * 
 * Rendering strategy: CLIENT
 * This page relies entirely on browser state (localStorage) for the cart contents.
 * It cannot be pre-rendered with the user's cart on the server.
 */
import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal, isMounted } = useCart();

  if (!isMounted) return <main className="container"><p>Loading cart...</p></main>;

  if (items.length === 0) {
    return (
      <main className="container" style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
        <h2>Your cart is empty</h2>
        <p style={{ color: "var(--color-text-dim)", marginBottom: "2rem" }}>
          Looks like you haven't added any authentic Habesha dishes yet.
        </p>
        <Link href="/menu" className="btn btn-primary">
          Browse the Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="container" style={{ maxWidth: "800px" }}>
      <div className="section-header">
        <h1>Your Cart</h1>
        <p>Review your items before checkout.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {items.map((item) => (
          <div key={item.dish.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem" }}>
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>{item.dish.name}</h3>
              <div className="price" style={{ fontSize: "1rem" }}>
                {item.dish.price} <span className="price-currency">ETB</span>
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                <button onClick={() => updateQuantity(item.dish.id, -1)} style={{ padding: "0.5rem 0.75rem", background: "var(--color-surface-2)", border: "none", cursor: "pointer", color: "var(--color-text)" }}>-</button>
                <span style={{ padding: "0 0.75rem", minWidth: "2rem", textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.dish.id, 1)} style={{ padding: "0.5rem 0.75rem", background: "var(--color-surface-2)", border: "none", cursor: "pointer", color: "var(--color-text)" }}>+</button>
              </div>
              <button onClick={() => removeFromCart(item.dish.id)} className="btn btn-outline btn-sm" style={{ padding: "0.4rem 0.6rem" }} aria-label="Remove item">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <span style={{ fontSize: "1.1rem" }}>Total</span>
          <span className="price" style={{ fontSize: "1.5rem" }}>
            {cartTotal} <span className="price-currency">ETB</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/checkout" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
            Proceed to Checkout
          </Link>
          <button onClick={clearCart} className="btn btn-outline">
            Clear Cart
          </button>
        </div>
      </div>
      
      <div className="notice">
        <strong>Rendering Strategy: Client</strong> — this page runs entirely in the browser to read the local cart state.
      </div>
    </main>
  );
}
