// components/website/sections/Navbar.tsx

import { Eye } from "lucide-react";
import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";
import { NavbarData } from "../../template.types";

export function Navbar({
  brandName,
  offersTitle,
  featuresTitle,
  logoSvg,
  primary,
  showEditorButtons,
}: NavbarData) {
  return (
    <header
      className="sticky top-0 z-50 border-b bg-white"
      style={{ borderColor: "#e5e7eb" }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{
          width: 918,
          minHeight: 53,
          padding: 8,
          gap: 8,
        }}
      >
        <div className="flex items-center gap-2">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <span className="text-sm font-semibold text-slate-700">{brandName}</span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a href="#" className="transition hover:text-slate-900">
            Home
          </a>
          <a href="#about" className="transition hover:text-slate-900">
            About
          </a>
          <a href="#features" className="transition hover:text-slate-900">
            {featuresTitle}
          </a>
          <a href="#offers" className="transition hover:text-slate-900">
            {offersTitle}
          </a>
          <a href="#contact" className="transition hover:text-slate-900">
            Get in Touch
          </a>
          {showEditorButtons && (
            <div className="ml-4 flex items-center gap-2" style={{ gap: 8 }}>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full text-sm font-medium transition"
                style={{
                  width: 90,
                  minHeight: 32,
                  padding: "8px 20px",
                  gap: 8,
                  border: "1px solid #0149E1",
                  color: "#0149E1",
                  backgroundColor: "white",
                }}
              >
                <Eye className="h-4 w-4 shrink-0" />
                Preview
              </button>
              <button
                type="button"
                className="flex items-center justify-center rounded-full text-sm font-semibold text-white transition"
                style={{
                  width: 85,
                  minHeight: 32,
                  padding: "8px 20px",
                  gap: 8,
                  backgroundColor: primary || "#2563eb",
                }}
              >
                publish
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
