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
    <main className="container" style={{ padding: "4rem 1.5rem" }}>
      <div className="empty-state">
        <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem" }}>⚠️</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 800, marginBottom: ".75rem", color: "var(--text-main)" }}>
          Something went wrong
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "1.75rem", maxWidth: 460, marginInline: "auto", fontSize: "1.05rem" }}>
          We could not load the menu right now. The rest of the site is still working.
        </p>

        <code
          style={{
            display: "block",
            background: "var(--bg-surface-sand)",
            border: "1px solid #ebd9ca",
            borderRadius: "var(--radius-sm)",
            padding: ".75rem 1rem",
            fontSize: ".85rem",
            color: "var(--color-paprika)",
            marginBottom: "2rem",
            maxWidth: 540,
            marginInline: "auto",
            overflowX: "auto",
            textAlign: "left",
            fontFamily: "monospace",
          }}
        >
          {error?.message ?? "Unknown error"}
        </code>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            id="menu-error-retry"
            className="btn-figma btn-figma--primary"
            onClick={reset}
          >
            Try Again
          </button>
          <Link href="/" className="btn-figma btn-figma--sand">
            Return Home &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
