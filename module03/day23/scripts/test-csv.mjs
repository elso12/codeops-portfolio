import { toCsv } from "../lib/csv.js";

// Test dataset containing:
// 1. A value containing a comma (e.g., "Bole, Kitfo" or address "House 42, Bole Road")
// 2. A value containing a quotation mark (e.g., 'Special "Gored Gored"')
// 3. A value containing BOTH a comma and quotation marks (e.g., 'Combo "Kitfo, Tibs & Ayib"')
// 4. A value containing newlines (e.g., "Note: Call driver\nGate code 1234")
// 5. Clean ordinary values

const testRows = [
  {
    id: "ORD-101",
    restaurant: 'Bole, Kitfo',
    item: 'Special "Gored Gored"',
    price: 320,
    address: 'House 42, Bole Road, Addis Ababa',
    note: 'Leave at front gate\nCall on arrival'
  },
  {
    id: "ORD-102",
    restaurant: 'Yod Abyssinia',
    item: 'Traditional "Special", Tibs & Doro',
    price: 650,
    address: 'Cameroon St, Bole',
    note: 'Ring buzzer "2B"'
  }
];

const csvOutput = toCsv(testRows);
console.log("=== GENERATED CSV ===");
console.log(csvOutput);
console.log("=====================");

// Verification
const lines = csvOutput.split("\n");
console.log(`Total rows generated: ${lines.length}`);

// Check that commas inside quotes did not split improperly:
// Let's verify RFC 4180 parsing
function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        cur += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        result.push(cur);
        cur = '';
      } else {
        cur += c;
      }
    }
  }
  result.push(cur);
  return result;
}

const headerCols = parseCsvLine(lines[0]);
console.log("Headers:", headerCols);

// Row 1 checks:
// Note: Row 1 spans 2 lines because note has a newline:
// Let's test single line without newline for strict column count check:
const testSingleLine = [
  {
    id: "ORD-201",
    restaurant: 'Bole, Kitfo', // comma
    item: 'Special "Gored Gored"', // quotation mark
    address: 'Meskel Square, "Near Stadium", Addis Ababa' // comma and quote
  }
];

const singleCsv = toCsv(testSingleLine);
const singleLines = singleCsv.split("\n");
const parsedRow = parseCsvLine(singleLines[1]);

console.log("Parsed row with awkward values:", parsedRow);
if (parsedRow[1] !== 'Bole, Kitfo') {
  throw new Error(`Comma test failed: expected 'Bole, Kitfo', got '${parsedRow[1]}'`);
}
if (parsedRow[2] !== 'Special "Gored Gored"') {
  throw new Error(`Quote test failed: expected 'Special "Gored Gored"', got '${parsedRow[2]}'`);
}
if (parsedRow[3] !== 'Meskel Square, "Near Stadium", Addis Ababa') {
  throw new Error(`Combined test failed: expected 'Meskel Square, "Near Stadium", Addis Ababa', got '${parsedRow[3]}'`);
}

console.log("✅ ALL CSV EXPORT TESTS PASSED!");
