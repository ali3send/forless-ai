import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";
import { NavbarData } from "../../template.types";

export function Navbar({
  brandName,
  offersTitle,
  logoSvg,
  primary,
  bgColor,
  textColor,
  buttonBg,
  buttonText,
}: NavbarData) {
  const linkStyle = textColor ? { color: textColor } : undefined;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: bgColor
          ? `color-mix(in srgb, ${bgColor} 80%, transparent)`
          : "color-mix(in srgb, var(--color-bg) 80%, transparent)",
        borderBottom:
          "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <div className="text-base font-bold" style={{ color: textColor || "var(--color-text)" }}>{brandName}</div>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="#" className="transition hover:opacity-80" style={linkStyle || { color: "var(--color-muted)" }}>
            Home
          </a>
          <a href="#about" className="transition hover:opacity-80" style={linkStyle || { color: "var(--color-muted)" }}>
            About
          </a>
          <a href="#features" className="transition hover:opacity-80" style={linkStyle || { color: "var(--color-muted)" }}>
            Our Features
          </a>
          <a href="#offers" className="transition hover:opacity-80" style={linkStyle || { color: "var(--color-muted)" }}>
            {offersTitle}
          </a>
          <a
            href="#contact"
            className="rounded-full px-5 py-1.5 text-xs font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: buttonBg || "var(--color-primary)",
              color: buttonText || "var(--color-bg)",
            }}
          >
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
}
