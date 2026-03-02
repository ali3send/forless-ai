"use client";

import { Check, CheckCircle2, Sparkles, Trash2 } from "lucide-react";

export function BrandPanel() {
  return (
    <div
      className="flex flex-col w-full max-w-[398px] overflow-y-auto"
      style={{
        paddingTop: 8,
        paddingRight: 32,
        paddingBottom: 32,
        paddingLeft: 32,
        gap: 16,
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Header */}
      <div
        className="flex flex-col w-full max-w-[334px]"
        style={{ gap: 6, minHeight: 58 }}
      >
        <h2 className="text-lg font-semibold text-secondary-dark">Brand</h2>
        <p className="text-sm text-secondary">
          Create your brand in seconds with AI, or customize it yourself.
        </p>
      </div>

      {/* AI Brand Creation card */}
      <div
        className="flex flex-col w-full max-w-[334px]"
        style={{
          borderRadius: 24,
          padding: 24,
          gap: 16,
          backgroundColor: "#EFF5FF",
          border: "1px solid #C7D7FE",
        }}
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-secondary-dark">
            AI Brand Creation
          </span>
          <span className="text-xs text-secondary">
            Describe your business and we&apos;ll do the rest.
          </span>
        </div>

        <div className="flex flex-col" style={{ gap: 8 }}>
          <textarea
            rows={4}
            placeholder="e.g., modern coffee shop in downtown"
            className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-secondary-dark placeholder:text-secondary outline-none focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
          />
        </div>

        <button
          type="button"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#BCD8FF] px-4 py-3 text-sm font-semibold text-[#FFFFFF] shadow-sm transition hover:bg-[#B4C7FD]"
        >
          <Sparkles className="h-4 w-4" />
          Connect domain
        </button>
      </div>

      {/* Brand Generated + customization (static preview) */}
      <div
        className="flex flex-col w-full max-w-[334px] rounded-3xl bg-white"
        style={{
          border: "1px solid #E5E7EB",
          padding: 24,
          gap: 16,
        }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span className="font-helvetica text-[14px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
            Brand Generated
          </span>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Placeholder logo */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#EFF6FF]">
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-[#2563EB]" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-secondary-dark">
              BrewHaven
            </h3>
          </div>
        </div>

        {/* Brand Name pills */}
        <div className="flex flex-col gap-2">
          <span className="font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
            Brand Name
          </span>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-transparent bg-[#E0F2FE] px-3 py-1 text-xs font-semibold text-[#0369A1]"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] text-emerald-600">
                ✓
              </span>
              BrewHaven
            </button>
            <button
              type="button"
              className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-xs text-secondary-dark"
            >
              CozyCup
            </button>
            <button
              type="button"
              className="rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-1 text-xs text-secondary-dark"
            >
              CozyCup
            </button>
          </div>
        </div>

        {/* Logo Style pills */}
        <div className="flex flex-col gap-2">
          <span className="mb-2 mt-3 font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
            Logo Style
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs text-secondary-dark"
            >
              <span className="h-6 w-6 rounded-full bg-[#DBEAFE]" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs text-secondary-dark"
            >
              <span className="h-6 w-6 rounded-full bg-[#FEF9C3]" />
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-xs text-secondary-dark"
            >
              <span className="h-6 w-6 rounded-full bg-[#E0E7FF]" />
            </button>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="mb-2 font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
            Color Palette
          </span>
          <div className="flex flex-wrap gap-2">
            {/* Row 1 */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#10B981] text-[10px] text-white shadow-sm"
              >
                ✓
              </button>
              <div className="flex gap-2">
                <span className="h-6 w-8 rounded-lg bg-[#1E3A8A]" />
                <span className="h-6 w-8 rounded-lg bg-[#B45309]" />
                <span className="h-6 w-8 rounded-lg bg-[#FB923C]" />
                <span className="h-6 w-8 rounded-lg bg-[#FEF3C7]" />
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex items-center gap-2 pl-7">
              <div className="flex gap-2">
                <span className="h-6 w-8 rounded-lg bg-[#14532D]" />
                <span className="h-6 w-8 rounded-lg bg-[#16A34A]" />
                <span className="h-6 w-8 rounded-lg bg-[#A3E635]" />
                <span className="h-6 w-8 rounded-lg bg-[#FEF9C3]" />
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex items-center gap-2 pl-7">
              <div className="flex gap-2">
                <span className="h-6 w-8 rounded-lg bg-[#1D4ED8]" />
                <span className="h-6 w-8 rounded-lg bg-[#3B82F6]" />
                <span className="h-6 w-8 rounded-lg bg-[#60A5FA]" />
                <span className="h-6 w-8 rounded-lg bg-[#DBEAFE]" />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="mb-2 font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
            Brand Colors
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-col items-start gap-1">
              <span className="h-8 w-10 rounded-lg bg-[#1D4ED8]" />
              <span className="text-[10px] text-secondary-dark">#1D4ED8</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="h-8 w-10 rounded-lg bg-[#2563EB]" />
              <span className="text-[10px] text-secondary-dark">#2563EB</span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="h-8 w-10 rounded-lg bg-[#DBEAFE]" />
              <span className="text-[10px] text-secondary-dark">#DBEAFE</span>
            </div>
            <button
              type="button"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-[#CBD5F5] text-lg text-[#9CA3AF]"
            >
              +
            </button>
          </div>
        </div>

        {/* Palette actions */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-2 text-xs font-medium text-secondary hover:bg-[#EFF1F5]"
          >
            Regenerate
          </button>
          <button
            type="button"
            className="flex-1 rounded-full bg-[#0149E1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#003BB0]"
          >
            Use This Brand
          </button>
        </div>

        {/* Brand Name + Upload card */}
        <div
          className="mt-6 flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFF] px-4 py-4"
          style={{ boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)" }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
                Brand Name
              </span>
              <input
                type="text"
                defaultValue="Wearo"
                className="mt-1 w-full rounded-lg border border-transparent bg-transparent px-0 py-0 text-sm font-semibold text-secondary-dark focus:border-primary focus:bg-white focus:px-2 focus:py-1 focus:outline-none"
              />
            </div>
            {/* Simple toggle pill */}
            <button
              type="button"
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-[#0149E1]"
            >
              <span className="sr-only">Toggle brand name</span>
              <span className="inline-block h-5 w-5 translate-x-5 rounded-full bg-white shadow" />
            </button>
          </div>

          {/* Upload logo area */}
          <div className="mt-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DBEAFE] bg-[#E1F0FF4D] px-4 py-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[#0149E1]">
              <span className="text-sm">
                <Sparkles className="h-4 w-4" />
              </span>
            </div>
            <span className="font-helvetica text-[16px] leading-[20px] tracking-[-0.15px] font-bold text-secondary-dark">
              Upload a Logo
            </span>
            <p className="mt-1 text-[12px] text-secondary ">
              Drag &amp; Drop Or{" "}
              <button
                type="button"
                className="text-[#0149E1] underline underline-offset-2 font-bold text-[14px] hover:text-[#003BB0]"
              >
                Choose a file
              </button>
              , 5MB max file size
            </p>
          </div>

          {/* Logo actions */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0149E1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#003BB0]"
              >
                Change Logo
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]"
                aria-label="Delete logo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-full bg-[#0149E1] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#003BB0]"
            >
              <Check className="h-4 w-4" />
              Save Brand Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
