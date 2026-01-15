// lib/usage/period.ts

export function getNormalizedPeriodEnd(input?: string | Date | null): string {
  const d = input ? new Date(input) : new Date();

  // End of current month, 00:00 UTC
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 0, 0, 0)
  ).toISOString();
}
