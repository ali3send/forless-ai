// src/components/website/WebsiteTemplateBasic.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { WebsiteData } from "@/lib/websiteTypes";
import { fetchUnsplashImage } from "@/lib/unsplash";
import Image from "next/image";
import Link from "next/link";

type Theme = {
  primary?: string; // e.g. "#10b981"
  secondary?: string; // e.g. "#0f172a"
  primaryHover?: string; // optional; if not provided we compute
  fontFamily?: string;
};

type Props = {
  data: WebsiteData;
  theme?: Theme;
};

export function WebsiteTemplateBasic({ data, theme }: Props) {
  const [heroImage, setHeroImage] = useState("");
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    fetchUnsplashImage(data.hero.imageQuery).then(setHeroImage);
    fetchUnsplashImage(data.about.imageQuery).then(setAboutImage);
  }, [data.hero.imageQuery, data.about.imageQuery]);

  // Compute hover color if missing
  const computedPrimaryHover =
    theme?.primaryHover ??
    (theme?.primary ? lightenHex(theme.primary, 12) : undefined);

  // CSS variable fallback: if not provided, your global CSS can still define them
  const themeStyle: React.CSSProperties = {
    ...(theme?.primary ? cssVar("--color-primary", theme.primary) : {}),
    ...(computedPrimaryHover
      ? cssVar("--color-primary-hover", computedPrimaryHover)
      : {}),
    ...(theme?.secondary ? cssVar("--color-secondary", theme.secondary) : {}),
    ...(theme?.fontFamily ? { fontFamily: theme.fontFamily } : {}),
  };

  // Local “resolved” colors for inline style usage
  const primary = theme?.primary ?? "var(--color-primary)";
  const primaryHover = computedPrimaryHover ?? "var(--color-primary-hover)";
  const secondary = theme?.secondary ?? "var(--color-secondary)";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50" style={themeStyle}>
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="font-semibold">{data.brandName}</div>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#about">About</a>
            <a href="#offers">{data.offers.title}</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
        <div>
          <p
            className="text-xs uppercase tracking-[0.2em]"
            style={{ color: primaryHover }}
          >
            {data.tagline}
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            {data.hero.headline}
          </h1>

          <p className="mt-4 text-sm text-slate-300">{data.hero.subheadline}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={data.hero.primaryCtaLink || "#"}
              className="rounded-full cursor-pointer px-5 py-2 text-sm font-medium text-slate-950 transition"
              style={{
                backgroundColor: primary,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  String(primaryHover);
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  String(primary);
              }}
            >
              {data.hero.primaryCta}
            </Link>

            <Link
              href={data.hero.secondaryCtaLink || "#"}
              className="rounded-full border border-slate-600 px-5 py-2 text-sm font-medium transition"
              style={{
                // subtle tint from primary
                backgroundColor: withAlpha(primary, 0.08),
                borderColor: withAlpha(primary, 0.35),
              }}
            >
              {data.hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={data.brandName}
              width={500}
              height={800}
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-slate-800 animate-pulse" />
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-t border-slate-800 bg-slate-900/40">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">{data.about.title}</h2>
            <p className="mt-4 text-sm text-slate-300">{data.about.body}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            {aboutImage ? (
              <Image
                src={aboutImage}
                alt={data.about.title}
                width={500}
                height={800}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-slate-800 animate-pulse" />
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold">{data.features.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {data.features.items.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4"
                style={{
                  borderColor: withAlpha(primary, 0.22),
                }}
              >
                <div className="text-sm font-medium">{item.label}</div>
                <p className="mt-2 text-xs text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers */}
      <section
        id="offers"
        className="border-t border-slate-800 bg-slate-900/40"
      >
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h2 className="text-xl font-semibold">{data.offers.title}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {data.offers.items.map((offer, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                style={{ borderColor: withAlpha(primary, 0.22) }}
              >
                <div>
                  <div className="text-sm font-semibold">{offer.name}</div>
                  <p className="mt-2 text-xs text-slate-300">
                    {offer.description}
                  </p>
                </div>
                {offer.priceLabel && (
                  <div
                    className="mt-3 text-xs font-medium"
                    style={{ color: primaryHover }}
                  >
                    {offer.priceLabel}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact + Final CTA */}
      <section
        id="contact"
        className="border-t border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950"
      >
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold">{data.contact.title}</h2>
            <p className="mt-3 text-sm text-slate-300">
              {data.contact.description}
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Contact details */}
            <div className="space-y-4 text-sm">
              <div
                className="rounded-2xl border bg-slate-950/60 p-4"
                style={{
                  borderColor: withAlpha(primary, 0.22),
                }}
              >
                <h3 className="text-sm font-semibold text-slate-100">
                  Contact details
                </h3>
                <p className="mt-2 text-xs text-slate-400">
                  Prefer email, WhatsApp, or a quick call? Reach us using any of
                  the options below.
                </p>

                <div className="mt-4 space-y-2">
                  <Row label="Email" value={data.contact.email} />
                  {data.contact.whatsapp && (
                    <Row label="WhatsApp" value={data.contact.whatsapp} />
                  )}
                  {data.contact.phone && (
                    <Row label="Phone" value={data.contact.phone} />
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400">
                We usually reply within 24 hours on business days.
              </p>
            </div>

            {/* Contact form */}
            <form
              className="rounded-2xl border bg-slate-950/80 p-6 shadow-lg shadow-slate-950/40"
              style={{ borderColor: withAlpha(primary, 0.22) }}
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="text-lg font-semibold text-slate-100">
                {data.finalCta.headline}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                {data.finalCta.subheadline}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Input
                  label="Your name"
                  placeholder="Enter your name"
                  focusColor={primary}
                />
                <Input
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  focusColor={primary}
                />
              </div>

              <label className="mt-3 block text-xs text-slate-300">
                Message
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none"
                  style={{ borderColor: withAlpha(primary, 0.25) }}
                  placeholder="Tell us a bit about what you need help with..."
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = String(primary))
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = String(
                      withAlpha(primary, 0.25)
                    ))
                  }
                />
              </label>

              <button
                type="submit"
                className="mt-4 rounded-full px-5 py-2 text-sm font-medium text-slate-950 transition"
                style={{ backgroundColor: primary }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    String(primaryHover);
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    String(primary);
                }}
              >
                {data.finalCta.buttonLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>
            © {new Date().getFullYear()} {data.brandName}
          </span>
          <span>Made with ❤️ by ForlessAI</span>
        </div>
      </footer>
    </div>
  );
}

/** ---------- Small UI helpers ---------- */

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <span className="text-xs font-medium text-slate-100">{value}</span>
    </div>
  );
}

function Input({
  label,
  placeholder,
  type = "text",
  focusColor,
}: {
  label: string;
  placeholder: string;
  type?: string;
  focusColor: string;
}) {
  const baseBorder = withAlpha(focusColor, 0.25);
  return (
    <label className="text-xs text-slate-300">
      {label}
      <input
        type={type}
        className="mt-1 w-full rounded-md border bg-slate-900 px-2 py-1.5 text-xs text-slate-100 outline-none"
        style={{ borderColor: baseBorder }}
        placeholder={placeholder}
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = String(focusColor))
        }
        onBlur={(e) => (e.currentTarget.style.borderColor = String(baseBorder))}
      />
    </label>
  );
}

/** ---------- Color helpers (safe + no deps) ---------- */

function cssVar(name: string, value: string): React.CSSProperties {
  return { [name as any]: value } as React.CSSProperties;
}

// Supports hex ("#rrggbb") or CSS var string ("var(--color-primary)")
function withAlpha(color: string, alpha: number): string {
  if (color.startsWith("var(")) {
    // can't compute rgba from css var without extra work; use it as-is with opacity-like fallback
    return color;
  }
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${clamp(alpha, 0, 1)})`;
}

function lightenHex(hex: string, amountPct: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const amt = clamp(amountPct, 0, 100) / 100;
  const r = Math.round(rgb.r + (255 - rgb.r) * amt);
  const g = Math.round(rgb.g + (255 - rgb.g) * amt);
  const b = Math.round(rgb.b + (255 - rgb.b) * amt);
  return rgbToHex(r, g, b);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "").trim();
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const v = clamp(Math.round(x), 0, 255).toString(16);
        return v.length === 1 ? "0" + v : v;
      })
      .join("")
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
