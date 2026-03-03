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
    <header className="relative z-20 border-b bg-(--color-surface)" style={{ borderColor: "var(--color-muted, #e5e7eb)" }}>
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
          <span className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{brandName}</span>
        </div>

        <nav className="hidden shrink-0 items-center gap-8 text-sm md:flex" style={{ color: "var(--color-muted)" }}>
          <a href="#" className="shrink-0 transition" style={{ color: "inherit" }}>
            Home
          </a>
          <a href="#about" className="shrink-0 transition" style={{ color: "inherit" }}>
            About
          </a>
          <a href="#features" className="shrink-0 transition" style={{ color: "inherit" }}>
            {featuresTitle || "Features"}
          </a>
          <a href="#offers" className="shrink-0 transition" style={{ color: "inherit" }}>
            {offersTitle || "Product"}
          </a>
          <a href="#contact" className="shrink-0 transition" style={{ color: "inherit" }}>
            Get in Touch
          </a>
          {showEditorButtons && (
            <div className="ml-4 flex shrink-0 items-center gap-2" style={{ gap: 8 }}>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full text-sm font-medium transition"
                style={{
                  width: 90,
                  minHeight: 32,
                  padding: "8px 20px",
                  gap: 8,
                  border: "1px solid var(--color-primary, #0149E1)",
                  color: "var(--color-primary, #0149E1)",
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
