export function formatDate(
  date?: string | Date | null,
  fallback = "—"
): string {
  if (!date) return fallback;

  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return fallback;

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}
