import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  MessageCircle,
  Link2,
} from "lucide-react";
import { ContactData } from "../../template.types";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Link2,
  whatsapp: MessageCircle,
  youtube: Youtube,
  linkedin: Linkedin,
  x: ({ size, className }: { size?: number; className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 20 20 4M4 4l16 16" />
    </svg>
  ),
  github: Github,
};

type Props = {
  brandName: string;
  tagline?: string;
  contact?: ContactData;
  bgColor?: string;
  textColor?: string;
  socialLinks?: {
    show: boolean;
    links: { platform: string; url: string }[];
  };
};

export function Footer({ brandName, tagline, contact, bgColor, textColor, socialLinks }: Props) {
  const year = new Date().getFullYear();
  const mutedStyle = { color: textColor || "var(--color-muted)" };

  return (
    <footer
      style={{
        backgroundColor:
          bgColor || "color-mix(in srgb, var(--color-bg) 85%, black)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: textColor || "var(--color-text)" }}
            >
              {brandName}
            </div>
            {tagline && (
              <p className="mt-2 text-xs leading-relaxed" style={mutedStyle}>
                {tagline}
              </p>
            )}
            {socialLinks?.show && socialLinks.links.filter((l) => l.url).length > 0 && (
              <div className="mt-3 flex gap-3">
                {socialLinks.links
                  .filter((l) => l.url && SOCIAL_ICONS[l.platform])
                  .map((link) => {
                    const Icon = SOCIAL_ICONS[link.platform];
                    return (
                      <a
                        key={link.platform}
                        href={link.url.match(/^https?:\/\//) ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition hover:opacity-80"
                        style={mutedStyle}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: textColor || "var(--color-text)" }}
            >
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Home", href: "#" },
                { label: "About", href: "#about" },
                { label: "Products", href: "#offers" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs transition hover:opacity-80"
                    style={mutedStyle}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: textColor || "var(--color-text)" }}
            >
              Contact
            </h4>
            <ul className="mt-3 space-y-2 text-xs" style={mutedStyle}>
              {contact?.email && <li>{contact.email}</li>}
              {contact?.phone && <li>{contact.phone}</li>}
              {contact?.whatsapp && <li>WhatsApp: {contact.whatsapp}</li>}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: textColor || "var(--color-text)" }}
            >
              Newsletter
            </h4>
            <p className="mt-3 text-xs" style={mutedStyle}>
              Subscribe for updates and offers.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-full border px-3 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: "transparent",
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                  color: textColor || "var(--color-text)",
                }}
              />
              <button
                type="button"
                className="rounded-full px-4 py-1.5 text-xs font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-bg)",
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 text-center text-xs"
          style={{
            borderColor:
              "color-mix(in srgb, var(--color-primary) 12%, transparent)",
            ...mutedStyle,
          }}
        >
          © {year} {brandName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
