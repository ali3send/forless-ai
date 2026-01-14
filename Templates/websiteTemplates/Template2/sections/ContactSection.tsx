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

        <div className="mt-12 grid items-start gap-10 md:grid-cols-2">
          {/* LEFT: Contact details */}
          <div className="space-y-6 pt-2">
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
                <ContactRow type="email" value={contact.email} />

                {contact.whatsapp && (
                  <ContactRow type="whatsapp" value={contact.whatsapp} />
                )}

                {contact.phone && (
                  <ContactRow type="phone" value={contact.phone} />
                )}
              </div>
            </div>

            <p className="text-xs text-(--color-muted)">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          {/* RIGHT: Contact form */}
          <form
            className="relative rounded-2xl border p-8"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 22%, transparent)",
              boxShadow:
                "0 30px 60px color-mix(in srgb, var(--color-bg) 65%, transparent)",
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

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

            <label className="mt-4 block text-xs text-(--color-muted)">
              Message
              <textarea
                rows={4}
                name="message"
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
              disabled={loading || success}
              type="submit"
              className="
                mt-6 inline-flex items-center justify-center
                rounded-full px-6 py-2.5
                text-sm font-medium transition
                bg-primary
                text-white
                hover:opacity-90
                disabled:opacity-60
              "
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
