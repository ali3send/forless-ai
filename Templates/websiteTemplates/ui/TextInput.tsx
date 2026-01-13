type Props = {
  label: string;
  placeholder: string;
  type?: string;
  name?: string;
};

export function TextInput({ label, placeholder, type, name = "text" }: Props) {
  return (
    <label className="text-xs text-(--color-muted)">
      {label}
      <input
        type={type}
        placeholder={placeholder}
        className="
          mt-1 w-full rounded-md border px-2 py-1.5
          text-xs outline-none
          bg-(--color-bg)
          t
          transition
        "
        name={name}
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
