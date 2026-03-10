type Props = {
  brandName: string;
  bgColor?: string;
  textColor?: string;
};

export function Footer({ brandName, bgColor, textColor }: Props) {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: bgColor || undefined,
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div
        className="mx-auto max-w-6xl px-6 py-6 text-center text-xs"
        style={{ color: textColor || "var(--color-muted)" }}
      >
        <span>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
