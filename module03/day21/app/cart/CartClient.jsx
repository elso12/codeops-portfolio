"use client";

import { useCart } from "@/components/CartContext";
import Link from "next/link";

export default function CartClient() {
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal, isMounted } = useCart();

  if (!isMounted) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
        <div
          className="spinner"
          style={{
            width: "2rem",
            height: "2rem",
            borderColor: "var(--color-paprika)",
            borderTopColor: "transparent",
            margin: "0 auto 1rem",
          }}
        />
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem" }}>
          Loading your Mesob dining basket...
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <span className="emoji">🧺</span>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2.2rem",
            marginBottom: "0.5rem",
            color: "var(--text-main)",
          }}
        >
          Your Mesob Basket is Empty
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "2rem",
            maxWidth: "460px",
            margin: "0 auto 2rem",
            fontSize: "1.05rem",
          }}
        >
          You haven&apos;t added any authentic Habesha dishes yet. Browse our slow-cooked wats,
          sizzling tibs, and breakfast firfir.
        </p>
        <Link
          href="/menu"
          className="btn-figma btn-figma--primary"
          style={{ padding: "0.85rem 2.2rem" }}
        >
          Browse the Banquet Menu &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {items.map((item) => (
          <div
            key={item.dish.id}
            className="card"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1.5rem 1.75rem",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: "1.25rem",
            }}
          >
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  margin: "0 0 0.35rem 0",
                  fontSize: "1.3rem",
                  color: "var(--text-main)",
                }}
              >
                {item.dish.name}
              </h3>
              <div className="price" style={{ fontSize: "1.2rem" }}>
                {item.dish.price} <span className="price-currency">ETB each</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-pill)",
                  overflow: "hidden",
                  background: "var(--bg-surface-sand)",
                }}
              >
                <button
                  onClick={() => updateQuantity(item.dish.id, -1)}
                  style={{
                    padding: "0.45rem 0.95rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-main)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span
                  style={{
                    padding: "0 0.75rem",
                    minWidth: "2.2rem",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.dish.id, 1)}
                  style={{
                    padding: "0.45rem 0.95rem",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-main)",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 800,
                  fontSize: "1.25rem",
                  color: "var(--color-paprika)",
                  minWidth: "85px",
                  textAlign: "right",
                }}
              >
                {item.dish.price * item.quantity}{" "}
                <small style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>ETB</small>
              </div>

              <button
                onClick={() => removeFromCart(item.dish.id)}
                className="btn-figma btn-figma--danger btn-figma--sm"
                aria-label="Remove item"
                title="Remove dish"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: "2.25rem", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "1.3rem",
                fontWeight: 800,
                fontFamily: "var(--font-serif)",
                color: "var(--text-main)",
              }}
            >
              Total Banquet Value
            </span>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
              Includes complimentary sourdough teff injera rolls
            </p>
          </div>
          <span className="price" style={{ fontSize: "2.4rem" }}>
            {cartTotal} <span className="price-currency" style={{ fontSize: "1rem" }}>ETB</span>
          </span>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: "1.5rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/checkout"
            className="btn-figma btn-figma--primary"
            style={{ flex: 1, justifyContent: "center", padding: "0.9rem" }}
          >
            Proceed to Fast Checkout &rarr;
          </Link>
          <button onClick={clearCart} className="btn-figma btn-figma--sand">
            Clear Basket
          </button>
        </div>
      </div>

      <div className="notice">
        <strong>Rendering Strategy: Client</strong> — This cart executes in the browser using React Context &amp; localStorage. Items persist across all pages.
      </div>
    </div>
  );
}
