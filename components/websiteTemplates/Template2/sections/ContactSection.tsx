// import { ContactRow } from "../ui/ContactRow";
// import { TextInput } from "../ui/TextInput";

import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";

type ContactData = {
  title: string;
  description: string;
  email: string;
  whatsapp?: string;
  phone?: string;
};

type FinalCtaData = {
  headline: string;
  subheadline: string;
  buttonLabel: string;
};

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
};

export function ContactSection({ contact, finalCta }: Props) {
  return (
    <section
      id="contact"
      className="relative border-t"
      style={{
        background:
          "linear-gradient(180deg, var(--color-bg), color-mix(in srgb, var(--color-bg) 80%, black))",
        borderColor:
          "color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-20">
        {/* Heading */}
        <div className="max-w-xl">
          <div
            className="mb-4 h-1 w-10 rounded-full"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 85%, white)",
            }}
          />
          <h2 className="text-2xl font-semibold tracking-tight text-text">
            {contact.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-(--color-muted)">
            {contact.description}
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-6">
            <div
              className="rounded-2xl border p-6"
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
                Reach out using any of the options below — we’re happy to help.
              </p>

              <div className="mt-5 space-y-3">
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
            className="relative rounded-2xl border p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              boxShadow:
                "0 30px 60px color-mix(in srgb, var(--color-bg) 65%, transparent)",
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <h3 className="text-lg font-semibold text-text">
              {finalCta.headline}
            </h3>
            <p className="mt-2 text-sm text-(--color-muted)">
              {finalCta.subheadline}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <TextInput label="Your name" placeholder="Enter your name" />
              <TextInput
                label="Email"
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <label className="mt-4 block text-xs text-(--color-muted)">
              Message
              <textarea
                rows={4}
                className="
                  mt-1 w-full rounded-md border px-3 py-2
                  text-xs outline-none
                  bg-(--color-bg)
                  text-text
                  transition
                "
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-primary)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor =
                    "color-mix(in srgb, var(--color-primary) 25%, transparent)")
                }
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>

            <button
              type="submit"
              className="
                mt-6 inline-flex items-center justify-center
                rounded-full px-6 py-2.5
                text-sm font-medium transition
                bg-primary
                text-white
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
