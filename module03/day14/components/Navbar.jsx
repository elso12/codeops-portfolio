"use client";
import Link from "next/link";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { cartCount, isMounted } = useCart();

  return (
    <nav className="navbar">
      <div className="container navbar__container">
        <Link href="/" className="navbar__brand">
          <span style={{ fontSize: "1.5rem", marginRight: ".5rem" }}>🇪🇹</span>
          Mesob House
        </Link>
        <ul className="navbar__links">
          <li><Link href="/menu">Menu</Link></li>
          <li><Link href="/orders">Orders</Link></li>
          <li>
            <Link href="/cart" style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
              🛒 Cart
              {isMounted && cartCount > 0 && (
                <span style={{
                  background: "var(--color-accent)",
                  color: "#0d0f0f",
                  padding: "0.1rem 0.5rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
