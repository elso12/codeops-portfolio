"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
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
              <Link href="/offers" className={`nav-link ${isActive("/offers") ? "nav-link--active" : ""}`}>
                Offers
              </Link>
            </li>
            <li>
              <Link href="/reservations" className={`nav-link ${isActive("/reservations") ? "nav-link--active" : ""}`}>
                Reservations
              </Link>
            </li>
            <li>
              <Link href="/orders" className={`nav-link ${isActive("/orders") ? "nav-link--active" : ""}`}>
                Orders
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
            <li>
              <Link href="/login" className={`nav-link ${isActive("/login") ? "nav-link--active" : ""}`}>
                Login
              </Link>
            </li>
            <li>
              <Link href="/register" className={`nav-link ${isActive("/register") ? "nav-link--active" : ""}`}>
                Register
              </Link>
            </li>
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
