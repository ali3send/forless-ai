type Props = {
  label: string;
  placeholder: string;
  type?: string;
  name?: string;
  labelColor?: string;
  inputBg?: string;
  inputText?: string;
  inputPlaceholder?: string;
};

export function TextInput({ label, placeholder, type, name = "text", labelColor, inputBg, inputText, inputPlaceholder }: Props) {
  const placeholderStyle = inputPlaceholder
    ? { "--placeholder-color": inputPlaceholder } as React.CSSProperties
    : {};

  return (
    <label className="text-xs" style={{ color: labelColor || "var(--color-muted)" }}>
      {label}
      <style>{`
        .custom-placeholder::placeholder { color: var(--placeholder-color, var(--color-muted)) !important; }
      `}</style>
      <input
        type={type}
        placeholder={placeholder}
        className="
          custom-placeholder
          mt-1 w-full rounded-md border px-2 py-1.5
          text-xs outline-none
          transition
        "
        name={name}
        style={{
          backgroundColor: inputBg || "var(--color-bg)",
          color: inputText || "var(--color-text)",
          borderColor:
            "color-mix(in srgb, var(--color-primary) 25%, transparent)",
          ...placeholderStyle,
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
