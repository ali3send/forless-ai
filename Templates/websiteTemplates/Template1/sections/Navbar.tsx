import BrandLogo from "@/app/(app)/brand/_components/BrandLogo";
import { NavbarData } from "../../template.types";
import type { LayoutKey } from "../../templates";

type Props = NavbarData & { layout: LayoutKey };

export function Navbar({
  brandName,
  offersTitle,
  logoSvg,
  primary,
  bgColor,
  textColor,
  buttonBg,
  buttonText,
  layout,
}: Props) {
  const links = [
    { label: "Home", href: "#" },
    { label: "Categories", href: "#features" },
    { label: offersTitle, href: "#offers" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  if (layout === "immersive") {
    return (
      <header
        className="z-30"
        style={{ backgroundColor: bgColor || "var(--color-bg)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            {logoSvg && (
              <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
            )}
            <div
              className="text-lg font-bold"
              style={{ color: textColor || "var(--color-text)" }}
            >
              {brandName}
            </div>
          </div>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:opacity-80"
                style={{ color: textColor || "var(--color-muted)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
    );
  }

  if (layout === "modern") {
    return (
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-md"
        style={{
          backgroundColor:
            bgColor
              ? `color-mix(in srgb, ${bgColor} 80%, transparent)`
              : "color-mix(in srgb, var(--color-bg) 80%, transparent)",
          borderColor:
            "color-mix(in srgb, var(--color-primary) 12%, transparent)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            {logoSvg && (
              <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
            )}
            <div
              className="text-lg font-bold"
              style={{ color: textColor || "var(--color-text)" }}
            >
              {brandName}
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {links.slice(0, 4).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition hover:opacity-80"
                style={{ color: textColor || "var(--color-muted)" }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full px-5 py-2 text-xs font-semibold transition hover:opacity-90"
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

  // basic
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: bgColor || "var(--color-bg)",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 10%, transparent)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          {logoSvg && (
            <BrandLogo svg={logoSvg} primary={primary} secondary={primary} />
          )}
          <div
            className="text-lg font-bold"
            style={{ color: textColor || "var(--color-text)" }}
          >
            {brandName}
          </div>
        </div>

        <nav className="hidden gap-8 text-sm font-medium md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition hover:opacity-80"
              style={{ color: textColor || "var(--color-muted)" }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
