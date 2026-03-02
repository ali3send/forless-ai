"use client";

import { useRef } from "react";
import { AlertTriangle, Pencil } from "lucide-react";
import { useWebsiteStore } from "@/store/website.store";

type SettingsPanelProps = {
  onSave?: () => void;
  saving?: boolean;
};

const ACCENT_BLUE = "#0149E1";
const CARD_BG = "#FFFFFF";
const INPUT_BG = "#F7FAFC";
const HINT_COLOR = "#718096";
const LABEL_COLOR = "#1A202C";
const HOW_IT_WORKS_BG = "#F9FAFB";

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 60;

export function SettingsPanel({ onSave, saving }: SettingsPanelProps) {
  const { data, patchData } = useWebsiteStore();
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  const websiteName = data?.websiteName ?? data?.brandName ?? "My Website";
  const primaryLanguage = data?.primaryLanguage ?? "English";
  const maintenanceEnabled = data?.maintenanceMode?.enabled ?? false;
  const seoTitle = data?.seoTitle ?? "";
  const seoDescription = data?.seoDescription ?? "";
  const googleAnalyticsId = data?.googleAnalyticsId ?? "";
  const metaPixelId = data?.metaPixelId ?? "";
  const privacyPolicyAuto = data?.legal?.privacyPolicyAutoGenerate ?? true;
  const termsAuto = data?.legal?.termsAndConditionsAutoGenerate ?? true;
  const footerText =
    data?.footerText ?? "© 2026 Your Brand. All rights reserved.";

  const handleWebsiteNameChange = (value: string) => {
    patchData({ websiteName: value || undefined });
  };

  const handlePrimaryLanguageChange = (value: string) => {
    patchData({ primaryLanguage: value || undefined });
  };

  const toggleMaintenance = () => {
    patchData({
      maintenanceMode: {
        enabled: !maintenanceEnabled,
      },
    });
  };

  const handleFaviconClick = () => {
    faviconInputRef.current?.click();
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    patchData({ faviconUrl: url });
    e.target.value = "";
  };

  const handleOgImageClick = () => ogImageInputRef.current?.click();
  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    patchData({ openGraphImageUrl: url });
    e.target.value = "";
  };

  const setSeoTitle = (v: string) =>
    patchData({
      seoTitle: v.length <= SEO_TITLE_MAX ? v : v.slice(0, SEO_TITLE_MAX),
    });
  const setSeoDescription = (v: string) =>
    patchData({
      seoDescription: v.length <= SEO_DESC_MAX ? v : v.slice(0, SEO_DESC_MAX),
    });

  const togglePrivacyPolicy = () =>
    patchData({
      legal: {
        ...data?.legal,
        privacyPolicyAutoGenerate: !privacyPolicyAuto,
      },
    });
  const toggleTerms = () =>
    patchData({
      legal: {
        ...data?.legal,
        termsAndConditionsAutoGenerate: !termsAuto,
      },
    });

  return (
    <div
      className="flex flex-col w-full max-w-[398px] overflow-y-auto"
      style={{
        paddingTop: 8,
        paddingRight: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        gap: 24,
        backgroundColor: "#FFFFFF",
      }}
    >
      <div className="flex flex-col gap-1.5">
        <h2
          className="text-secondary-dark"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 700,
            fontSize: "24px",
            letterSpacing: "0.4px",
          }}
        >
          Settings
        </h2>
        <p className="text-sm text-secondary">
          Configure your website settings and preferences.
        </p>
      </div>

      {/* General */}
      <div
        className="rounded-xl border border-secondary-fade/80 bg-white p-4 shadow-sm"
        style={{ borderColor: "#E5E7EB" }}
      >
        <h3 className="text-sm font-bold text-secondary-dark mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              <span className="form-label">Website Name</span>
            </label>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => handleWebsiteNameChange(e.target.value)}
              className="input-base w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-dark outline-none focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="My Website"
            />
          </div>
          <div>
            <label className="block mb-1">
              <span className="form-label">Favicon</span>
            </label>
            <input
              ref={faviconInputRef}
              type="file"
              accept="image/x-icon,image/png,image/svg+xml"
              className="hidden"
              onChange={handleFaviconChange}
            />
            <button
              type="button"
              onClick={handleFaviconClick}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0149E1] transition hover:opacity-90 bg-[#EFF6FF99]"
              // style={{ backgroundColor: #EFF6FF99 }}
            >
              Upload Favicon
            </button>
            <p className="mt-1.5 text-xs text-secondary">
              Recommended: 32x32 or 64x64 pixels
            </p>
          </div>
          <div>
            <label className="block mb-1">
              <span className="form-label">Primary Language</span>
            </label>
            <input
              type="text"
              value={primaryLanguage}
              onChange={(e) => handlePrimaryLanguageChange(e.target.value)}
              className="input-base w-full rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-dark outline-none focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
              placeholder="English"
            />
            <p className="mt-1.5 text-xs text-secondary">
              Choose the main language of your website. This affects text
              direction and SEO.
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div
        className="rounded-xl border p-4 shadow-sm"
        style={{
          backgroundColor: "#FFF7ED",
          borderColor: "#FED7AA",
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle
            className="h-5 w-5 shrink-0 mt-0.5"
            style={{ color: "#EA580C" }}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-secondary-dark">
              Maintenance Mode
            </h3>
            <p className="text-xs text-secondary mt-0.5">
              Show a Coming Soon page to visitors
            </p>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div>
                <p className="text-sm font-bold text-secondary-dark">
                  Maintenance Mode is {maintenanceEnabled ? "On" : "Off"}
                </p>
                <p className="text-xs text-secondary">
                  {maintenanceEnabled
                    ? "Visitors see a Coming Soon page"
                    : "Your website is live to visitors"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={maintenanceEnabled}
                onClick={toggleMaintenance}
                className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#0149E1]/40 focus:ring-offset-2"
                style={{
                  backgroundColor: ACCENT_BLUE,
                }}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
                  style={{
                    transform: maintenanceEnabled
                      ? "translateX(22px)"
                      : "translateX(2px)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div
        className="rounded-xl border p-4 shadow-sm"
        style={{
          backgroundColor: CARD_BG,
          borderColor: "#E5E7EB",
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: LABEL_COLOR }}>
          SEO
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              <span
                className="font-bold text-sm"
                style={{ color: LABEL_COLOR }}
              >
                SEO Title
              </span>
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Your Website Title - Brand"
              maxLength={SEO_TITLE_MAX}
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20"
              style={{ backgroundColor: INPUT_BG, color: LABEL_COLOR }}
            />
            <p className="mt-1 text-xs" style={{ color: HINT_COLOR }}>
              {seoTitle.length}/{SEO_TITLE_MAX} characters
            </p>
          </div>
          <div>
            <label className="block mb-1">
              <span
                className="font-bold text-sm"
                style={{ color: LABEL_COLOR }}
              >
                SEO Description
              </span>
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="My Website"
              maxLength={SEO_DESC_MAX}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20"
              style={{ backgroundColor: INPUT_BG, color: LABEL_COLOR }}
            />
            <p className="mt-1 text-xs" style={{ color: HINT_COLOR }}>
              {seoDescription.length}/{SEO_DESC_MAX} characters
            </p>
          </div>
          <div>
            <label className="block mb-1">
              <span
                className="font-bold text-sm"
                style={{ color: LABEL_COLOR }}
              >
                Open Graph Image
              </span>
            </label>
            <input
              ref={ogImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleOgImageChange}
            />
            <button
              type="button"
              onClick={handleOgImageClick}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#0149E1] transition hover:opacity-90 bg-[#EFF6FF99]"
              // style={{ backgroundColor: SEO_BUTTON_BLUE }}
            >
              Upload Image
            </button>
            <p className="mt-1.5 text-xs" style={{ color: HINT_COLOR }}>
              Recommended: 1200x630 pixels. Used when sharing on social media.
            </p>
          </div>
        </div>
      </div>

      {/* Tracking & Integrations */}
      <div
        className="rounded-xl border p-4 shadow-sm"
        style={{
          backgroundColor: CARD_BG,
          borderColor: "#E5E7EB",
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: LABEL_COLOR }}>
          Tracking & Integrations
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              <span
                className="font-bold text-sm"
                style={{ color: LABEL_COLOR }}
              >
                Google Analytics (GA4)
              </span>
            </label>
            <input
              type="text"
              value={googleAnalyticsId}
              onChange={(e) =>
                patchData({ googleAnalyticsId: e.target.value || undefined })
              }
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20"
              style={{ backgroundColor: INPUT_BG, color: LABEL_COLOR }}
            />
            <p className="mt-1 text-xs" style={{ color: HINT_COLOR }}>
              Enter your Google Analytics 4 Measurement ID
            </p>
          </div>
          <div>
            <label className="block mb-1">
              <span
                className="font-bold text-sm"
                style={{ color: LABEL_COLOR }}
              >
                Meta Pixel ID
              </span>
            </label>
            <input
              type="text"
              value={metaPixelId}
              onChange={(e) =>
                patchData({ metaPixelId: e.target.value || undefined })
              }
              placeholder="123456789012345"
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#4299E1] focus:ring-2 focus:ring-[#4299E1]/20"
              style={{ backgroundColor: INPUT_BG, color: LABEL_COLOR }}
            />
            <p className="mt-1 text-xs" style={{ color: HINT_COLOR }}>
              Enter your Facebook/Meta Pixel ID
            </p>
          </div>
          <div
            className="rounded-lg p-3"
            style={{ backgroundColor: HOW_IT_WORKS_BG }}
          >
            <p
              className="font-bold text-sm mb-1"
              style={{ color: LABEL_COLOR }}
            >
              How it works:
            </p>
            <p className="text-sm" style={{ color: LABEL_COLOR }}>
              When you add an ID, the tracking script will be automatically
              injected into your website&apos;s &lt;head&gt; section.
            </p>
          </div>
        </div>
      </div>

      {/* Legal – main container */}
      <div
        className="flex w-full max-w-[272px] flex-col gap-4 rounded-[10px] border border-[#E5E7EB] p-4 shadow-sm"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h3 className="text-base font-bold" style={{ color: "#333" }}>
          Legal
        </h3>

        {/* Privacy Policy */}
        <div
          className="flex w-full flex-col rounded-[10px] border border-[#E5E7EB] shadow-sm"
          style={{
            backgroundColor: "#F9FAFB",
            padding: 16,
            minHeight: 146,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-sm" style={{ color: "#333" }}>
                Privacy Policy
              </p>
              <p className="text-sm mt-0.5" style={{ color: HINT_COLOR }}>
                Auto-generate a privacy policy page
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={privacyPolicyAuto}
              onClick={togglePrivacyPolicy}
              className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition flex-shrink-0"
              style={{ backgroundColor: "#0149E1" }}
            >
              <span
                className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: privacyPolicyAuto
                    ? "translateX(22px)"
                    : "translateX(2px)",
                }}
              />
            </button>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 transition hover:bg-gray-50"
            style={{
              color: "#364153",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              lineHeight: "24px",
              letterSpacing: "-0.31px",
            }}
          >
            <Pencil className="h-4 w-4 shrink-0" style={{ color: "#364153" }} />
            Edit Privacy Policy
          </button>
        </div>

        {/* Terms & Conditions */}
        <div
          className="flex w-full flex-col rounded-[10px] border border-[#E5E7EB] shadow-sm"
          style={{
            backgroundColor: "#F9FAFB",
            padding: 16,
            minHeight: 146,
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-sm" style={{ color: "#333" }}>
                Terms & Conditions
              </p>
              <p className="text-sm mt-0.5" style={{ color: HINT_COLOR }}>
                Auto-generate a terms and conditions page
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={termsAuto}
              onClick={toggleTerms}
              className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition flex-shrink-0"
              style={{ backgroundColor: "#0149E1" }}
            >
              <span
                className="inline-block h-5 w-5 rounded-full bg-white shadow transition-transform"
                style={{
                  transform: termsAuto ? "translateX(22px)" : "translateX(2px)",
                }}
              />
            </button>
          </div>
          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 transition hover:bg-gray-50"
            style={{
              color: "#364153",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              lineHeight: "24px",
              letterSpacing: "-0.31px",
            }}
          >
            <Pencil className="h-4 w-4 shrink-0" style={{ color: "#364153" }} />
            Edit Terms & Conditions
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="rounded-xl border p-4 shadow-sm"
        style={{
          backgroundColor: CARD_BG,
          borderColor: "#E5E7EB",
        }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: "#333" }}>
          Footer
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">
              <span className="font-bold text-sm" style={{ color: "#333" }}>
                Footer Text
              </span>
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) =>
                patchData({ footerText: e.target.value || undefined })
              }
              placeholder="© 2026 Your Brand. All rights reserved."
              className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007bff] focus:ring-2 focus:ring-[#007bff]/20"
              style={{ backgroundColor: "#FFFFFF", color: "#333" }}
            />
            <p className="mt-1.5 text-xs" style={{ color: HINT_COLOR }}>
              This text will appear at the bottom of every page
            </p>
          </div>
          <div>
            <p
              className="font-bold text-xs mb-2 uppercase tracking-wide"
              style={{ color: "#333" }}
            >
              Preview:
            </p>
            <div
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{
                backgroundColor: INPUT_BG,
                borderColor: "#E5E7EB",
                color: "#333",
              }}
            >
              {footerText || "© 2026 Your Brand. All rights reserved."}
            </div>
          </div>
        </div>
      </div>

      {/* Save Settings */}
      <button
        type="button"
        onClick={() => onSave?.()}
        disabled={saving}
        className="w-full rounded-3xl py-3 text-base font-bold text-white shadow-sm transition hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#0149E1" }}
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </div>
  );
}
