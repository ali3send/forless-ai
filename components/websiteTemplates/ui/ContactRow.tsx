type Props = {
  label: string;
  value: string;
};

export function ContactRow({ label, value }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-(--color-muted)">{label}</span>
      <span className="text-xs font-medium text-text">{value}</span>
    </div>
  );
}
