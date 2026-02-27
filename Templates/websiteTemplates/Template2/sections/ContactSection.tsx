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
      className="w-full"
      style={{
        background: "linear-gradient(180deg, #EFF6FF 0%, #E0E7FF 100%)",
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
              color: "#374151",
              fontFamily: "Helvetica, sans-serif",
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
              color: "#6b7280",
              fontFamily: "Helvetica, sans-serif",
              fontSize: 16,
              marginBottom: 40,
            }}
          >
            {contact.description}
          </p>
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2">
          {/* LEFT: Contact details */}
          <div className="space-y-5 pt-1">
            <h3
              style={{
                color: "#374151",
                fontFamily: "Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 16,
              }}
            >
              Contact details
            </h3>

            <div className="space-y-3">
              <ContactRow type="email" value={contact.email} />

              {contact.whatsapp && (
                <ContactRow type="whatsapp" value={contact.whatsapp} />
              )}

              {contact.phone && <ContactRow type="phone" value={contact.phone} />}
            </div>

            <p
              className="pt-3"
              style={{
                color: "#6b7280",
                fontFamily: "Helvetica, sans-serif",
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
                color: "#374151",
                fontFamily: "Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              {finalCta.headline}
            </h3>

            <p
              style={{
                color: "#6b7280",
                fontFamily: "Helvetica, sans-serif",
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
                  fontFamily: "Helvetica, sans-serif",
                }}
              />
              <input
                name="email"
                type="email"
                placeholder="your@example.com"
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  fontFamily: "Helvetica, sans-serif",
                }}
              />
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-lg border px-4 py-2 text-sm outline-none"
                style={{
                  borderColor: "#e5e7eb",
                  fontFamily: "Helvetica, sans-serif",
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
                backgroundColor: "#0149E1",
                fontFamily: "Helvetica, sans-serif",
              }}
            >
              {loading ? "Sending…" : success ? "Sent!" : finalCta.buttonLabel}
            </button>

            {success && (
              <p
                className="mt-3 text-xs text-green-600"
                style={{ fontFamily: "Helvetica, sans-serif" }}
              >
                Thanks! Your message has been sent.
              </p>
            )}

            {error && (
              <p
                className="mt-3 text-xs text-red-600"
                style={{ fontFamily: "Helvetica, sans-serif" }}
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
