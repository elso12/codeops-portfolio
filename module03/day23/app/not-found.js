import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ padding: "4rem 1.5rem" }}>
      <div className="empty-state">
        <span className="emoji">🧭</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.4rem", fontWeight: 800, marginBottom: "0.75rem", color: "var(--text-main)" }}>
          Page Not Found
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: "460px", margin: "0 auto 2rem" }}>
          We couldn&apos;t find the hearth or recipe you were looking for. Perhaps return to the communal table?
        </p>
        <Link href="/" className="btn-figma btn-figma--primary">
          Return to Home & Hearth &rarr;
        </Link>
      </div>
    </main>
  );
}
