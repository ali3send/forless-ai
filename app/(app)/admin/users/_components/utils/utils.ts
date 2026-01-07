export function fmtDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export function initials(name?: string | null, email?: string | null) {
  const base = (name?.trim() || email?.trim() || "U").split(/\s+/);
  const a = base[0]?.[0] || "U";
  const b = base.length > 1 ? base[1]?.[0] : "";
  return (a + b).toUpperCase();
}
