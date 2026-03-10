import { useContactForm } from "../../hooks/useContacForm";
import { ContactData, FinalCtaData, SectionColors } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";
import type { LayoutKey } from "../../templates";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  websiteId: string;
  layout: LayoutKey;
} & SectionColors;

export function ContactSection({ contact, finalCta, websiteId, layout, bgColor, headingColor, textColor, accentColor, buttonBg, buttonText, cardBg, inputBg, inputText, inputPlaceholder }: Props) {
  const { submit, loading, success, error } = useContactForm(websiteId);

  if (layout === "immersive") {
    return (
      <section
        id="contact"
        style={{
          background:
            bgColor || "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 88%, black), color-mix(in srgb, var(--color-bg) 70%, black))",
          color: textColor || undefined,
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="text-3xl font-bold" style={{ color: headingColor || "var(--color-text)" }}>{contact.title}</h2>
          <p className="mt-3 text-sm" style={{ color: textColor || "var(--color-muted)" }}>
            {contact.description}
          </p>

          <form
            className="mt-10 mx-auto max-w-md space-y-4 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <TextInput label="Name" name="name" placeholder="Enter your name" labelColor={headingColor} inputBg={inputBg} inputText={inputText} inputPlaceholder={inputPlaceholder} />
            <TextInput label="Email" name="email" type="email" placeholder="you@example.com" labelColor={headingColor} inputBg={inputBg} inputText={inputText} inputPlaceholder={inputPlaceholder} />
            <label className="block text-xs" style={{ color: headingColor || "var(--color-muted)" }}>
              Message
              {inputPlaceholder && (
                <style>{`.contact-textarea-imm::placeholder { color: ${inputPlaceholder} !important; }`}</style>
              )}
              <textarea
                name="message"
                rows={4}
                className="contact-textarea-imm mt-1 w-full rounded-md border px-2 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: inputBg || "var(--color-bg)",
                  color: inputText || "var(--color-text)",
                  borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>
            <button
              type="submit"
              disabled={loading || success}
              className="w-full rounded-full px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: buttonBg || "var(--color-primary)",
                color: buttonText || "var(--color-bg)",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>
            {success && <p className="text-xs text-green-600 text-center">Thanks! Your message has been sent.</p>}
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <ContactRow type="email" value={contact.email} textColor={textColor} accentColor={accentColor} />
            {contact.whatsapp && <ContactRow type="whatsapp" value={contact.whatsapp} textColor={textColor} accentColor={accentColor} />}
            {contact.phone && <ContactRow type="phone" value={contact.phone} textColor={textColor} accentColor={accentColor} />}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="border-t"
      style={{
        background:
          bgColor || (layout === "modern"
            ? "linear-gradient(to bottom, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))"
            : "color-mix(in srgb, var(--color-bg) 94%, black)"),
        color: textColor || undefined,
        borderColor: "color-mix(in srgb, var(--color-primary) 12%, transparent)",
      }}
    >
      <div
        className={`mx-auto px-6 ${
          layout === "modern" ? "max-w-5xl py-20" : "max-w-4xl py-16"
        }`}
      >
        <div className={layout === "modern" ? "" : "text-center"}>
          {layout === "modern" && (
            <div
              className="mb-4 h-1 w-10 rounded-full"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-primary) 85%, white)",
              }}
            />
          )}
          <h2
            className={`font-bold ${
              layout === "modern" ? "text-2xl" : "text-xl"
            }`}
            style={{ color: headingColor || "var(--color-text)" }}
          >
            {contact.title}
          </h2>
          <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{contact.description}</p>
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
          <div className="space-y-5 text-sm pt-1">
            <h3 className="text-sm font-semibold" style={{ color: headingColor || "var(--color-text)" }}>Contact details</h3>
            <div className="space-y-3">
              <ContactRow type="email" value={contact.email} textColor={textColor} accentColor={accentColor} />
              {contact.whatsapp && <ContactRow type="whatsapp" value={contact.whatsapp} textColor={textColor} accentColor={accentColor} />}
              {contact.phone && <ContactRow type="phone" value={contact.phone} textColor={textColor} accentColor={accentColor} />}
            </div>
            <p className="pt-3 text-xs" style={{ color: textColor || "var(--color-muted)" }}>
              We usually reply within 24 hours on business days.
            </p>
          </div>

          <form
            className="rounded-2xl border p-6 shadow-lg"
            style={{
              backgroundColor: cardBg || "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-primary) 22%, transparent)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <h3 className="text-lg font-semibold" style={{ color: headingColor || "var(--color-text)" }}>{finalCta.headline}</h3>
            <p className="mt-2 text-sm" style={{ color: textColor || "var(--color-muted)" }}>{finalCta.subheadline}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TextInput label="Name" name="name" placeholder="Enter your name" labelColor={headingColor} inputBg={inputBg} inputText={inputText} inputPlaceholder={inputPlaceholder} />
              <TextInput label="Email" name="email" type="email" placeholder="you@example.com" labelColor={headingColor} inputBg={inputBg} inputText={inputText} inputPlaceholder={inputPlaceholder} />
            </div>

            <label className="mt-3 block text-xs" style={{ color: headingColor || "var(--color-muted)" }}>
              Message
              {inputPlaceholder && (
                <style>{`.contact-textarea::placeholder { color: ${inputPlaceholder} !important; }`}</style>
              )}
              <textarea
                name="message"
                rows={4}
                className="contact-textarea mt-1 w-full rounded-md border px-2 py-1.5 text-xs outline-none"
                style={{
                  backgroundColor: inputBg || "var(--color-bg)",
                  color: inputText || "var(--color-text)",
                  borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 rounded-full px-5 py-2 text-sm font-medium transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: buttonBg || "var(--color-primary)",
                color: buttonText || "var(--color-bg)",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>

            {success && <p className="mt-3 text-xs text-green-600">Thanks! Your message has been sent.</p>}
            {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
