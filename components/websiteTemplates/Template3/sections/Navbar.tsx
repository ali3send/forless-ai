// components/website/sections/Navbar.tsx

import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";
import { NavbarData } from "../../template.types";

export function Navbar({
  brandName,
  offersTitle,
  logoSvg,
  primary,
}: NavbarData) {
  return (
    <header className="relative z-20">
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <div
          className="
            flex items-center justify-between
            rounded-2xl px-5 py-3
          "
          style={{
            background: "color-mix(in srgb, var(--color-bg) 92%, black)",
            border:
              "1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)",
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2">
            {logoSvg && (
              <div className="">
                <BrandLogo
                  svg={logoSvg}
                  primary={primary}
                  secondary={primary}
                />
              </div>
            )}

            <span className="text-sm font-medium tracking-tight text-text">
              {brandName}
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 text-xs md:flex">
            <a
              href="#about"
              className="transition hover:opacity-80"
              style={{ color: "var(--color-muted)" }}
            >
              About
            </a>

            <a
              href="#offers"
              className="transition hover:opacity-80"
              style={{ color: "var(--color-muted)" }}
            >
              {offersTitle}
            </a>

            <a
              href="#contact"
              className="text-xs font-medium transition"
              style={{ color: primary }}
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
