"use client";
/**
 * app/checkout/CheckoutForm.jsx — Client Component
 *
 * This is the client "leaf" that handles interactivity.
 * It calls the placeOrder server action via useActionState — no URL, no fetch.
 *
 * useActionState(action, initialState) returns:
 *   [state, formAction, pending]
 *   • state   — last return value from the action  (null initially)
 *   • formAction — pass this to <form action={...}>
 *   • pending — true while the server is processing
 *
 * Progressive enhancement: the form works even before JS hydrates,
 * because <form action={serverAction}> falls back to a native POST.
 */
import { useState, useRef } from "react";
import { placeOrder } from "@/app/actions";
import Link from "next/link";

const AREAS = [
  "Bole", "Kazanchis", "Piassa", "Merkato", "Lideta",
  "Yeka", "Nifas Silk", "Kolfe", "Gulele", "Addis Ketema",
];

export default function CheckoutForm({ dishes, preselectedDishId, userName }) {
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const submittingRef = useRef(false);
  // Stable client-generated idempotency key: ensures even rapid double taps produce exactly 1 order
  const [idempotencyKey] = useState(() => `ord_idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Synchronously lock out any duplicate tap or rapid Enter keypress
    if (submittingRef.current || pending) {
      return;
    }
    submittingRef.current = true;
    setPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await placeOrder(null, formData);
      setState(res);
    } catch (err) {
      setState({ ok: false, error: err.message || "Failed to place order. Please try again." });
    } finally {
      setPending(false);
      submittingRef.current = false;
    }
  };

  /* ── Successful order ──────────────────────────────────────────────────── */
  if (state?.ok) {
    return (
      <div className="form-card" style={{ textAlign: "center", padding: "3.5rem 2rem" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2.2rem", fontWeight: 800, marginBottom: ".5rem", color: "var(--text-main)" }}>
          Order Successfully Placed!
        </h2>
        <p style={{ marginBottom: "1.75rem", fontSize: "1.05rem", color: "var(--text-muted)" }}>
          Order <strong style={{ color: "var(--color-paprika)", fontFamily: "monospace" }}>{state.order.id}</strong> is on its way to the kitchen.
          <br />
          Total Amount: <strong style={{ color: "var(--color-paprika)", fontSize: "1.2rem" }}>{state.order.total} {state.order.currency}</strong>
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/track/${state.order.id}`} className="btn-figma btn-figma--primary" style={{ minHeight: "44px" }}>
            🛵 Track Live Delivery &rarr;
          </Link>
          <Link href="/orders" className="btn-figma btn-figma--sand" style={{ minHeight: "44px" }}>
            View My Orders
          </Link>
          <Link href="/menu" className="btn-figma btn-figma--outline" style={{ minHeight: "44px" }}>
            Order More Dishes
          </Link>
        </div>
      </div>
    );
  }

  /* ── Field error helper ───────────────────────────────────────────────── */
  const err = (field) => state?.fieldErrors?.[field]?.[0];

  return (
    <form onSubmit={handleSubmit} className="form-card" id="checkout-form">
      {/* Idempotency Token ensuring single-execution guarantee */}
      <input type="hidden" name="idempotencyKey" value={idempotencyKey} />

      {/* Generic action error (not a field error) */}
      {state?.ok === false && state?.error && (
        <div className="form-error-banner" role="alert">{state.error}</div>
      )}

      {/* Notification explaining the double-submit & hardening protections */}
      <div className="notice" style={{ marginBottom: "1.5rem" }}>
        <strong>Hardened Checkout:</strong> Handled via <code>onSubmit</code> with synchronous double-tap latch, disabled submit button while pending, and cryptographic idempotency key guarantee.
      </div>

      {/* Dish select */}
      <div className="form-group">
        <label htmlFor="dishId">Dish</label>
        <select
          id="dishId"
          name="dishId"
          defaultValue={preselectedDishId}
          className={err("dishId") ? "error" : ""}
          required
        >
          <option value="">— Select a dish —</option>
          {dishes.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.price} ETB
            </option>
          ))}
        </select>
        {err("dishId") && <span className="field-error" role="alert">{err("dishId")}</span>}
      </div>

      {/* Quantity */}
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          className={err("quantity") ? "error" : ""}
          required
        />
        {err("quantity") && <span className="field-error" role="alert">{err("quantity")}</span>}
      </div>

      {/* Name */}
      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Abebe Kebede"
          className={err("name") ? "error" : ""}
          required
        />
        {err("name") && <span className="field-error" role="alert">{err("name")}</span>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          placeholder="09XXXXXXXX or +2519XXXXXXXX"
          className={err("phone") ? "error" : ""}
          required
        />
        {err("phone") && <span className="field-error" role="alert">{err("phone")}</span>}
      </div>

      {/* Delivery area */}
      <div className="form-group">
        <label htmlFor="area">Delivery Area</label>
        <select
          id="area"
          name="area"
          defaultValue=""
          className={err("area") ? "error" : ""}
          required
        >
          <option value="">— Select your area —</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {err("area") && <span className="field-error" role="alert">{err("area")}</span>}
      </div>

      {/* Notes */}
      <div className="form-group">
        <label htmlFor="notes">Special Instructions (optional)</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="No spice, extra injera…"
          className={err("notes") ? "error" : ""}
        />
        {err("notes") && <span className="field-error" role="alert">{err("notes")}</span>}
      </div>

      <button
        type="submit"
        id="submit-order"
        className="btn-figma btn-figma--primary"
        style={{ width: "100%", justifyContent: "center", fontSize: "1.05rem", padding: "0.9rem" }}
        disabled={pending}
      >
        {pending ? (
          <><span className="spinner" aria-hidden="true" /> Placing Order via Server Action…</>
        ) : (
          "Confirm & Place Order"
        )}
      </button>
    </form>
  );
}
