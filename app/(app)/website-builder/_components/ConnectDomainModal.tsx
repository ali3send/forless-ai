import { useEffect, useState } from "react";
import { Copy, Lightbulb } from "lucide-react";

type ConnectDomainModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ConnectDomainModal({ open, onClose }: ConnectDomainModalProps) {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (open) {
      setStep(1);
    }
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const handleCopy = (value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(value).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4">
      <div
        className="relative flex flex-col bg-white text-sm shadow-xl"
        style={{
          width: 672,
          borderRadius: 32,
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Top step header */}
        <div
          className="flex flex-col"
          style={{
            width: "100%",
            paddingTop: 32,
            paddingRight: 32,
            paddingLeft: 32,
            paddingBottom: 0.8,
            borderBottom: "0.8px solid #E5E7EB",
            rowGap: 12,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Step 1 */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= 1
                    ? "bg-[#0149E1] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                1
              </div>
              <div className="h-px w-24 bg-gray-200" />
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                  step >= 2
                    ? "bg-[#0149E1] text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                2
              </div>
              <div className="h-px w-24 bg-gray-200" />
            </div>
            {/* Step 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                3
              </div>
              <div className="h-px w-24 bg-gray-200" />
            </div>
            {/* Step 4 */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
              4
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Introduction
          </p>
        </div>

        {/* Body content */}
        {step === 1 ? (
          <div className="space-y-4 px-8 py-6">
            <div>
              <h2
                className="text-gray-900"
                style={{
                  fontFamily: "Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: "32px",
                }}
              >
                Connect your domain
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                We&apos;ll guide you through connecting your domain to your
                website.
              </p>
            </div>

            {/* What you'll do */}
            <div className="mt-8 space-y-4">
              <div
                className="rounded-[20px] border bg-[#EFF6FF] px-6 py-6"
                style={{ borderColor: "#DBEAFE" }}
              >
                <p className="mb-5 text-[15px] font-bold text-[#111827]">
                  What you&apos;ll do:
                </p>
                <div className="space-y-4">
                  {[
                    "Copy the DNS records we provide",
                    "Add them to your domain provider (like GoDaddy, Namecheap, etc.)",
                    "We'll verify everything is working",
                  ].map((text, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0149E1] text-[12px] font-bold text-white">
                        {index + 1}
                      </div>
                      <span className="text-[15px] font-medium text-[#374151]">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-2xl border px-5 py-3 text-sm"
                style={{
                  backgroundColor: "#FFDECC66",
                  borderColor: "#FF8C50",
                }}
              >
                <p className="font-semibold text-[#92400E]">
                  Takes 5–10 minutes
                </p>
                <p className="mt-1 text-[#92400E]">
                  DNS changes can take a few minutes to update. Don&apos;t
                  worry, we&apos;ll check automatically!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 px-8 py-6">
            <div>
              <h2
                className="text-gray-900"
                style={{
                  fontFamily: "Helvetica, sans-serif",
                  fontWeight: 700,
                  fontSize: 24,
                  lineHeight: "32px",
                }}
              >
                Add these DNS records
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Go to your domain provider and add these records:
              </p>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Record 1: Main domain record
                  </p>
                  <span className="inline-flex h-6 items-center rounded-full border border-blue-100 bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                    A
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        Name
                      </p>
                      <div className="mt-1 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                        <span className="flex-1 truncate">@</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("@")}
                      className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      aria-label="Copy name"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        Value / points to
                      </p>
                      <div className="mt-1 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                        <span className="flex-1 truncate">76.76.21.21</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("76.76.21.21")}
                      className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      aria-label="Copy value"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-[#F9FAFB] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Record 2: WWW subdomain
                  </p>
                  <span className="inline-flex h-6 items-center rounded-full border border-blue-100 bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                    CNAME
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        Name
                      </p>
                      <div className="mt-1 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                        <span className="flex-1 truncate">www</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("www")}
                      className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      aria-label="Copy name"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-medium uppercase text-gray-500">
                        Value / points to
                      </p>
                      <div className="mt-1 flex items-center rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900">
                        <span className="flex-1 truncate">
                          cname.forless.ai
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy("cname.forless.ai")}
                      className="mt-6 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                      aria-label="Copy value"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="rounded-2xl border px-5 py-3 text-sm "
                style={{ backgroundColor: "#E1F0FF99", borderColor: "#DBEAFE" }}
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="mt-0.5 h-4 w-4 text-yellow-300" />
                  <p className="font-medium text-[#112E6D]">
                    Tip: Look for &quot;DNS Settings&quot; or &quot;DNS
                    Management&quot; in your domain provider&apos;s dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {step === 1 ? (
          <div className="mt-2 flex justify-center pb-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-full bg-[#0149E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0149E1]/90"
              style={{
                width: 608,
                height: 48,
                borderRadius: 48,
              }}
            >
              Let&apos;s get started
            </button>
          </div>
        ) : (
          <div className="mt-2 flex justify-between gap-4 px-8 pb-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 rounded-full border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-full bg-[#0149E1] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0149E1]/90"
            >
              I&apos;ve added the records
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
