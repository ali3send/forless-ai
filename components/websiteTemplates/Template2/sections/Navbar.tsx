// components/website/sections/Navbar.tsx

import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";

type Props = {
  brandName: string;
  offersTitle: string;
  logoSvg: string | null;
  primary: string;
};

export function Navbar({ brandName, offersTitle, logoSvg, primary }: Props) {
  return (
    <header
      className="
        sticky top-0 z-50
        border-b
        backdrop-blur
      "
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 85%, transparent)",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          {logoSvg && (
            <div className="h-6 w-6">
              <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
            </div>
          )}

          <span className="text-sm font-semibold text-text">{brandName}</span>
        </div>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 text-xs font-medium md:flex">
          <a
            href="#about"
            className="transition hover:text-text"
            style={{ color: "var(--color-muted)" }}
          >
            About
          </a>

          <a
            href="#offers"
            className="transition hover:text-text"
            style={{ color: "var(--color-muted)" }}
          >
            {offersTitle}
          </a>

          <a
            href="#contact"
            className="
              rounded-full px-4 py-1.5
              transition
              text-white
            "
            style={{
              backgroundColor: primary,
            }}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
