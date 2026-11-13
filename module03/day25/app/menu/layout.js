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
          borderBottom: "1px solid var(--border-color)",
          background: "rgba(184, 122, 24, 0.05)",
          padding: ".75rem 0",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", padding: "0 1.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <span
              style={{
                fontSize: ".75rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                color: "var(--color-paprika)",
                background: "var(--bg-surface-sand)",
                padding: "0.2rem 0.6rem",
                borderRadius: "var(--radius-pill)",
              }}
            >
              BANQUET CATALOG
            </span>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link
                href="/menu"
                style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--text-main)", textDecoration: "none" }}
              >
                All Offerings
              </Link>
              <Link
                href="/offers"
                style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--color-turmeric)", textDecoration: "none" }}
              >
                Special Feasts ✨
              </Link>
            </div>
          </div>
          <Link
            href="/cart"
            style={{ fontSize: ".875rem", fontWeight: 600, color: "var(--color-paprika)", textDecoration: "none" }}
          >
            🛒 View Mesob Basket &rarr;
          </Link>
        </div>
      </div>

      {/* Child route — swaps between /menu list and /menu/[id] detail */}
      {children}
    </div>
  );
}
