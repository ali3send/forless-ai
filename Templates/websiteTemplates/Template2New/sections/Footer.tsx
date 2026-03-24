import { ContactData } from "../../template.types";

type Props = {
  brandName: string;
  tagline?: string;
  contact?: ContactData;
  bgColor?: string;
  textColor?: string;
};

export function Footer({ brandName, tagline, contact, bgColor, textColor }: Props) {
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
                { label: "Solutions", href: "#features" },
                { label: "Plans", href: "#offers" },
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
