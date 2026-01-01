type Props = {
  label: string;
  placeholder: string;
  type?: string;
};

export function TextInput({ label, placeholder, type = "text" }: Props) {
  return (
    <label className="text-xs text-[var(--color-muted)]">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="
          mt-1 w-full rounded-md border px-2 py-1.5
          text-xs outline-none
          bg-[var(--color-bg)]
          text-[var(--color-text)]
          transition
        "
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-primary) 25%, transparent)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--color-primary)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor =
            "color-mix(in srgb, var(--color-primary) 25%, transparent)";
        }}
      />
    </label>
  );
}
