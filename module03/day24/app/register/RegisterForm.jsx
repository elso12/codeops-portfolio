"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submittingRef.current || loading) return;
    submittingRef.current = true;
    setLoading(true);
    setErrorMessage("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);

    try {
      const res = await signUp(null, data);
      if (!res.ok) {
        setErrorMessage(res.error || "Registration failed.");
        setLoading(false);
        submittingRef.current = false;
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(res.redirectTo || "/orders");
        router.refresh();
      }, 600);
    } catch (err) {
      setErrorMessage("Network error or failed request.");
      setLoading(false);
      submittingRef.current = false;
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <span className="brand-badge" style={{ margin: "0 auto 1.25rem" }}>መሶብ</span>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", fontWeight: 800, marginBottom: "0.35rem", color: "var(--text-main)" }}>Join Mesob House</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Create an account to order authentic Habesha dishes, reserve mesobs, and earn reward discounts.
        </p>
      </div>

      {errorMessage && (
        <div style={{
          background: "rgba(220, 38, 38, 0.1)",
          border: "1px solid #dc2626",
          color: "#dc2626",
          padding: "0.75rem 1rem",
          borderRadius: "var(--radius-sm)",
          marginBottom: "1.25rem",
          fontSize: "0.88rem",
          fontWeight: 600,
        }}>
          ⚠️ {errorMessage}
        </div>
      )}

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
          ✓ Account created successfully! Logging you in...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Sara Haile"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (Ethiopia)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="0912345678"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="sara@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Create Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-figma btn-figma--primary"
          style={{ width: "100%", justifyContent: "center", marginTop: "0.75rem", padding: "0.9rem" }}
        >
          {loading ? (
            <><span className="spinner" aria-hidden="true" /> Registering…</>
          ) : (
            "Create Account &rarr;"
          )}
        </button>
      </form>

      <div className="divider" style={{ margin: "1.75rem 0" }} />

      <div style={{ textAlign: "center", fontSize: "0.92rem", color: "var(--text-muted)" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "var(--color-paprika)", fontWeight: 700 }}>
          Sign In &rarr;
        </Link>
      </div>
    </div>
  );
}
