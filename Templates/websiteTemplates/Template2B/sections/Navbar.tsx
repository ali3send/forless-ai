import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";
import { NavbarData } from "../../template.types";

export function Navbar({
  brandName,
  offersTitle,
  logoSvg,
  primary,
}: NavbarData) {
  return (
    <header
      className="border-b"
      style={{
        borderColor:
          "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <div className="text-lg font-bold text-text">{brandName}</div>
        </div>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          <a
            href="#about"
            className="text-(--color-muted) transition hover:text-text"
          >
            About
          </a>
          <a
            href="#offers"
            className="text-(--color-muted) transition hover:text-text"
          >
            {offersTitle}
          </a>
          <a
            href="#contact"
            className="rounded-full px-4 py-1.5 text-xs font-semibold transition"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-bg)",
            }}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
