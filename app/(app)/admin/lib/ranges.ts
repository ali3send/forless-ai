export function getRangeStart(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

export function rangeLabel(range: "1d" | "7d" | "30d") {
  if (range === "1d") return "today";
  if (range === "7d") return "last 7 days";
  return "last 30 days";
}
