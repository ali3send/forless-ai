type ConnectDomainModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ConnectDomainModal({ open, onClose }: ConnectDomainModalProps) {
  if (!open) return null;

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
          onClick={onClose}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0149E1] text-xs font-semibold text-white">
                1
              </div>
              <div className="h-px w-24 bg-gray-200" />
            </div>
            {/* Step 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
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
              We&apos;ll guide you through connecting{" "}
              <span className="text-[#0149E1] font-bold text-[18px] leading-[28px] tracking-[0px]">
                Online Store
              </span>{" "}
              to your website.
            </p>
          </div>

          {/* What you'll do */}
          <div className="mt-8 space-y-4">
            <div
              className="rounded-[20px] border bg-[#EFF6FF] px-6 py-6"
              style={{ borderColor: "#DBEAFE" }}
            >
              <p className="text-[15px] font-bold text-[#111827] mb-5">
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
              style={{ backgroundColor: "#FFDECC66", borderColor: "#FF8C50" }}
            >
              <p className="font-semibold text-[#92400E]">Takes 5–10 minutes</p>
              <p className="mt-1 text-[#92400E]">
                DNS changes can take a few minutes to update. Don&apos;t worry,
                we&apos;ll check automatically!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex justify-center pb-6">
          <button
            type="button"
            onClick={onClose}
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
      </div>
    </div>
  );
}
