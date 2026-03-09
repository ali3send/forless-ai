import { useContactForm } from "../../hooks/useContacForm";
import { ContactData, FinalCtaData } from "../../template.types";
import { ContactRow } from "../../ui/ContactRow";
import { TextInput } from "../../ui/TextInput";
import type { LayoutKey } from "../../templates";

type Props = {
  contact: ContactData;
  finalCta: FinalCtaData;
  websiteId: string;
  layout: LayoutKey;
};

export function ContactSection({ contact, finalCta, websiteId, layout }: Props) {
  const { submit, loading, success, error } = useContactForm(websiteId);

  if (layout === "immersive") {
    return (
      <section
        id="contact"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 88%, black), color-mix(in srgb, var(--color-bg) 70%, black))",
        }}
      >
        <div className="mx-auto max-w-3xl px-6 py-28 text-center">
          <h2 className="text-3xl font-bold text-text">{contact.title}</h2>
          <p className="mt-3 text-sm text-(--color-muted)">
            {contact.description}
          </p>

          <form
            className="mt-10 mx-auto max-w-md space-y-4 text-left"
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <TextInput label="Name" name="name" placeholder="Enter your name" />
            <TextInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <label className="block text-xs text-(--color-muted)">
              Message
              <textarea
                name="message"
                rows={4}
                className="mt-1 w-full rounded-md border px-2 py-1.5 text-xs outline-none bg-(--color-bg) text-text"
                style={{
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
                backgroundColor: "var(--color-primary)",
                color: "var(--color-bg)",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>
            {success && <p className="text-xs text-green-600 text-center">Thanks! Your message has been sent.</p>}
            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          </form>

          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <ContactRow type="email" value={contact.email} />
            {contact.whatsapp && <ContactRow type="whatsapp" value={contact.whatsapp} />}
            {contact.phone && <ContactRow type="phone" value={contact.phone} />}
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
          layout === "modern"
            ? "linear-gradient(to bottom, var(--color-bg), color-mix(in srgb, var(--color-bg) 85%, black))"
            : "color-mix(in srgb, var(--color-bg) 94%, black)",
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
            className={`font-bold text-text ${
              layout === "modern" ? "text-2xl" : "text-xl"
            }`}
          >
            {contact.title}
          </h2>
          <p className="mt-2 text-sm text-(--color-muted)">{contact.description}</p>
        </div>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
          <div className="space-y-5 text-sm pt-1">
            <h3 className="text-sm font-semibold text-text">Contact details</h3>
            <div className="space-y-3">
              <ContactRow type="email" value={contact.email} />
              {contact.whatsapp && <ContactRow type="whatsapp" value={contact.whatsapp} />}
              {contact.phone && <ContactRow type="phone" value={contact.phone} />}
            </div>
            <p className="pt-3 text-xs text-(--color-muted)">
              We usually reply within 24 hours on business days.
            </p>
          </div>

          <form
            className="rounded-2xl border p-6 shadow-lg"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "color-mix(in srgb, var(--color-primary) 22%, transparent)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              submit(e.currentTarget);
            }}
          >
            <h3 className="text-lg font-semibold text-text">{finalCta.headline}</h3>
            <p className="mt-2 text-sm text-(--color-muted)">{finalCta.subheadline}</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <TextInput label="Name" name="name" placeholder="Enter your name" />
              <TextInput label="Email" name="email" type="email" placeholder="you@example.com" />
            </div>

            <label className="mt-3 block text-xs text-(--color-muted)">
              Message
              <textarea
                name="message"
                rows={4}
                className="mt-1 w-full rounded-md border px-2 py-1.5 text-xs outline-none bg-(--color-bg) text-text"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
                placeholder="Tell us a bit about what you need help with..."
              />
            </label>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 rounded-full px-5 py-2 text-sm font-medium transition bg-primary text-slate-950 hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
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
