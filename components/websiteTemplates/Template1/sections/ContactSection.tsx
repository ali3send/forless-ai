import { ContactData, FinalCtaData } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
};

export function ContactSection({ contact, finalCta }: Props) {
  return (
    <section
      id="contact"
      className="border-t"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Heading */}
        <div className="max-w-xl">
          <h2 className="text-xl font-semibold text-text">{contact.title}</h2>
          <p className="mt-3 text-sm text-(--color-muted)">
            {contact.description}
          </p>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-4 text-sm">
            <div
              className="rounded-2xl border p-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              }}
            >
              <h3 className="text-sm font-semibold text-text">
                Contact details
              </h3>
              <p className="mt-2 text-xs text-(--color-muted)">
                Prefer email, WhatsApp, or a quick call? Reach us using any of
                the options below.
              </p>

              <div className="mt-4 space-y-2">
                <ContactRow label="Email" value={contact.email} />
                {contact.whatsapp && (
                  <ContactRow label="WhatsApp" value={contact.whatsapp} />
                )}
                {contact.phone && (
                  <ContactRow label="Phone" value={contact.phone} />
                )}
              </div>
            </div>

            <p className="text-xs text-(--color-muted)">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          {/* Contact form */}
          <form
            className="rounded-2xl border p-6 shadow-lg"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              boxShadow:
                "0 20px 40px color-mix(in srgb, var(--color-bg) 60%, transparent)",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-lg font-semibold text-text">
              {finalCta.headline}
            </h3>
            <p className="mt-2 text-sm text-(--color-muted)">
              {finalCta.subheadline}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TextInput label="Your name" placeholder="Enter your name" />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <label className="mt-3 block text-xs text-(--color-muted)">
              Message
              <textarea
                rows={4}
                className="
                  mt-1 w-full rounded-md border px-2 py-1.5
                  text-xs outline-none
                  bg-(-color-bg)
                  text-text
                "
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>

            <button
              type="submit"
              className="
                mt-4 rounded-full px-5 py-2
                text-sm font-medium transition
                bg-primary
                text-slate-950
                hover:opacity-90
              "
            >
              {finalCta.buttonLabel}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
