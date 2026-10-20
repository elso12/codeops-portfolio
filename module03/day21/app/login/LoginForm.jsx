"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/actions";

export default function LoginForm({ nextDestination = "/orders" }) {
  const router = useRouter();
  const [email, setEmail] = useState("abebe@mesobhouse.et");
  const [password, setPassword] = useState("customer123");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const fillAccount = (accEmail, accPass) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("next", nextDestination);

    try {
      const res = await signIn(null, formData);
      if (!res.ok) {
        setErrorMessage(res.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      setSuccessInfo(res.redirectTo);
      setTimeout(() => {
        router.push(res.redirectTo);
        router.refresh();
      }, 600);
    } catch (err) {
      setErrorMessage("Network error or failed request.");
      setLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <span className="brand-badge" style={{ margin: "0 auto 1.25rem" }}>
          መሶብ
        </span>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: 800,
            marginBottom: "0.35rem",
            color: "var(--text-main)",
          }}
        >
          Addis Eats Sign In
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>
          Secure session with <code style={{ color: "var(--color-paprika)" }}>httpOnly</code> cookies &amp; server-side verification.
        </p>
      </div>

      {nextDestination && nextDestination !== "/orders" && (
        <div
          style={{
            background: "rgba(224, 86, 36, 0.08)",
            border: "1px dashed var(--color-paprika)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            color: "var(--text-main)",
            marginBottom: "1.25rem",
          }}
        >
          <strong>Protected destination:</strong>{" "}
          <span style={{ fontFamily: "monospace", color: "var(--color-paprika)" }}>
            {nextDestination}
          </span>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "2px" }}>
            (Middleware held this destination and will restore it safely upon authentication)
          </div>
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            background: "rgba(220, 38, 38, 0.1)",
            border: "1px solid #dc2626",
            color: "#dc2626",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.25rem",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          ⚠️ {errorMessage}
        </div>
      )}

      {successInfo && (
        <div
          style={{
            background: "var(--color-forest-bg)",
            border: "1px solid var(--color-forest)",
            color: "var(--color-forest)",
            padding: "0.85rem",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.25rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ✓ Signed in! Redirecting to <code style={{ color: "var(--color-forest)" }}>{successInfo}</code>...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor="password">Password</label>
            <span style={{ fontSize: "0.82rem", color: "var(--color-paprika)", fontWeight: 600 }}>
              Encrypted
            </span>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <input type="hidden" name="next" value={nextDestination} />

        <button
          type="submit"
          disabled={loading}
          className="btn-figma btn-figma--primary"
          style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem", padding: "0.9rem" }}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Verifying Credentials...
            </>
          ) : (
            "Sign In with Secure Session"
          )}
        </button>
      </form>

      <div className="divider" style={{ margin: "1.5rem 0" }} />

      {/* Quick Demo Switcher */}
      <div style={{ background: "var(--color-cream)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.6rem" }}>
          ⚡ 1-Click Test Accounts:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <button
            type="button"
            onClick={() => fillAccount("abebe@mesobhouse.et", "customer123")}
            className="btn-figma btn-figma--outline"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem", textAlign: "left", justifyContent: "space-between" }}
          >
            <span>👤 <strong>Abebe Kebede</strong> (Customer 1)</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Orders #001, #002</span>
          </button>
          <button
            type="button"
            onClick={() => fillAccount("chala@mesobhouse.et", "customer123")}
            className="btn-figma btn-figma--outline"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem", textAlign: "left", justifyContent: "space-between" }}
          >
            <span>👤 <strong>Chala Tadesse</strong> (Customer 2)</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Orders #003, #004</span>
          </button>
          <button
            type="button"
            onClick={() => fillAccount("chef@mesobhouse.et", "kitchen123")}
            className="btn-figma btn-figma--outline"
            style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem", textAlign: "left", justifyContent: "space-between", borderColor: "var(--color-turmeric)" }}
          >
            <span>👨‍🍳 <strong>Chef Tigist</strong> (Staff Role)</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-turmeric)", fontWeight: 700 }}>/kitchen Access</span>
          </button>
        </div>
      </div>
    </div>
  );
}
