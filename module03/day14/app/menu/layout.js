/**
 * app/menu/layout.js - Nested layout for the /menu segment
 *
 * Wraps both /menu (the list) and /menu/[id] (the detail).
 * Shared chrome — sub-nav, metadata template — lives here so both
 * child routes inherit it without re-rendering the shell.
 *
 * Rendering: Server Component (no state or interactivity needed).
 */
import Link from "next/link";

export const metadata = {
  title: {
    template: "%s | Addis Eats",
    default: "Menu - Addis Eats",
  },
  description: "Browse authentic Ethiopian food. Mains, breakfast, drinks.",
};

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout">
      {/* Menu-segment sub-nav — shared by /menu and /menu/[id] */}
      <div
        style={{
          borderBottom: "1px solid var(--color-border)",
          background: "rgba(232,160,48,.04)",
          padding: ".6rem 0",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}
        >
          <span
            style={{
              fontSize: ".75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".6px",
              color: "var(--color-text-dim)",
            }}
          >
            Menu
          </span>
          <div style={{ display: "flex", gap: ".75rem" }}>
            <Link
              href="/menu"
              style={{ fontSize: ".875rem", color: "var(--color-text-dim)", textDecoration: "none" }}
            >
              All Dishes
            </Link>
            <Link
              href="/cart"
              style={{ fontSize: ".875rem", color: "var(--color-text-dim)", textDecoration: "none" }}
            >
              🛒 Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Child route — swaps between /menu list and /menu/[id] detail */}
      {children}
    </div>
  );
}
