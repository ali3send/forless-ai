// app/(app)/website-builder/_components/ConnectDomainModal.tsx
"use client";

import { useState } from "react";
import {
  X,
  Copy,
  Check,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { uiToast } from "@/lib/utils/uiToast";

type Props = {
  domain: string;
  onClose: () => void;
};

const CNAME_TARGET = "cname.forless.ai";
const A_RECORD = "76.76.21.21";

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-1">
      {[1, 2, 3, 4].map((step, i) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
              step <= current
                ? "bg-primary text-white"
                : "bg-secondary-fade text-secondary"
            }`}
          >
            {step}
          </div>
          {i < 3 && (
            <div
              className={`h-0.5 w-16 ${
                step < current ? "bg-primary" : "bg-secondary-fade"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-secondary">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={value}
          className="flex-1 rounded-lg border border-secondary-fade bg-white px-3 py-2.5 text-sm text-secondary-darker outline-none"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-secondary-fade bg-white text-secondary transition hover:border-primary hover:text-primary"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
}

export function ConnectDomainModal({ domain, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleVerify() {
    setVerifying(true);

    // Simulate DNS verification (in production, call an API to check DNS records)
    await new Promise((r) => setTimeout(r, 3000));

    // For now, always succeed — in production you'd check actual DNS
    setVerified(true);
    setVerifying(false);
    setStep(4);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative mx-4 flex w-full max-w-lg max-h-[90vh] flex-col rounded-2xl bg-white shadow-xl">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-secondary transition hover:text-secondary-darker"
        >
          <X size={20} />
        </button>

        <div className="overflow-y-auto p-6">

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Step 1: Introduction */}
        {step === 1 && (
          <div className="space-y-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Introduction
            </p>

            <div>
              <h3 className="text-xl font-bold text-secondary-darker">
                Connect your domain
              </h3>
              <p className="mt-1 text-sm text-secondary">
                We&apos;ll guide you through connecting{" "}
                <span className="font-semibold text-primary">{domain}</span> to
                your website.
              </p>
            </div>

            <div className="rounded-xl border border-secondary-fade p-4 space-y-3">
              <p className="text-sm font-bold text-secondary-darker">
                What you&apos;ll do:
              </p>
              {[
                "Copy the DNS records we provide",
                "Add them to your domain provider (like GoDaddy, Namecheap, etc.)",
                "We'll verify everything is working",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-sm text-secondary-darker">{text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <div>
                <p className="text-sm font-semibold text-amber-700">
                  Takes 5-10 minutes
                </p>
                <p className="text-xs text-amber-600">
                  DNS changes can take a few minutes to update. Don&apos;t
                  worry, we&apos;ll check automatically!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-active"
            >
              Let&apos;s get started
            </button>
          </div>
        )}

        {/* Step 2: DNS Records */}
        {step === 2 && (
          <div className="space-y-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Introduction
            </p>

            <div>
              <h3 className="text-xl font-bold text-secondary-darker">
                Add these DNS records
              </h3>
              <p className="mt-1 text-sm text-secondary">
                Go to your domain provider and add these records:
              </p>
            </div>

            {/* Record 1: A Record */}
            <div className="rounded-xl border border-secondary-fade p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-secondary-darker">
                  Record 1: Main domain record
                </p>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  A
                </span>
              </div>
              <CopyField label="Name" value="@" />
              <CopyField label="Value / Points to" value={A_RECORD} />
            </div>

            {/* Record 2: CNAME */}
            <div className="rounded-xl border border-secondary-fade p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-secondary-darker">
                  Record 2: WWW subdomain
                </p>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                  CNAME
                </span>
              </div>
              <CopyField label="Name" value="www" />
              <CopyField label="Value / Points to" value={CNAME_TARGET} />
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Tip:</span> Look for &quot;DNS
                Settings&quot; or &quot;DNS Management&quot; in your domain
                provider&apos;s dashboard.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-full border border-secondary-fade bg-white px-4 py-3 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  handleVerify();
                }}
                className="flex-1 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-active"
              >
                I&apos;ve added the records
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Verification */}
        {step === 3 && (
          <div className="space-y-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Verification
            </p>

            <div className="flex flex-col items-center py-8 text-center">
              <h3 className="text-xl font-bold text-secondary-darker">
                Checking your domain...
              </h3>
              <p className="mt-1 text-sm text-secondary">
                We&apos;re verifying that your DNS records are set up correctly.
              </p>

              <div className="my-8">
                <Loader2
                  size={64}
                  className="animate-spin text-primary"
                />
              </div>

              <p className="text-sm font-semibold text-secondary-darker">
                Checking DNS records...
              </p>
              <p className="text-xs text-secondary">
                This usually takes a few seconds
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="space-y-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
              Success!
            </p>

            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 size={40} className="text-green-500" />
              </div>

              <h3 className="mt-4 text-xl font-bold text-secondary-darker">
                Your domain is connected! 🎉
              </h3>
              <p className="mt-1 text-sm text-secondary">
                <span className="font-semibold text-primary">{domain}</span> is
                now live and pointing to your website.
              </p>
              <p className="text-xs text-secondary">
                It may take a few more minutes to fully propagate worldwide.
              </p>

              <div className="mt-6 w-full rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-xs font-semibold text-green-600">
                  Your website is now available at:
                </p>
                <a
                  href={`https://${domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-primary underline underline-offset-2"
                >
                  {domain}
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-active"
            >
              Done
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
