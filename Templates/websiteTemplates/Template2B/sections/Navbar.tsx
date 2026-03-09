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
      className="border-b"
      style={{
        backgroundColor: bgColor || undefined,
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <div className="text-lg font-bold" style={{ color: textColor || "var(--color-text)" }}>{brandName}</div>
        </div>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a
            href="#about"
            className="transition hover:opacity-80"
            style={linkStyle || { color: "var(--color-muted)" }}
          >
            About
          </a>
          <a
            href="#offers"
            className="transition hover:opacity-80"
            style={linkStyle || { color: "var(--color-muted)" }}
          >
            {offersTitle}
          </a>
          <a
            href="#contact"
            className="rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
            style={{
              backgroundColor: buttonBg || "var(--color-primary)",
              color: buttonText || "var(--color-bg)",
            }}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
