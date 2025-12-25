import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function BillingSuccessPage() {
  return (
    <main className="relative min-h-[80vh] overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/18 blur-[130px]" />
        <div className="absolute -bottom-40 right-[-140px] h-[520px] w-[520px] rounded-full bg-primary/12 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.04),transparent_45%)]" />
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-14 sm:py-16">
        <Suspense fallback={<SuccessFallback />}>
          <SuccessClient />
        </Suspense>
      </div>
    </main>
  );
}
function SuccessFallback() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-secondary-dark bg-slate-900/60 p-6 shadow-lg backdrop-blur">
      <div className="animate-pulse">
        <div className="h-12 w-12 rounded-full bg-secondary-dark" />
        <div className="mt-4 h-6 w-2/3 rounded bg-secondary-dark" />
        <div className="mt-3 h-4 w-full rounded bg-secondary-dark" />
        <div className="mt-2 h-4 w-5/6 rounded bg-secondary-dark" />
        <div className="mt-6 h-10 w-full rounded bg-secondary-dark" />
        <div className="mt-3 h-10 w-full rounded bg-secondary-dark" />
      </div>
    </section>
  );
}
