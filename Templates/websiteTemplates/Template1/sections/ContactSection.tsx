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
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 8%, var(--color-bg)), color-mix(in srgb, var(--color-primary) 3%, var(--color-bg)))",
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text">{contact.title}</h2>
          <p className="mt-2 text-sm text-(--color-muted)">
            {contact.description}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 md:grid-cols-2">
          {/* Contact details */}
          <div className="space-y-5 text-sm pt-2">
            <h3 className="text-sm font-semibold text-text">Contact details</h3>

            <div className="space-y-3">
              <ContactRow type="email" value={contact.email} />
              {contact.whatsapp && (
                <ContactRow type="whatsapp" value={contact.whatsapp} />
              )}
              {contact.phone && (
                <ContactRow type="phone" value={contact.phone} />
              )}
            </div>

            <p className="pt-3 text-xs text-(--color-muted)">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          {/* Contact form */}
          <form
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 15%, transparent)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <h3 className="text-lg font-semibold text-text">
              {finalCta.headline}
            </h3>
            <p className="mt-2 text-sm text-(--color-muted)">
              {finalCta.subheadline}
            </p>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Name"
                name="name"
                placeholder="Enter your name"
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <label className="mt-3 block text-xs text-(--color-muted)">
              Message
              <textarea
                name="message"
                rows={4}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none bg-(--color-bg) text-text"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>

            {success && (
              <p className="mt-3 text-xs text-green-600">
                Thanks! Your message has been sent.
              </p>
            )}
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
