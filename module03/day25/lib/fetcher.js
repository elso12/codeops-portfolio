/**
 * lib/fetcher.js
 *
 * Shared SWR fetcher function.
 * Requirements:
 * - Used by every SWR query.
 * - Throws an error for non-OK HTTP responses, attaching status and parsed error info.
 */

export async function fetcher(url) {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    try {
      error.info = await res.json();
    } catch {
      error.info = { statusText: res.statusText };
    }
    error.status = res.status;
    throw error;
  }

  return res.json();
}

export default fetcher;
