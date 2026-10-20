import { toCsv } from "../lib/csv.js";
import { etb, when, relative, formatRelativeTime } from "../lib/format.js";

console.log("=================================================");
console.log("🚀 DAY 47 / DAY 22 VERIFICATION SUITE");
console.log("=================================================");

// -----------------------------------------------------------------
// TEST 1: CSV Export with Awkward Values (Commas, Quotes, Newlines)
// -----------------------------------------------------------------
console.log("\n[TEST 1] Testing CSV Export with Awkward Values...");

const testRows = [
  {
    orderId: "ORD-001",
    restaurant: 'Bole, Kitfo', // Value containing a comma
    item: 'Special "Gored Gored"', // Value containing quotation mark
    combo: 'Combo "Kitfo, Tibs & Ayib"', // Both comma and quotation marks
    notes: 'Gate Code: 1234\n"Ring twice"', // Value containing newlines and quotes
    price: 360,
  },
  {
    orderId: "ORD-002",
    restaurant: "Mesob House Addis",
    item: "Doro Wat",
    combo: "Injera Extra",
    notes: "Leave with security",
    price: 180,
  },
];

const csv = toCsv(testRows);
console.log("Generated CSV:\n" + csv);

// Check RFC 4180 escaping
if (!csv.includes('"Bole, Kitfo"')) {
  throw new Error("Failed: Comma in restaurant was not quoted!");
}
if (!csv.includes('"Special ""Gored Gored"""')) {
  throw new Error("Failed: Quotation mark in item was not doubled and quoted!");
}
if (!csv.includes('"Combo ""Kitfo, Tibs & Ayib"""')) {
  throw new Error("Failed: Value with both comma and quotes failed escaping!");
}
if (!csv.includes('"Gate Code: 1234\n""Ring twice"""')) {
  throw new Error("Failed: Value with newline failed escaping!");
}
console.log("✅ TEST 1 PASSED: CSV export safely survives commas, quotes, and newlines.");

// -----------------------------------------------------------------
// TEST 2: Shared Formatting Module (etb, when, relative)
// -----------------------------------------------------------------
console.log("\n[TEST 2] Testing lib/format.js...");

// Money (ETB)
const samplePrice1 = etb.format(240);
const samplePrice2 = etb.format(14200);
console.log(`etb.format(240) -> ${samplePrice1}`);
console.log(`etb.format(14200) -> ${samplePrice2}`);
if (!samplePrice1.includes("240") || !samplePrice1.includes("ETB")) {
  throw new Error(`Failed: etb.format(240) unexpected output: ${samplePrice1}`);
}

// Dates and Times (when in Africa/Addis_Ababa, UTC+3)
const testDate = new Date("2026-10-20T12:00:00.000Z"); // 12:00 UTC = 15:00 Addis time
const formattedWhen = when.format(testDate);
console.log(`when.format(2026-10-20T12:00:00Z) -> ${formattedWhen}`);
if (!formattedWhen.includes("3:00") && !formattedWhen.includes("15:00")) {
  throw new Error(`Failed: Timezone Addis_Ababa (UTC+3) not reflected: ${formattedWhen}`);
}

// Relative times
const rel1 = relative.format(-12, "minute");
console.log(`relative.format(-12, "minute") -> ${rel1}`);
if (!rel1.includes("12 minutes ago") && !rel1.includes("12 min. ago")) {
  throw new Error(`Failed: relative.format unexpected output: ${rel1}`);
}

console.log("✅ TEST 2 PASSED: Format module operates with named locale 'en-ET' and timezone 'Africa/Addis_Ababa'.");

// -----------------------------------------------------------------
// TEST 3: SSE Framing & Stream Route Simulation
// -----------------------------------------------------------------
console.log("\n[TEST 3] Testing SSE Stream framing and route structure...");

import { GET } from "../app/api/orders/[id]/stream/route.js";

const mockReq = {
  signal: {
    addEventListener: () => {},
  },
};

const response = await GET(mockReq, { params: { id: "ord_001" } });
const headers = Object.fromEntries(response.headers.entries());

console.log("SSE Response Headers:", headers);
if (!headers["content-type"]?.includes("text/event-stream")) {
  throw new Error(`Failed: Content-Type must be text/event-stream, got: ${headers["content-type"]}`);
}
if (!headers["cache-control"]?.includes("no-cache")) {
  throw new Error(`Failed: Cache-Control must include no-cache, got: ${headers["cache-control"]}`);
}

// Read first chunk from the ReadableStream to verify framing ("data: ... \n\n")
const reader = response.body.getReader();
const { value: chunkBytes } = await reader.read();
const chunkText = new TextDecoder().decode(chunkBytes);

console.log("First streamed chunk:\n" + chunkText);

if (!chunkText.startsWith("data: ")) {
  throw new Error(`Failed: SSE chunk does not start with 'data: ' framing!`);
}
if (!chunkText.endsWith("\n\n")) {
  throw new Error(`Failed: SSE chunk does not terminate with two newlines (\\n\\n)!`);
}

const payloadText = chunkText.slice(6, -2);
const payload = JSON.parse(payloadText);

console.log("Parsed Seed Payload:", {
  orderId: payload.orderId,
  status: payload.status,
  courier: payload.courier?.name,
  courierPos: payload.courier?.position,
  destination: payload.destination?.position,
  etaMinutes: payload.etaMinutes,
});

if (payload.orderId !== "ord_001") {
  throw new Error(`Failed: orderId expected 'ord_001', got: ${payload.orderId}`);
}
if (!Array.isArray(payload.courier?.position) || payload.courier.position.length !== 2) {
  throw new Error("Failed: courier position must be [lat, lng]");
}
if (!Array.isArray(payload.destination?.position) || payload.destination.position.length !== 2) {
  throw new Error("Failed: destination position must be [lat, lng]");
}

// Cancel reader
await reader.cancel();

console.log("✅ TEST 3 PASSED: SSE route handler has exact 'data: ... \\n\\n' framing and valid payload.");

console.log("\n=================================================");
console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!");
console.log("=================================================");
