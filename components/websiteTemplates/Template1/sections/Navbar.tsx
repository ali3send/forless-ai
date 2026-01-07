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
    <header className="border-b border-secondary-dark">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}

          <div className="font-semibold">{brandName}</div>
        </div>

        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#about">About</a>
          <a href="#offers">{offersTitle}</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
