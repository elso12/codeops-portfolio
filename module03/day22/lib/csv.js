// lib/csv.js - Robust RFC 4180 CSV serializer and browser downloader

/**
 * Serializes an array of objects to CSV, properly escaping commas, double quotes, and newlines.
 * RFC 4180 compliant: any cell containing comma, quote, or newline is wrapped in quotes
 * and interior double quotes are doubled ("").
 *
 * @param {Array<Record<string, any>>} rows
 * @returns {string} CSV text
 */
export function toCsv(rows) {
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const cell = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // If value contains comma, quote, or newline (\n or \r), quote it and escape quotes
    if (/[",\n\r]/.test(s)) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const headerRow = headers.map(cell).join(",");
  const dataRows = rows.map((row) =>
    headers.map((key) => cell(row[key])).join(",")
  );

  return [headerRow, ...dataRows].join("\n");
}

/**
 * Browser-side download of CSV text via Blob and ObjectURL
 * Releases the object URL afterwards to prevent memory leaks.
 *
 * @param {string} text
 * @param {string} filename
 */
export function downloadCsv(text, filename = "orders.csv") {
  if (typeof window === "undefined") return;

  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // release memory
}
