import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "6rem 2rem" }}>
      <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🧭</div>
      <h2>Page Not Found</h2>
      <p style={{ color: "var(--color-text-dim)", marginBottom: "2rem" }}>
        We couldn't find the page you were looking for.
      </p>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </main>
  );
}
