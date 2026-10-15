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
import { useActionState } from "react";
import { placeOrder } from "@/app/actions";
import Link from "next/link";

const AREAS = [
  "Bole", "Kazanchis", "Piassa", "Merkato", "Lideta",
  "Yeka", "Nifas Silk", "Kolfe", "Gulele", "Addis Ketema",
];

export default function CheckoutForm({ dishes, preselectedDishId }) {
  const [state, formAction, pending] = useActionState(placeOrder, null);

  /* ── Successful order ──────────────────────────────────────────────────── */
  if (state?.ok) {
    return (
      <div className="form-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
        <h2 style={{ marginBottom: ".5rem" }}>Order Placed!</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Order <strong style={{ color: "var(--color-accent)" }}>{state.order.id}</strong> is on its way.
          Total: <strong style={{ color: "var(--color-accent)" }}>{state.order.total} {state.order.currency}</strong>
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/orders" className="btn btn-primary">View My Orders</Link>
          <Link href="/menu" className="btn btn-outline">Order Again</Link>
        </div>
      </div>
    );
  }

  /* ── Field error helper ───────────────────────────────────────────────── */
  const err = (field) => state?.fieldErrors?.[field]?.[0];

  return (
    <form action={formAction} className="form-card" id="checkout-form">

      {/* Generic action error (not a field error) */}
      {state?.ok === false && state?.error && (
        <div className="form-error-banner" role="alert">{state.error}</div>
      )}

      {/* Notification explaining the server-action approach */}
      <div className="notice" style={{ marginBottom: "1.5rem" }}>
        <strong>Server Action:</strong> this form calls <code>placeOrder</code> directly —
        no <code>fetch</code>, no URL. The pending flag comes from <code>useActionState</code>.
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
        className="btn btn-primary"
        style={{ width: "100%", justifyContent: "center", fontSize: "1.05rem" }}
        disabled={pending}
      >
        {pending ? (
          <><span className="spinner" aria-hidden="true" /> Placing order…</>
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}
