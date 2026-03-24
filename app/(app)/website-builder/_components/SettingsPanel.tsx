// app/(app)/website-builder/_components/SettingsPanel.tsx
"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { useWebsiteStore } from "@/store/website.store";
import EditLegalModal from "./EditLegalModal";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Arabic",
  "Chinese",
  "Japanese",
  "Korean",
  "Hindi",
  "Urdu",
  "Turkish",
  "Italian",
  "Dutch",
  "Russian",
  "Other",
];

type Props = {
  websiteId: string;
};

export default function SettingsPanel({ websiteId }: Props) {
  const { data, patchData } = useWebsiteStore();
  const [legalModal, setLegalModal] = useState<
    "privacy" | "terms" | null
  >(null);

  const inputClass =
    "w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none transition placeholder:text-secondary focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-secondary-darker">Settings</h2>
        <p className="mt-1 text-sm text-secondary">
          Configure your website settings.
        </p>
      </div>

      {/* Website name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-secondary-darker">
          Website Name
        </label>
        <input
          type="text"
          value={data?.websiteName ?? ""}
          onChange={(e) => patchData({ websiteName: e.target.value })}
          placeholder="My Website"
          className={inputClass}
        />
      </div>

      {/* Primary language — commented out for now */}
      {/* <div className="space-y-1.5">
        <label className="text-sm font-medium text-secondary-darker">
          Primary Language
        </label>
        <select
          value={data?.primaryLanguage ?? "English"}
          onChange={(e) => patchData({ primaryLanguage: e.target.value })}
          className={inputClass}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div> */}

      {/* Maintenance mode — commented out for now */}
      {/* <div className="flex items-center justify-between rounded-xl border border-secondary-fade bg-white p-4">
        <div>
          <p className="text-sm font-medium text-secondary-darker">
            Maintenance Mode
          </p>
          <p className="text-xs text-secondary">
            Show a maintenance page to visitors
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            patchData({ maintenanceMode: !data?.maintenanceMode })
          }
          className={`relative h-6 w-11 rounded-full transition ${
            data?.maintenanceMode ? "bg-primary" : "bg-secondary-fade"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              data?.maintenanceMode ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div> */}

      {/* SEO */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-secondary-darker">SEO</h3>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-darker">
            SEO Title
          </label>
          <input
            type="text"
            value={data?.seoTitle ?? ""}
            onChange={(e) => patchData({ seoTitle: e.target.value })}
            placeholder="Page title for search engines"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-darker">
            SEO Description
          </label>
          <textarea
            value={data?.seoDescription ?? ""}
            onChange={(e) => patchData({ seoDescription: e.target.value })}
            placeholder="Brief description for search engines"
            rows={3}
            className={inputClass}
            style={{ resize: "none" }}
          />
        </div>
      </div>

      {/* Analytics */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-secondary-darker">Analytics</h3>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-darker">
            Google Analytics ID
          </label>
          <input
            type="text"
            value={data?.googleAnalyticsId ?? ""}
            onChange={(e) => patchData({ googleAnalyticsId: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-secondary-darker">
            Meta Pixel ID
          </label>
          <input
            type="text"
            value={data?.metaPixelId ?? ""}
            onChange={(e) => patchData({ metaPixelId: e.target.value })}
            placeholder="123456789012345"
            className={inputClass}
          />
        </div>
      </div>

      {/* Legal — commented out for now */}
      {/* <div className="space-y-3">
        <h3 className="text-sm font-bold text-secondary-darker">Legal</h3>

        <button
          type="button"
          onClick={() => setLegalModal("privacy")}
          className="flex w-full items-center gap-3 rounded-xl border border-secondary-fade bg-white p-4 text-left transition hover:border-primary"
        >
          <FileText size={18} className="text-secondary" />
          <div>
            <p className="text-sm font-medium text-secondary-darker">
              Privacy Policy
            </p>
            <p className="text-xs text-secondary">
              {data?.legal?.privacyPolicy
                ? "Click to edit"
                : "Click to add"}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setLegalModal("terms")}
          className="flex w-full items-center gap-3 rounded-xl border border-secondary-fade bg-white p-4 text-left transition hover:border-primary"
        >
          <FileText size={18} className="text-secondary" />
          <div>
            <p className="text-sm font-medium text-secondary-darker">
              Terms & Conditions
            </p>
            <p className="text-xs text-secondary">
              {data?.legal?.terms ? "Click to edit" : "Click to add"}
            </p>
          </div>
        </button>
      </div> */}

      {/* Footer text */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-secondary-darker">
          Footer Text
        </label>
        <input
          type="text"
          value={data?.footerText ?? ""}
          onChange={(e) => patchData({ footerText: e.target.value })}
          placeholder="© 2026 Your Company. All rights reserved."
          className={inputClass}
        />
      </div>

      {/* Legal modals */}
      {legalModal === "privacy" && (
        <EditLegalModal
          title="Privacy Policy"
          value={data?.legal?.privacyPolicy ?? ""}
          onSave={(text) => {
            patchData({
              legal: { ...data?.legal, privacyPolicy: text },
            });
            setLegalModal(null);
          }}
          onClose={() => setLegalModal(null)}
        />
      )}

      {legalModal === "terms" && (
        <EditLegalModal
          title="Terms & Conditions"
          value={data?.legal?.terms ?? ""}
          onSave={(text) => {
            patchData({
              legal: { ...data?.legal, terms: text },
            });
            setLegalModal(null);
          }}
          onClose={() => setLegalModal(null)}
        />
      )}
    </div>
  );
}
