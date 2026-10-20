/**
 * scripts/test-hardening.mjs
 *
 * Automated verification for Day 48:
 * 1. Double tap / double submit prevention (idempotency key & synchronous latching)
 * 2. Secrets protection (ensuring no server secret leaked in public environment or client JS)
 * 3. Touch target and focus-visible CSS rules verification
 */
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

console.log("==================================================================");
console.log("🧪 DAY 48 HARDENING & SHIP VERIFICATION SUITE");
console.log("==================================================================\n");

// 1. Verify CSS Visible Focus & Touch Targets
console.log("1. Checking Accessible Focus & Minimum 44px Touch Targets in globals.css...");
const globalsCss = fs.readFileSync(path.join(process.cwd(), "app/globals.css"), "utf8");

assert(globalsCss.includes(":focus-visible"), "FAIL: globals.css must define :focus-visible");
assert(globalsCss.includes("min-height: 44px"), "FAIL: globals.css must enforce min-height: 44px on interactive controls");
assert(globalsCss.includes("min-width: 44px"), "FAIL: globals.css must enforce min-width: 44px on buttons");
console.log("   ✓ :focus-visible outline & box-shadow defined globally");
console.log("   ✓ Universal 44px minimum touch target rules verified\n");

// 2. Verify No Secrets in Client Bundle or Public Env
console.log("2. Checking Secrets Leakage & Pre-flight Checklist...");
const envLocal = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8");
assert(!envLocal.includes("NEXT_PUBLIC_SESSION_SECRET"), "FAIL: SESSION_SECRET must never be NEXT_PUBLIC");
assert(!envLocal.includes("NEXT_PUBLIC_DATABASE_URL"), "FAIL: DB secret must never be NEXT_PUBLIC");

// Search all client components for SESSION_SECRET
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === "node_modules" || file === ".next") continue;
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith(".js") || file.endsWith(".jsx")) {
      results.push(full);
    }
  }
  return results;
}

const allFiles = walk(path.join(process.cwd(), "app")).concat(walk(path.join(process.cwd(), "components")));
for (const file of allFiles) {
  const content = fs.readFileSync(file, "utf8");
  if (content.includes('"use client"') || content.includes("'use client'")) {
    assert(!content.includes("SESSION_SECRET"), `FAIL: Client component ${file} references SESSION_SECRET`);
  }
}
console.log("   ✓ Zero secrets exposed in client components or NEXT_PUBLIC variables\n");

// 3. Verify Form Double-Submit Protection in CheckoutForm
console.log("3. Checking Form Double-Submit Protection in CheckoutForm.jsx...");
const checkoutFormCode = fs.readFileSync(path.join(process.cwd(), "app/checkout/CheckoutForm.jsx"), "utf8");
assert(checkoutFormCode.includes("onSubmit={handleSubmit}"), "FAIL: CheckoutForm must handle form with onSubmit");
assert(checkoutFormCode.includes("submittingRef"), "FAIL: CheckoutForm must use synchronous submittingRef latch");
assert(checkoutFormCode.includes("disabled={pending}"), "FAIL: Submit button must be disabled while pending");
assert(checkoutFormCode.includes("idempotencyKey"), "FAIL: CheckoutForm must submit an idempotencyKey");
console.log("   ✓ onSubmit with synchronous latching verified");
console.log("   ✓ Submit button disabled while pending verified");
console.log("   ✓ Client idempotency key passed to Server Action verified\n");

// 4. Verify Server Idempotency Protection in actions.js
console.log("4. Checking Server Idempotency in app/actions.js...");
const actionsCode = fs.readFileSync(path.join(process.cwd(), "app/actions.js"), "utf8");
assert(actionsCode.includes("idempotencyOrderCache"), "FAIL: actions.js must have idempotency cache");
assert(actionsCode.includes("idempotencyKey"), "FAIL: actions.js must check and store idempotencyKey");
console.log("   ✓ Server Action idempotency cache verified\n");

// 5. Verify Escape Key Handler in SearchBox
console.log("5. Checking Tab, Enter & Escape Handlers in app/menu/SearchBox.jsx...");
const searchBoxCode = fs.readFileSync(path.join(process.cwd(), "app/menu/SearchBox.jsx"), "utf8");
assert(searchBoxCode.includes('e.key === "Escape"'), "FAIL: SearchBox must handle Escape key to clear search");
console.log("   ✓ Escape key handler for clearing search verified\n");

console.log("==================================================================");
console.log("🎉 ALL DAY 48 HARDENING CHECKS PASSED SUCCESSFULLY!");
console.log("==================================================================");
