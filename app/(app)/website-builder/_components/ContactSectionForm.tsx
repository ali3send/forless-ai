"use client";

import { WebsiteData } from "@/lib/types/websiteTypes";
import { TextField } from "../../components/ui/TextField";

type ContactSectionFormProps = {
  data: WebsiteData;
  setData: React.Dispatch<React.SetStateAction<WebsiteData>>;
};

export function ContactSectionForm({ data, setData }: ContactSectionFormProps) {
  return (
    <div className="space-y-4">
      <TextField
        label="Contact Section Title"
        placeholder="e.g., Contact Us, Get in Touch, Reach Out"
        value={data.contact.title}
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
        as="textarea"
        rows={3}
        label="Contact Description"
        placeholder="e.g., Feel free to reach out to us via the form below or through our contact details."
        value={data.contact.description}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            contact: { ...prev.contact, description: v },
          }))
        }
        maxHeight={160}
        limit="contactDescription"
        showLimit
      />

      <TextField
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={data.contact.email}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            contact: { ...prev.contact, email: v },
          }))
        }
        limit="contactEmail"
      />

      <TextField
        label="WhatsApp Number (optional)"
        placeholder="+92 300 1234567"
        value={data.contact.whatsapp ?? ""}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            contact: { ...prev.contact, whatsapp: v },
          }))
        }
        limit="contactPhone"
      />

      <TextField
        label="Phone Number (optional)"
        placeholder="+92 51 1234567"
        value={data.contact.phone ?? ""}
        onChange={(v) =>
          setData((prev) => ({
            ...prev,
            contact: { ...prev.contact, phone: v },
          }))
        }
        limit="contactPhone"
      />

      {/* FINAL CTA CARD */}
      <div className="rounded-xl border border-secondary-fade bg-secondary-soft p-3 space-y-3 mt-6">
        <h4 className="text-xs font-semibold text-secondary-dark">
          Final CTA Box
        </h4>

        <TextField
          label="CTA Headline"
          placeholder="Ready to get started?"
          value={data.finalCta.headline}
          onChange={(v) =>
            setData((prev) => ({
              ...prev,
              finalCta: { ...prev.finalCta, headline: v },
            }))
          }
          limit="contactCtaHeader"
          showLimit
          className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
        />

        <TextField
          label="CTA Subheadline"
          placeholder="We're here to help you move forward."
          value={data.finalCta.subheadline}
          onChange={(v) =>
            setData((prev) => ({
              ...prev,
              finalCta: { ...prev.finalCta, subheadline: v },
            }))
          }
          limit="contactCtaSubHeader"
          showLimit
          className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
        />

        <TextField
          label="CTA Button Label"
          placeholder="Contact Us"
          value={data.finalCta.buttonLabel}
          onChange={(v) =>
            setData((prev) => ({
              ...prev,
              finalCta: { ...prev.finalCta, buttonLabel: v },
            }))
          }
          limit="contactCta"
          showLimit
          className="border-none ring-1 ring-secondary-light focus:ring-2 focus:ring-primary/50"
        />
      </div>
    </div>
  );
}
