"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { StateUpdater } from "@/lib/types/state";
import { TextField } from "../../components/ui/TextField";

type ContactSectionFormProps = {
  data: WebsiteData;
  setData: StateUpdater<WebsiteData>;
  onSave?: () => void;
  saving?: boolean;
};

export function ContactSectionForm({
  data,
  setData,
  onSave,
  saving,
}: ContactSectionFormProps) {
  return (
    <div className="space-y-4">
      {/* First card: Contact section */}
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <TextField
            label="Title"
            placeholder="Contact"
            value={data.contact.sectionLabel ?? "Contact"}
            showAsPlaceholderWhenValueEquals="Contact"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, sectionLabel: v || undefined },
              }))
            }
            limit="heroTitle"
          />

          <TextField
            label="Contact section title"
            placeholder="Get in Touch"
            value={data.contact.title}
            showAsPlaceholderWhenValueEquals="Get in Touch"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, title: v },
              }))
            }
            limit="contactTitle"
            showLimit
          />

          <TextField
            label="Contact description"
            placeholder="Describe how users can contact you..."
            value={data.contact.description}
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, description: v },
              }))
            }
            as="textarea"
            rows={5}
            maxHeight={160}
            limit="contactDescription"
            showLimit
          />

          <TextField
            label="Email address"
            type="email"
            placeholder="support@chichaven.com"
            value={data.contact.email}
            showAsPlaceholderWhenValueEquals="support@chichaven.com"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, email: v },
              }))
            }
            limit="contactEmail"
          />

          <TextField
            label="WhatsApp number (optional)"
            placeholder="+1234567890"
            value={data.contact.whatsapp ?? ""}
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, whatsapp: v || undefined },
              }))
            }
            limit="contactPhone"
          />

          <TextField
            label="Phone number (optional)"
            placeholder="(555) 123-4567"
            value={data.contact.phone ?? ""}
            showAsPlaceholderWhenValueEquals="(555) 123-4567"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                contact: { ...prev.contact, phone: v || undefined },
              }))
            }
            limit="contactPhone"
          />
        </div>
      </div>

      {/* Second card: Newsletter signup box */}
      <div className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm">
        <p className="form-label mb-4">Newsletter signup box</p>
        <div className="space-y-4">
          <TextField
            label="Headline"
            placeholder="Join the Chic Haven Family"
            value={data.finalCta.headline}
            showAsPlaceholderWhenValueEquals="Join the Chic Haven Family"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, headline: v },
              }))
            }
            limit="contactCtaHeader"
            showLimit
          />

          <TextField
            label="Subheadline"
            placeholder="Stay updated with the latest trends and offerings"
            value={data.finalCta.subheadline}
            showAsPlaceholderWhenValueEquals="Stay updated with the latest trends and offerings"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, subheadline: v },
              }))
            }
            as="textarea"
            rows={2}
            maxHeight={120}
            limit="contactCtaSubHeader"
            showLimit
          />

          <TextField
            label="Button label"
            placeholder="Subscribe Now"
            value={data.finalCta.buttonLabel}
            showAsPlaceholderWhenValueEquals="Subscribe Now"
            onChange={(v) =>
              setData((prev) => ({
                ...prev,
                finalCta: { ...prev.finalCta, buttonLabel: v },
              }))
            }
            limit="contactCta"
            showLimit
          />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSave?.()}
        disabled={saving}
        className="w-full rounded-3xl px-4 py-3 text-sm font-semibold text-[#111827] shadow-sm disabled:opacity-60"
        style={{ backgroundColor: "#E5E7EB" }}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
