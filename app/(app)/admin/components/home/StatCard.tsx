function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border border-secondary-active
        bg-bg-card
        p-5
      "
    >
      <div className="text-xs text-(--color-text-muted)">{label}</div>

      <div className="mt-2 text-2xl font-semibold text-text">{value}</div>

      <div className="mt-1 text-xs text-(--color-text-muted)">{hint}</div>
    </div>
  );
}

export default StatCard;
