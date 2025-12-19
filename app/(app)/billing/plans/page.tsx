// app/billing/plans/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Plan = "free" | "creator" | "pro";

type Profile = {
  plan: Plan | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

function cx(...s: Array<string | false | undefined | null>) {
  return s.filter(Boolean).join(" ");
}

const PLANS: Array<{
  key: Exclude<Plan, "free">;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
}> = [
  {
    key: "creator",
    name: "Creator",
    price: "$10 / month",
    tagline: "For solo builders shipping fast.",
    features: [
      "More projects & generations",
      "Brand kit (palette + fonts)",
      "Publish to a custom subdomain",
      "Priority generation queue",
      "Email support",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    price: "$20 / month",
    tagline: "For teams & serious builders.",
    highlight: true,
    features: [
      "Everything in Creator",
      "Higher limits + faster generation",
      "Advanced templates access",
      "Team-ready workflow",
      "Priority support",
    ],
  },
];

export default function BillingPlansPage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  const currentPlan: Plan = (profile?.plan ?? "free") as Plan;
  const isPaid = currentPlan === "creator" || currentPlan === "pro";

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("plan, subscription_status, current_period_end")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (!alive) return;

        setProfile({
          plan: (data?.plan ?? "free") as Plan,
          subscription_status: data?.subscription_status ?? null,
          current_period_end: data?.current_period_end ?? null,
        });
      } catch (e: any) {
        if (!alive) return;
        toast.error(e?.message ?? "Failed to load billing info");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [supabase]);

  const statusText = useMemo(() => {
    if (!profile) return null;
    const s = profile.subscription_status;
    if (!s) return null;
    if (s === "active") return "Active";
    if (s === "trialing") return "Trial";
    if (s === "past_due") return "Past due";
    if (s === "canceled") return "Canceled";
    return s;
  }, [profile]);

  async function startCheckout(plan: "creator" | "pro") {
    const t = toast.loading("Redirecting to checkout…");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
        body: JSON.stringify({
          plan,
          idempotencyKey:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `checkout:${Date.now()}`,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to start checkout");
      if (!json?.url) throw new Error("Missing checkout URL");

      toast.dismiss(t);
      toast.success("Opening Stripe checkout…");
      window.location.href = json.url;
    } catch (e: any) {
      toast.dismiss(t);
      toast.error(e?.message ?? "Checkout failed");
    }
  }

  async function openPortal() {
    const t = toast.loading("Opening billing portal…");
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to open portal");
      if (!json?.url) throw new Error("Missing portal URL");

      toast.dismiss(t);
      toast.success("Redirecting…");
      window.location.href = json.url;
    } catch (e: any) {
      toast.dismiss(t);
      toast.error(e?.message ?? "Could not open billing portal");
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Packages
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Upgrade to unlock higher limits, better templates, and faster
            generation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : profile ? (
            <div className="rounded-lg border border-slate-800 bg-bg-card px-3 py-2">
              <div className="text-[11px] text-text-muted">Current plan</div>
              <div className="text-sm font-semibold capitalize">
                {currentPlan}
                {statusText ? (
                  <span className="ml-2 text-[11px] font-normal text-slate-400">
                    • {statusText}
                  </span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-800 bg-bg-card px-3 py-2">
              <div className="text-[11px] text-text-muted">Not signed in</div>
              <div className="text-sm font-semibold">Free</div>
            </div>
          )}

          {isPaid && (
            <button onClick={openPortal} className="btn-secondary">
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {PLANS.map((p) => {
          const isCurrent = currentPlan === p.key;
          return (
            <div
              key={p.key}
              className={cx(
                "rounded-2xl border p-5 bg-bg-card",
                p.highlight ? "border-primary/50" : "border-slate-800"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{p.name}</h2>
                    {p.highlight && (
                      <span className="text-[11px] rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-primary">
                        Popular
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-[11px] rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold mt-2">{p.price}</div>
                  <div className="text-sm text-text-muted mt-1">
                    {p.tagline}
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-slate-200">
                    <span className="text-primary mt-[2px]">✓</span>
                    <span className="text-slate-200">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex gap-2">
                {profile ? (
                  isCurrent ? (
                    <>
                      <button onClick={openPortal} className="btn-secondary">
                        Manage subscription
                      </button>
                      <button
                        onClick={() => startCheckout(p.key)}
                        className="btn-secondary"
                        title="Use this if you want to switch plans"
                      >
                        Switch plan
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startCheckout(p.key)}
                      className={p.highlight ? "btn-fill" : "btn-secondary"}
                    >
                      Upgrade to {p.name}
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => toast.error("Please login to upgrade")}
                    className={p.highlight ? "btn-fill" : "btn-secondary"}
                  >
                    Login to upgrade
                  </button>
                )}
              </div>

              <div className="mt-3 text-[11px] text-text-muted">
                Cancel anytime. Payments handled securely by Stripe.
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom info */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-bg-card p-5">
        <div className="text-sm font-semibold">FAQ</div>
        <div className="mt-2 grid gap-3 text-sm text-text-muted">
          <div>
            <div className="text-slate-200">
              Will my projects be deleted if I cancel?
            </div>
            <div>
              Never. You can keep your projects. Paid features/limits may revert
              to Free.
            </div>
          </div>
          <div>
            <div className="text-slate-200">
              How do I change or cancel my plan?
            </div>
            <div>
              Open “Manage” to update payment method, download invoices, or
              cancel.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
