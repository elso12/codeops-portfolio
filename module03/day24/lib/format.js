// Shared formatting module for Addis Eats (Day 22 / Day 47)
// Built once at module level for optimal performance

export const etb = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0
});

export const when = new Intl.DateTimeFormat("en-ET", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Africa/Addis_Ababa" // EAT, UTC+3
});

export const relative = new Intl.RelativeTimeFormat("en", {
  numeric: "auto"
});

/**
 * Convenience helper to compute relative time string from any Date/timestamp
 * @param {Date|string|number} dateInput
 * @returns {string} e.g. "12 minutes ago", "in 5 minutes", "just now"
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  if (Math.abs(diffInSeconds) < 45) {
    return diffInSeconds <= 0 ? "just now" : "in moments";
  }
  if (Math.abs(diffInMinutes) < 60) {
    return relative.format(diffInMinutes, "minute");
  }
  if (Math.abs(diffInHours) < 24) {
    return relative.format(diffInHours, "hour");
  }
  return relative.format(diffInDays, "day");
}
