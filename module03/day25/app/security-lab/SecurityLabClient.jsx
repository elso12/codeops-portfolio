"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  cancelOrder,
  updateKitchenStatus,
  testSanitizeUrlAction,
  simulateUnauthenticatedCancel,
} from "@/app/actions";

export default function SecurityLabClient({ session, initialOrders = [] }) {
  // Attack 1 state
  const [attack1Log, setAttack1Log] = useState(null);
  const [isPending1, startTransition1] = useTransition();

  // Attack 2 state
  const [targetOrderId, setTargetOrderId] = useState(
    session?.id === "user_abebe_001" ? "ord_003" : "ord_001"
  );
  const [attack2Log, setAttack2Log] = useState(null);
  const [isPending2, startTransition2] = useTransition();

  // Attack 3 state
  const [redirectInput, setRedirectInput] = useState("https://evil-habesha-phish.et/steal");
  const [attack3Log, setAttack3Log] = useState(null);
  const [isPending3, startTransition3] = useTransition();

  // Attack 4 state
  const [attack4Log, setAttack4Log] = useState(null);
  const [isPending4, startTransition4] = useTransition();

  // Attack 1: Unauthenticated Server Action Invocation
  const handleAttack1 = () => {
    setAttack1Log({ status: "executing", message: "Sending unauthenticated cancel request..." });
    startTransition1(async () => {
      try {
        await simulateUnauthenticatedCancel("ord_001");
        setAttack1Log({
          status: "breached",
          message: "CRITICAL VULNERABILITY: Action executed without authentication!",
        });
      } catch (err) {
        setAttack1Log({
          status: "blocked",
          message: `ATTACK BLOCKED: ${err.message}`,
          enforcement: "app/actions.js line 144 · Level 1 Authentication Check (const user = await getSession())",
        });
      }
    });
  };

  // Attack 2: Cross-Account IDOR
  const handleAttack2 = () => {
    setAttack2Log({
      status: "executing",
      message: `Invoking cancelOrder("${targetOrderId}") as ${session ? session.id : "unauthenticated"}...`,
    });
    startTransition2(async () => {
      try {
        await cancelOrder(targetOrderId);
        setAttack2Log({
          status: "breached",
          message: `CRITICAL: Order "${targetOrderId}" was cancelled across account boundary!`,
        });
      } catch (err) {
        setAttack2Log({
          status: "blocked",
          message: `ATTACK BLOCKED: ${err.message}`,
          enforcement: "app/actions.js line 155 · Level 2 Authorization Check (if (order.userId !== user.id) throw Error)",
        });
      }
    });
  };

  // Attack 3: Open Redirect Test
  const handleAttack3 = (urlToTest) => {
    const val = typeof urlToTest === "string" ? urlToTest : redirectInput;
    if (typeof urlToTest === "string") setRedirectInput(urlToTest);

    setAttack3Log({ status: "executing", message: "Evaluating URL sanitization logic..." });
    startTransition3(async () => {
      try {
        const res = await testSanitizeUrlAction(val);
        setAttack3Log({
          status: res.safe ? "safe" : "sanitized",
          input: res.input,
          sanitized: res.sanitized,
          reason: res.reason,
          enforcement: "lib/session.js · sanitizeNextUrl() regex & protocol sanitizer",
        });
      } catch (err) {
        setAttack3Log({ status: "error", message: err.message });
      }
    });
  };

  // Attack 4: Privilege Escalation
  const handleAttack4 = () => {
    setAttack4Log({
      status: "executing",
      message: `Attempting updateKitchenStatus("ord_001", "ready") as role="${session?.role || "guest"}"...`,
    });
    startTransition4(async () => {
      try {
        await updateKitchenStatus("ord_001", "ready");
        setAttack4Log({
          status: "breached",
          message: "CRITICAL: Kitchen status updated by unauthorized non-staff account!",
        });
      } catch (err) {
        setAttack4Log({
          status: "blocked",
          message: `ATTACK BLOCKED: ${err.message}`,
          enforcement: "app/actions.js line 186 · Staff Role Check (if (user.role !== 'staff') throw Error)",
        });
      }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Session Identity Banner */}
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-md)",
          padding: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <div>
          <div style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", fontWeight: 700 }}>
            Active Authenticated Session
          </div>
          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)", fontFamily: "var(--font-serif)" }}>
            {session ? (
              <>
                {session.name} <span style={{ fontSize: "0.9rem", color: "var(--color-paprika)", fontWeight: 600 }}>({session.id})</span>
              </>
            ) : (
              <span style={{ color: "#dc2626" }}>⚠️ Unauthenticated / Signed Out</span>
            )}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-dim)", marginTop: "2px" }}>
            Role: <strong style={{ color: session?.role === "staff" ? "var(--color-turmeric)" : "var(--color-forest)" }}>{session?.role || "none"}</strong>
            {" "}• Token: <code style={{ fontSize: "0.78rem" }}>HMAC-SHA256 Signed HTTP-Only Cookie</code>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <Link href="/login" className="btn-figma btn-figma--outline" style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}>
            Switch Account
          </Link>
          <Link href="/orders" className="btn-figma btn-figma--primary" style={{ fontSize: "0.82rem", padding: "0.45rem 0.85rem" }}>
            View My Orders
          </Link>
        </div>
      </div>

      {/* Grid of Security Labs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        {/* ATTACK #1: Broken Authentication */}
        <section
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🔓</span>
            <div>
              <span className="badge badge-cancelled" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Attack Vector 1
              </span>
              <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "0.2rem 0 0" }}>
                Broken Authentication · Direct Server Action Invocation
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            <strong>The Threat:</strong> Next.js Server Actions compile to public HTTP POST endpoints (<code>POST /</code> with action ID header).
            An attacker crafts a custom script or cURL request invoking the action directly without sending an authenticated session cookie,
            hoping the server implicitly trusts the request or forgets to check authorization.
          </p>

          <div
            style={{
              background: "var(--bg-surface-sand)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem",
              marginBottom: "1.25rem",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "var(--text-main)",
            }}
          >
            <div style={{ color: "var(--color-paprika)", fontWeight: 700, marginBottom: "0.3rem" }}>
              // Server-Side Defense Line in app/actions.js
            </div>
            <div>const user = await getSession();</div>
            <div>if (!user) &#123;</div>
            <div style={{ paddingLeft: "1.5rem", color: "#dc2626" }}>
              throw new Error(&quot;Unauthorized: Authentication required.&quot;);
            </div>
            <div>&#125;</div>
          </div>

          <button
            type="button"
            onClick={handleAttack1}
            disabled={isPending1}
            className="btn-figma btn-figma--danger"
            style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
          >
            {isPending1 ? "Sending Unauthorized Request..." : "Simulate Attack 1: Call Action Without Session"}
          </button>

          {attack1Log && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.88rem",
                background: attack1Log.status === "blocked" ? "var(--color-forest-bg)" : "#fee2e2",
                border: `1px solid ${attack1Log.status === "blocked" ? "var(--color-forest)" : "#dc2626"}`,
                color: attack1Log.status === "blocked" ? "var(--color-forest)" : "#991b1b",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>
                {attack1Log.status === "blocked" ? "🛡️ DEFENSE VERIFIED · REQUEST REJECTED" : "🚨 BREACH"}
              </div>
              <div>{attack1Log.message}</div>
              {attack1Log.enforcement && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontFamily: "monospace", color: "#065f46" }}>
                  Enforced by: {attack1Log.enforcement}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ATTACK #2: Cross-Account IDOR */}
        <section
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🔀</span>
            <div>
              <span className="badge badge-cancelled" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Attack Vector 2
              </span>
              <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "0.2rem 0 0" }}>
                Cross-Account IDOR · Order Ownership Tampering
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            <strong>The Threat:</strong> An attacker is legitimately authenticated as user A (e.g. Abebe, <code>user_abebe_001</code>),
            but modifies the order ID payload to target user B&apos;s order (e.g. Chala&apos;s <code>ord_003</code>).
            If the server checks only authentication (who you are) without checking authorization (record ownership),
            the attacker successfully tampers with or cancels another customer&apos;s order.
          </p>

          <div
            style={{
              background: "var(--bg-surface-sand)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-sm)",
              padding: "1rem",
              marginBottom: "1.25rem",
              fontFamily: "monospace",
              fontSize: "0.82rem",
              color: "var(--text-main)",
            }}
          >
            <div style={{ color: "var(--color-paprika)", fontWeight: 700, marginBottom: "0.3rem" }}>
              // Server-Side Defense Line in app/actions.js:155
            </div>
            <div>const order = getOrderById(orderId);</div>
            <div>if (order.userId !== user.id) &#123;</div>
            <div style={{ paddingLeft: "1.5rem", color: "#dc2626" }}>
              throw new Error(`Forbidden: Ownership mismatch. Order belongs to &quot;$&#123;order.userId&#125;&quot;, not session &quot;$&#123;user.id&#125;&quot;`);
            </div>
            <div>&#125;</div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <label htmlFor="sec-target-order" style={{ fontSize: "0.88rem", fontWeight: 700 }}>
              Target Order ID to Attack:
            </label>
            <input
              id="sec-target-order"
              type="text"
              value={targetOrderId}
              onChange={(e) => setTargetOrderId(e.target.value)}
              style={{
                padding: "0.5rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                width: "140px",
              }}
            />
            <button
              type="button"
              onClick={handleAttack2}
              disabled={isPending2}
              className="btn-figma btn-figma--danger"
              style={{ padding: "0.55rem 1.2rem", fontSize: "0.9rem" }}
            >
              {isPending2 ? "Executing IDOR Exploit..." : `Attempt cancelOrder("${targetOrderId}")`}
            </button>
          </div>

          <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
            💡 Try targeting <code>ord_001</code> (Abebe) vs <code>ord_003</code> (Chala). Notice the server only allows cancelling orders that belong to your active session!
          </div>

          {attack2Log && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.88rem",
                background: attack2Log.status === "blocked" ? "var(--color-forest-bg)" : "#fee2e2",
                border: `1px solid ${attack2Log.status === "blocked" ? "var(--color-forest)" : "#dc2626"}`,
                color: attack2Log.status === "blocked" ? "var(--color-forest)" : "#991b1b",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>
                {attack2Log.status === "blocked" ? "🛡️ IDOR ATTACK BLOCKED · OWNERSHIP MISMATCH" : "🚨 BREACH"}
              </div>
              <div>{attack2Log.message}</div>
              {attack2Log.enforcement && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontFamily: "monospace", color: "#065f46" }}>
                  Enforced by: {attack2Log.enforcement}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ATTACK #3: Open Redirect */}
        <section
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🎣</span>
            <div>
              <span className="badge badge-cancelled" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Attack Vector 3
              </span>
              <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "0.2rem 0 0" }}>
                Open Redirect Vulnerability · Phishing via <code>?next=</code>
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            <strong>The Threat:</strong> When middleware redirects unauthenticated users to <code>/login?next=...</code>,
            an attacker could send a phishing link containing <code>?next=https://evil-phishing.et</code> or protocol-relative <code>?next=//evil.com</code>.
            If the login form blindly redirects to <code>next</code> upon success, the user is deceived into an external credential-harvesting trap.
          </p>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={() => handleAttack3("https://evil-habesha-phish.et/steal")}
              className="btn-figma btn-figma--outline"
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem" }}
            >
              External URL: <code>https://evil-phish.et</code>
            </button>
            <button
              type="button"
              onClick={() => handleAttack3("//attacker.com/malware")}
              className="btn-figma btn-figma--outline"
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem" }}
            >
              Protocol-Relative: <code>//attacker.com</code>
            </button>
            <button
              type="button"
              onClick={() => handleAttack3("javascript:alert(1)")}
              className="btn-figma btn-figma--outline"
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem" }}
            >
              JavaScript Pseudo: <code>javascript:...</code>
            </button>
            <button
              type="button"
              onClick={() => handleAttack3("/checkout")}
              className="btn-figma btn-figma--outline"
              style={{ fontSize: "0.8rem", padding: "0.35rem 0.65rem", borderColor: "var(--color-forest)" }}
            >
              Valid Local Path: <code>/checkout</code>
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
            <input
              type="text"
              value={redirectInput}
              onChange={(e) => setRedirectInput(e.target.value)}
              placeholder="Enter malicious or benign redirect URL"
              style={{
                flex: "1 1 300px",
                padding: "0.55rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                fontFamily: "monospace",
                fontSize: "0.9rem",
              }}
            />
            <button
              type="button"
              onClick={() => handleAttack3()}
              disabled={isPending3}
              className="btn-figma btn-figma--primary"
              style={{ padding: "0.55rem 1.2rem", fontSize: "0.9rem" }}
            >
              {isPending3 ? "Sanitizing..." : "Run URL Sanitizer"}
            </button>
          </div>

          {attack3Log && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.88rem",
                background: attack3Log.status === "sanitized" ? "var(--color-turmeric-bg)" : "var(--color-forest-bg)",
                border: `1px solid ${attack3Log.status === "sanitized" ? "var(--color-turmeric)" : "var(--color-forest)"}`,
                color: attack3Log.status === "sanitized" ? "var(--color-turmeric)" : "var(--color-forest)",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: "0.4rem" }}>
                {attack3Log.status === "sanitized"
                  ? "🛡️ PHISHING ATTEMPT NEUTRALIZED · FALLBACK ENGAGED"
                  : "✓ VALID LOCAL DESTINATION APPROVED"}
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                Input: <span style={{ color: "#dc2626" }}>{attack3Log.input}</span> &rarr; Sanitized: <strong style={{ color: "var(--color-forest)" }}>{attack3Log.sanitized}</strong>
              </div>
              <div style={{ fontSize: "0.82rem" }}>{attack3Log.reason}</div>
            </div>
          )}
        </section>

        {/* ATTACK #4: Privilege Escalation (RBAC) */}
        <section
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>👨‍🍳</span>
            <div>
              <span className="badge badge-cancelled" style={{ fontSize: "0.7rem", textTransform: "uppercase" }}>
                Attack Vector 4
              </span>
              <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: "0.2rem 0 0" }}>
                Privilege Escalation · Role-Based Access Control (RBAC)
              </h2>
            </div>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
            <strong>The Threat:</strong> A customer tries to navigate directly to <code>/kitchen</code> or invoke staff-only operations
            like <code>updateKitchenStatus()</code> to alter kitchen orders.
            Hiding buttons in the navbar is insufficient client-side security; the server MUST refuse access with HTTP 403.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleAttack4}
              disabled={isPending4}
              className="btn-figma btn-figma--danger"
              style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
            >
              {isPending4 ? "Attempting Status Escalation..." : "Attempt updateKitchenStatus()"}
            </button>

            <Link
              href="/kitchen"
              className="btn-figma btn-figma--outline"
              style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
            >
              Direct Navigation Test: Go to /kitchen &rarr;
            </Link>
          </div>

          {attack4Log && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "1rem",
                borderRadius: "var(--radius-sm)",
                fontSize: "0.88rem",
                background: attack4Log.status === "blocked" ? "var(--color-forest-bg)" : "#fee2e2",
                border: `1px solid ${attack4Log.status === "blocked" ? "var(--color-forest)" : "#dc2626"}`,
                color: attack4Log.status === "blocked" ? "var(--color-forest)" : "#991b1b",
              }}
            >
              <div style={{ fontWeight: 800, marginBottom: "0.3rem" }}>
                {attack4Log.status === "blocked" ? "🛡️ PRIVILEGE ESCALATION REFUSED (HTTP 403)" : "🚨 PRIVILEGE BREACH"}
              </div>
              <div>{attack4Log.message}</div>
              {attack4Log.enforcement && (
                <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", fontFamily: "monospace", color: "#065f46" }}>
                  Enforced by: {attack4Log.enforcement}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Deep Dive: Cryptographic Cookie Token Architecture */}
        <section
          style={{
            background: "var(--bg-surface-honey)",
            border: "1px solid var(--border-gold)",
            borderRadius: "var(--radius-md)",
            padding: "2rem",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🔐</span>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontFamily: "var(--font-serif)", color: "var(--text-main)", margin: 0 }}>
                Cryptographic Cookie &amp; Session Invariants
              </h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginTop: "1.25rem" }}>
            <div style={{ background: "#fff", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--color-paprika)", marginBottom: "0.4rem" }}>
                1. Web Crypto HMAC-SHA256
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Tokens take the form <code>payload.signature</code> using the Web Crypto API (Edge-native).
                Any client-side modification of payload claims invalidates the HMAC signature and is discarded.
              </p>
            </div>
            <div style={{ background: "#fff", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--color-forest)", marginBottom: "0.4rem" }}>
                2. HTTP-Only &amp; SameSite Lax
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                Cookies are marked <code>httpOnly: true</code> (inaccessible to XSS scripts via <code>document.cookie</code>) and
                <code>sameSite: &quot;lax&quot;</code> to prevent Cross-Site Request Forgery (CSRF).
              </p>
            </div>
            <div style={{ background: "#fff", padding: "1.2rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--color-turmeric)", marginBottom: "0.4rem" }}>
                3. Defense-In-Depth (3 Layers)
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                <strong>Layer 1:</strong> Edge Middleware fast redirect.<br />
                <strong>Layer 2:</strong> Server Component render-time verification.<br />
                <strong>Layer 3:</strong> Scoped queries (<code>getOrdersByUser(session.id)</code>).
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
