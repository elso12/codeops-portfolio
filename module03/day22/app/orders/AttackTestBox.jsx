"use client";

import { useState, useTransition } from "react";
import { cancelOrder } from "@/app/actions";

export default function AttackTestBox({ currentUserId }) {
  const [targetOrderId, setTargetOrderId] = useState(
    currentUserId === "user_abebe_001" ? "ord_003" : "ord_001"
  );
  const [attackLog, setAttackLog] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleCrossAccountAttack = () => {
    setAttackLog({ status: "executing", message: `Attempting cancelOrder("${targetOrderId}")...` });

    startTransition(async () => {
      try {
        await cancelOrder(targetOrderId);
        setAttackLog({
          status: "breached",
          message: `CRITICAL: Successfully cancelled ${targetOrderId}! (Authorization Failed)`,
        });
      } catch (err) {
        setAttackLog({
          status: "blocked",
          message: `ATTACK DEFEATED: ${err.message}`,
          line: "app/actions.js line 152 (if (order.userId !== user.id) throw new Error(...))",
        });
      }
    });
  };

  return (
    <div
      style={{
        marginTop: "3.5rem",
        padding: "1.75rem",
        background: "var(--color-cream)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-subtle)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.4rem" }}>🛡️</span>
        <h3 style={{ margin: 0, fontSize: "1.15rem", fontFamily: "var(--font-serif)" }}>
          Security Audit Lab: Attack #2 (Cross-Account IDOR Test)
        </h3>
      </div>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        You are authenticated as <code>{currentUserId}</code>. Try invoking the <code>cancelOrder</code> server action against another customer&apos;s order ID.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="target-order-id" style={{ fontSize: "0.85rem", fontWeight: 600 }}>Target Order ID:</label>
          <input
            id="target-order-id"
            type="text"
            value={targetOrderId}
            onChange={(e) => setTargetOrderId(e.target.value)}
            style={{
              padding: "0.45rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-subtle)",
              fontFamily: "monospace",
              fontSize: "0.9rem",
              width: "120px",
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleCrossAccountAttack}
          disabled={isPending}
          className="btn-figma btn-figma--danger"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          {isPending ? "Testing Exploit..." : "Launch Attack: Attempt Unauthorized Cancel"}
        </button>
      </div>

      {attackLog && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.85rem",
            background:
              attackLog.status === "blocked"
                ? "rgba(16, 185, 129, 0.1)"
                : attackLog.status === "breached"
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(0,0,0,0.05)",
            border: `1px solid ${
              attackLog.status === "blocked"
                ? "#10b981"
                : attackLog.status === "breached"
                ? "#ef4444"
                : "var(--border-subtle)"
            }`,
            color: attackLog.status === "blocked" ? "#065f46" : attackLog.status === "breached" ? "#991b1b" : "inherit",
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "0.3rem" }}>
            {attackLog.status === "blocked" && "✓ Defense Succeeded: Ownership Enforcement Verified"}
            {attackLog.status === "breached" && "🚨 VULNERABILITY DETECTED"}
            {attackLog.status === "executing" && "⏳ Running server-side check..."}
          </div>
          <div>{attackLog.message}</div>
          {attackLog.line && (
            <div style={{ marginTop: "0.4rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#047857" }}>
              Enforced by: {attackLog.line}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
