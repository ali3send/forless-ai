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
      className="sticky top-0 z-50 bg-(--color-bg)/80 backdrop-blur-md"
      style={{
        borderBottom:
          "1px solid color-mix(in srgb, var(--color-primary) 10%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <div className="text-base font-bold text-text">{brandName}</div>
        </div>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="#" className="text-(--color-muted) transition hover:text-text">
            Home
          </a>
          <a href="#about" className="text-(--color-muted) transition hover:text-text">
            About
          </a>
          <a href="#features" className="text-(--color-muted) transition hover:text-text">
            Our Features
          </a>
          <a href="#offers" className="text-(--color-muted) transition hover:text-text">
            {offersTitle}
          </a>
          <a href="#contact" className="text-(--color-muted) transition hover:text-text">
            Get in Touch
          </a>
        </nav>
      </div>
    </header>
  );
}
