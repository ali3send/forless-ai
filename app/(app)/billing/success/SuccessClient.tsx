"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uiToast } from "@/lib/utils/uiToast";

export default function SuccessClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const sessionId = sp.get("session_id") || "";

  const [seconds, setSeconds] = useState(5);
  const [status, setStatus] = useState<"checking" | "verified" | "unverified">(
    "checking"
  );

  // Optional: verify session (nice UX)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!sessionId) {
        setStatus("unverified");
        return;
      }

      try {
        const res = await fetch(
          `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store", headers: { "Cache-Control": "no-store" } }
        );

        if (!res.ok) throw new Error("not ok");
        const json = await res.json().catch(() => ({}));

        if (!cancelled) {
          setStatus(json?.ok ? "verified" : "unverified");
        }
      } catch {
        if (!cancelled) setStatus("unverified");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  // Countdown + redirect
  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds !== 0) return;
    uiToast.success("Redirecting to dashboard…");
    router.push("/dashboard");
  }, [seconds, router]);

  const shortId = useMemo(() => {
    if (!sessionId) return "";
    return sessionId.length > 18
      ? `${sessionId.slice(0, 10)}…${sessionId.slice(-6)}`
      : sessionId;
  }, [sessionId]);

  return (
    <section className="relative w-full max-w-md">
      <div className="relative rounded-2xl border border-secondary-fade bg-secondary-soft p-6 shadow-sm backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/10">
            <span className="text-primary text-xl">✓</span>
          </div>

          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Payment successful
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-secondary-dark">
              You’re all set 🎉
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Your subscription is active. You can now access your plan
              features.
            </p>
          </div>
        </div>

        {/* session info */}
        <div className="mt-5 rounded-xl border border-secondary-fade bg-secondary-light p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-secondary">Verification</p>
            <span
              className={[
                "inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold",
                status === "verified"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                  : status === "checking"
                  ? "border-secondary-fade bg-secondary-soft text-secondary-dark"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-700",
              ].join(" ")}
            >
              {status === "verified"
                ? "Verified"
                : status === "checking"
                ? "Checking…"
                : "Unverified"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-xs text-secondary">Session</p>
            <p className="truncate font-mono text-xs text-secondary-dark">
              {shortId || "—"}
            </p>
          </div>

          <div className="mt-3 h-px w-full bg-secondary-fade" />

          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-xs text-secondary">Auto redirect</p>
            <p className="text-xs text-secondary">
              Dashboard in{" "}
              <span className="font-semibold text-secondary-dark">
                {seconds}s
              </span>
            </p>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition"
          >
            Go to Dashboard
          </Link>

          {/* <Link
          href="/billing"
          className="inline-flex items-center justify-center rounded-md border border-secondary-active bg-slate-900/30 px-4 py-2.5 text-sm font-semibold text-slate-100 hover:border-primary hover:text-primary-hover transition"
        >
          View Billing
        </Link> */}
        </div>

        <p className="mt-5 text-center text-xs text-secondary">
          If something looks wrong, open Billing and refresh your plan status.
        </p>
      </div>
    </section>
  );
}
