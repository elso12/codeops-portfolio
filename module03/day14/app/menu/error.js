"use client";
/**
 * app/menu/error.js - Error boundary for the /menu segment (Client Component)
 *
 * Next.js requires error boundaries to be client components because they use
 * React error boundary lifecycle. The directive must come first.
 *
 * This boundary catches render errors in /menu and /menu/[id] while leaving
 * the root layout (navbar, cart link) intact and usable.
 *
 * The reset() function re-renders the segment without a full page reload.
 */
import { useEffect } from "react";
import Link from "next/link";

export default function MenuError({ error, reset }) {
  useEffect(() => {
    // Log to an error service in production (Sentry, Datadog, etc.)
    console.error("[MenuError boundary]", error);
  }, [error]);

  return (
    <main className="container" style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>😞</div>
      <h2 style={{ marginBottom: ".75rem" }}>Something went wrong</h2>
      <p style={{ color: "var(--color-text-dim)", marginBottom: "2rem", maxWidth: 420, marginInline: "auto" }}>
        We could not load the menu right now. The rest of the site is still working.
      </p>

      <code
        style={{
          display: "block",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: ".75rem 1rem",
          fontSize: ".8rem",
          color: "var(--color-error)",
          marginBottom: "2rem",
          maxWidth: 540,
          marginInline: "auto",
          overflowX: "auto",
          textAlign: "left",
        }}
      >
        {error?.message ?? "Unknown error"}
      </code>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          id="menu-error-retry"
          className="btn btn-primary"
          onClick={reset}
        >
          Try again
        </button>
        <Link href="/" className="btn btn-outline">
          Go home
        </Link>
      </div>
    </main>
  );
}
