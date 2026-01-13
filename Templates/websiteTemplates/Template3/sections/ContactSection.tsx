import { useContactForm } from "../../hooks/useContacForm";
import { ContactData, FinalCtaData } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  projectId: string;
};

export function ContactSection({ contact, finalCta, projectId }: Props) {
  const { submit, loading, success, error } = useContactForm(projectId);

  return (
    <section
      id="contact"
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 85%, black), var(--color-bg))",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-28">
        {/* Intro */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-text">
            {contact.title}
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-(--color-muted)">
            {contact.description}
          </p>
        </div>

        {/* CTA band */}
        <div
          className="
            mx-auto max-w-3xl
            rounded-3xl px-8 py-10
          "
          style={{
            background: "color-mix(in srgb, var(--color-bg) 92%, black)",
            border:
              "1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)",
          }}
        >
          <div className="grid gap-10 md:grid-cols-2">
            {/* Left: form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(e.currentTarget);
              }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-text">
                {finalCta.headline}
              </h3>

              <p className="text-xs text-(--color-muted)">
                {finalCta.subheadline}
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <TextInput
                  name="name"
                  label="name"
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
                  rows={3}
                  className="
                    mt-1 w-full rounded-md border px-3 py-2
                    text-xs outline-none
                    bg-(--color-bg)
                    text-text
                  "
                  name="message"
                  style={{
                    borderColor:
                      "color-mix(in srgb, var(--color-primary) 22%, transparent)",
                  }}
                  placeholder="Tell us briefly what you’re looking for…"
                />
              </label>

              <button
                disabled={loading || success}
                type="submit"
                className="
                  inline-flex items-center justify-center
                  rounded-full px-6 py-2.5
                  text-sm font-medium transition
                  bg-primary
                  text-white
                  hover:opacity-90
                "
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
            <div className="space-y-4 text-sm">
              <ContactRow label="Email" value={contact.email} />

              {contact.whatsapp && (
                <ContactRow label="WhatsApp" value={contact.whatsapp} />
              )}

              {contact.phone && (
                <ContactRow label="Phone" value={contact.phone} />
              )}

              <p className="pt-4 text-xs text-(--color-muted)">
                We usually reply within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
