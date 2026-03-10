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
          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
      }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-xs"
        style={{ color: textColor || "var(--color-muted)" }}
      >
        <span>
          © {new Date().getFullYear()} {brandName}
        </span>
        <a href="#" className="transition hover:opacity-80">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
}
