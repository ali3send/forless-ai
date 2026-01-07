export function calcDelta(current: number, prev = 0) {
  return current - prev;
}

export function calcTrend(current: number, prev = 0) {
  if (prev === 0 && current === 0) return 0;
  if (prev === 0) return 100;
  return ((current - prev) / prev) * 100;
}
