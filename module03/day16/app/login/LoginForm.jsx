"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("abebe@mesobhouse.et");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/orders");
      }, 1000);
    }, 600);
  };

  return (
    <div className="form-card" style={{ maxWidth: "460px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="brand-badge" style={{ margin: "0 auto 1.25rem" }}>መሶብ</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 800, marginBottom: "0.35rem", color: "var(--text-main)" }}>Welcome Back</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Sign in to track orders, earn Gursha points, and manage bookings.
        </p>
      </div>

      {success && (
        <div style={{
          background: "var(--color-forest-bg)",
          border: "1px solid var(--color-forest)",
          color: "var(--color-forest)",
          padding: "0.9rem",
          borderRadius: "var(--radius-sm)",
          marginBottom: "1.5rem",
          fontSize: "0.92rem",
          fontWeight: 600,
          textAlign: "center"
        }}>
          ✓ Signed in successfully! Redirecting to orders...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email or Phone</label>
          <input
            id="email"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor="password">Password</label>
            <span style={{ fontSize: "0.82rem", color: "var(--color-paprika)", fontWeight: 600, cursor: "pointer" }}>
              Forgot?
            </span>
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-figma btn-figma--primary"
          style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem", padding: "0.9rem" }}
        >
          {loading ? (
            <><span className="spinner" aria-hidden="true" /> Signing In…</>
          ) : (
            "Sign In to Mesob House"
          )}
        </button>
      </form>

      <div className="divider" style={{ margin: "1.75rem 0" }} />

      <div style={{ textAlign: "center", fontSize: "0.92rem", color: "var(--text-muted)" }}>
        Don&apos;t have an account yet?{" "}
        <Link href="/register" style={{ color: "var(--color-paprika)", fontWeight: 700 }}>
          Create an Account &rarr;
        </Link>
      </div>
    </div>
  );
}
