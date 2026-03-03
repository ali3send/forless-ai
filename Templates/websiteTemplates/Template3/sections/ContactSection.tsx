// components/website/sections/ContactSection.tsx
"use client";

import { useContactForm } from "../../hooks/useContacForm";
import { ContactData, FinalCtaData } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  websiteId: string;
};

export function ContactSection({ contact, finalCta, websiteId }: Props) {
  const { submit, loading, success, error } = useContactForm(websiteId);

  return (
    <section
      id="contact"
      className="w-full"
      style={{
        background: "var(--background-gradient, var(--color-surface))",
        borderTop: "1px solid #e5e7eb",
      }}
    >
      <div
        className="mx-auto flex flex-col"
        style={{
          width: "100%",
          maxWidth: 918,
          height: 713,
          paddingTop: 81,
          paddingRight: 32,
          paddingLeft: 32,
        }}
      >
        {/* Heading */}
        <div className="text-center">
          <h2
            style={{
              color: "var(--color-text-on-gradient, var(--color-text))",
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 0.4,
              marginBottom: 12,
            }}
          >
            {contact.title}
          </h2>
          <p
            style={{
              color: "var(--color-muted-on-gradient, var(--color-muted))",
              fontSize: 16,
              marginBottom: 40,
            }}
          >
            {contact.description}
          </p>
        </div>

        {/* CTA band */}
        <div
          className="rounded-3xl px-8 py-10"
          style={{
            background: "color-mix(in srgb, var(--color-bg) 92%, black)",
            border:
              "1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)",
          }}
        >
          <div className="grid items-stretch gap-14 md:grid-cols-2">
            {/* Left: form (static in templates) */}
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                submit(e.currentTarget);
              }}
            >
              <h3 className="text-lg font-semibold text-(--color-text)">
                Contact details
              </h3>
              <p className="text-xs text-(--color-muted)">
                {finalCta.subheadline}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                />
                <TextInput
                  label="Email"
                  placeholder="you@example.com"
                  type="email"
                  name="email"
                />
              </div>

              <label className="block text-xs text-(--color-muted)">
                Message
                <textarea
                  rows={8}
                  maxLength={400}
                  className="mt-1 w-full rounded-md border px-3 py-2 resize-none text-xs outline-none bg-(--color-bg) text-text"
                  placeholder="Tell us briefly what you’re looking for…"
                />
              </label>

              <button
                disabled={loading || success}
                type="submit"
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium bg-primary text-white opacity-60 cursor-not-allowed"
              >
                {loading
                  ? "Sending…"
                  : success
                  ? "Sent!"
                  : finalCta.buttonLabel}
              </button>
              {success && (
                <p className="mt-3 text-xs text-green-600">
                  Thanks! Your message has been sent.
                </p>
              )}
              {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
            </form>

            {/* Right: contact options */}
            <div className="space-y-4 text-sm pt-[42px]">
              <ContactRow type="email" value={contact.email} />

              {contact.whatsapp && (
                <ContactRow type="whatsapp" value={contact.whatsapp} />
              )}

              {contact.phone && <ContactRow type="phone" value={contact.phone} />}
            </div>

            <p
              className="pt-3"
              style={{
                color: "var(--color-muted-on-gradient, var(--color-muted))",
                fontSize: 12,
              }}
            >
              We usually reply within 24 hours on business days.
            </p>
          </div>

          {/* RIGHT: Contact form */}
          <form
            className="rounded-lg border bg-white p-6"
            style={{
              borderColor: "#e5e7eb",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <h3
              style={{
                color: "var(--color-text-on-gradient, var(--color-text))",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              {finalCta.headline}
            </h3>

            <p
              style={{
                color: "var(--color-muted-on-gradient, var(--color-muted))",
                fontSize: 14,
                marginBottom: 16,
              }}
            >
              {finalCta.subheadline}
            </p>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="Enter your name"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: "#e5e7eb",
                }}
              />
              <input
                name="email"
                type="email"
                placeholder="your@example.com"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: "#e5e7eb",
                }}
              />
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: "#e5e7eb",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mx-auto mt-4 rounded-lg text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                width: 339,
                height: 48,
                borderRadius: 10,
                backgroundColor: "var(--color-primary, #0149E1)",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>

            {success && (
              <p
                className="mt-3 text-xs text-green-600"
              >
                Thanks! Your message has been sent.
              </p>
            )}

            {error && (
              <p
                className="mt-3 text-xs text-red-600"
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
