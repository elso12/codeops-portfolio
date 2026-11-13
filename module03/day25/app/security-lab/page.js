/**
 * app/security-lab/page.js
 * Security Audit & Penetration Testing Laboratory
 *
 * Demonstrates defense-in-depth against the 3 Core Security Attacks:
 * 1. Broken Authentication (Unauthenticated Server Action Invocation)
 * 2. Insecure Direct Object References (Cross-Account IDOR)
 * 3. Open Redirect (Phishing via ?next= query parameters)
 * Plus Role-Based Access Control (RBAC) & HTTP-Only HMAC-SHA256 Token Inspection.
 */
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/data";
import SecurityLabClient from "./SecurityLabClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Security Architecture & Penetration Lab",
  description:
    "Interactive security testing laboratory demonstrating defense against unauthenticated action execution, cross-account IDOR, and open redirect attacks.",
  alternates: {
    canonical: "/security-lab",
  },
};

export default async function SecurityLabPage() {
  const session = await getSession();
  const allOrders = getAllOrders().map((o) => ({
    id: o.id,
    userId: o.userId,
    customerName: o.customerName,
    status: o.status,
    dishName: o.dish?.name,
    total: o.total,
  }));

  return (
    <main className="container" style={{ maxWidth: 960, paddingBottom: "5rem" }}>
      <div className="section-header-centered" style={{ marginBottom: "2.5rem" }}>
        <span className="section-eyebrow">ደህንነት ላብራቶሪ · PENETRATION AUDIT &amp; DEFENSE LAB</span>
        <h1 className="section-title-large">Security Architecture &amp; Attack Lab</h1>
        <p className="section-sub-centered">
          Live verification of the <strong>3 Core Security Attacks</strong> and the multi-layered defenses
          guarding Mesob House.
        </p>
      </div>

      <SecurityLabClient session={session} initialOrders={allOrders} />
    </main>
  );
}
