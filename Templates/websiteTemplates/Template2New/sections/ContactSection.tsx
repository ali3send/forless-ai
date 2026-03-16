import { useContactForm } from "../../hooks/useContacForm";
import { ContactData, FinalCtaData, SectionColors } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  websiteId: string;
} & SectionColors;

export function ContactSection({
  contact,
  finalCta,
  websiteId,
  bgColor,
  headingColor,
  textColor,
  accentColor,
  buttonBg,
  buttonText,
  cardBg,
  inputBg,
  inputText,
  inputPlaceholder,
}: Props) {
  const { submit, loading, success, error } = useContactForm(websiteId);

  return (
    <section
      id="contact"
      style={{
        background: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2
            className="text-2xl font-bold md:text-3xl"
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {contact.title}
          </h2>
          <p
            className="mt-2 text-sm"
            style={{ color: textColor || "var(--color-muted)" }}
          >
            {contact.description}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 md:grid-cols-2">
          <div className="space-y-5 text-sm pt-1">
            <h3
              className="text-sm font-semibold"
              style={{ color: headingColor || "var(--color-text)" }}
            >
              Contact details
            </h3>
            <div className="space-y-3">
              <ContactRow
                type="email"
                value={contact.email}
                textColor={textColor}
                accentColor={accentColor}
              />
              {contact.whatsapp && (
                <ContactRow
                  type="whatsapp"
                  value={contact.whatsapp}
                  textColor={textColor}
                  accentColor={accentColor}
                />
              )}
              {contact.phone && (
                <ContactRow
                  type="phone"
                  value={contact.phone}
                  textColor={textColor}
                  accentColor={accentColor}
                />
              )}
            </div>
            <p
              className="pt-3 text-xs"
              style={{ color: textColor || "var(--color-muted)" }}
            >
              We usually reply within 24 hours on business days.
            </p>
          </div>

          <form
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: cardBg || "var(--color-surface)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 15%, transparent)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: headingColor || "var(--color-text)" }}
            >
              {finalCta.headline}
            </h3>
            <p
              className="mt-2 text-sm"
              style={{ color: textColor || "var(--color-muted)" }}
            >
              {finalCta.subheadline}
            </p>

            <div className="mt-4 space-y-3">
              <TextInput
                label="Name"
                name="name"
                placeholder="Enter your name"
                labelColor={headingColor}
                inputBg={inputBg}
                inputText={inputText}
                inputPlaceholder={inputPlaceholder}
              />
              <TextInput
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                labelColor={headingColor}
                inputBg={inputBg}
                inputText={inputText}
                inputPlaceholder={inputPlaceholder}
              />
              <TextInput
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                labelColor={headingColor}
                inputBg={inputBg}
                inputText={inputText}
                inputPlaceholder={inputPlaceholder}
              />
            </div>

            <label
              className="mt-3 block text-xs"
              style={{ color: headingColor || "var(--color-muted)" }}
            >
              Message
              {inputPlaceholder && (
                <style>{`.t2-contact-textarea::placeholder { color: ${inputPlaceholder} !important; }`}</style>
              )}
              <textarea
                name="message"
                rows={4}
                className="t2-contact-textarea mt-1 w-full rounded-lg border px-3 py-2 text-xs outline-none"
                style={{
                  backgroundColor: inputBg || "var(--color-bg)",
                  color: inputText || "var(--color-text)",
                  borderColor:
                    "color-mix(in srgb, var(--color-primary) 20%, transparent)",
                }}
                placeholder="Tell us about your project..."
              />
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: buttonBg || "var(--color-primary)",
                color: buttonText || "var(--color-bg)",
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
