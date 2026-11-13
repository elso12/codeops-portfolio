"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { signOut } from "@/app/actions";

export default function Navbar({ session }) {
  const pathname = usePathname();
  const { cartCount, isMounted } = useCart();

  const isActive = (path) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="navbar-figma">
      <div className="navbar-figma__inner">
        <Link href="/" className="navbar-brand">
          <span className="navbar-brand__badge">መሶብ</span>
          <div className="navbar-brand__text">
            <span className="brand-name">Mesob House</span>
            <span className="brand-sub">Habesha Hearth &amp; Dining</span>
          </div>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="navbar-nav">
            <li>
              <Link href="/" className={`nav-link ${isActive("/") ? "nav-link--active" : ""}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/menu" className={`nav-link ${isActive("/menu") ? "nav-link--active" : ""}`}>
                Menu
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className={`nav-link ${isActive("/orders") || isActive("/dashboard") ? "nav-link--active" : ""}`}
              >
                📊 Dashboard
              </Link>
            </li>

            {/* Staff-only route navigation */}
            {session?.role === "staff" && (
              <li>
                <Link
                  href="/kitchen"
                  className={`nav-link ${isActive("/kitchen") ? "nav-link--active" : ""}`}
                  style={{ color: "var(--color-turmeric)", fontWeight: 700 }}
                >
                  👨‍🍳 Kitchen
                </Link>
              </li>
            )}

            <li>
              <Link
                href="/security-lab"
                className={`nav-link ${isActive("/security-lab") ? "nav-link--active" : ""}`}
                style={{
                  background: "rgba(224, 86, 36, 0.1)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-paprika)",
                  fontWeight: 600,
                }}
              >
                🛡️ Audit Lab
              </Link>
            </li>

            <li>
              <Link href="/cart" className={`nav-cart-link ${isActive("/cart") ? "nav-link--active" : ""}`}>
                <span>🛒 Cart</span>
                {isMounted && cartCount > 0 && (
                  <span className="cart-badge-counter">{cartCount}</span>
                )}
              </Link>
            </li>

            <li className="nav-divider" aria-hidden="true"></li>

            {session ? (
              <li style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ textAlign: "right", lineHeight: 1.2 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)" }}>
                    {session.name}
                  </div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      padding: "1px 6px",
                      borderRadius: "10px",
                      background: session.role === "staff" ? "var(--color-turmeric)" : "rgba(0,0,0,0.08)",
                      color: session.role === "staff" ? "#fff" : "var(--text-dim)",
                      fontWeight: 700,
                    }}
                  >
                    {session.role}
                  </span>
                </div>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="btn-figma btn-figma--outline"
                    style={{
                      padding: "0.5rem 0.85rem",
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      minHeight: "44px",
                      minWidth: "44px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Sign Out
                  </button>
                </form>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/login" className={`nav-link ${isActive("/login") ? "nav-link--active" : ""}`}>
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/register" className={`nav-link ${isActive("/register") ? "nav-link--active" : ""}`}>
                    Register
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link href="/checkout" className="btn-figma btn-figma--primary btn-figma--nav">
                Checkout &rarr;
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
