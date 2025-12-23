// app/billing/plans/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Plan = "free" | "gowebsite" | "creator" | "pro";

type Profile = {
  plan: Plan | null;
  subscription_status: string | null;
  current_period_end: string | null;
};

const PROFILE_CACHE_KEY = "billing_profile_cache_v1";

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
    key: "gowebsite",
    name: "GoWebsite",
    price: "$0.99 / month  •  $5.99 / year",
    tagline: "Publish your first site and go live.",
    features: [
      "Everything in Free",
      "1 published website",
      "Basic website editor",
      "Connect your own domain",
      "Hosting included",
    ],
  },
  {
    key: "creator",
    name: "Creator",
    price: "$2.49 / month  •  $19 / year",
    tagline: "Brand + templates + marketing kit for creators.",
    features: [
      "Everything in GoWebsite",
      "Full brand kit",
      "Logo generations",
      "Templates",
      "Marketing kit",
    ],
    highlight: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$4.99 / month  •  $39 / year",
    tagline: "Unlimited brands, templates, and marketing suite.",
    features: [
      "Up to 5 published websites",
      "Unlimited brand kits",
      "Full template library",
      "Full marketing suites",
      "Priority support",
    ],
  },
];

const FREE_FEATURES = [
  "1 Brand Kit (logo, colors, fonts, slogan, tagline)",
  "AI name & slogan generation",
  "Unlimited logo previews",
  "1 Website Preview",
  "3 Marketing Posts + 3 Emails + 3 Ads",
  "10 free design templates (cards, banners, invoice)",
  "Manual editing enabled",
  "1 Campaign Folder",
];

export default function BillingPlansPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = sessionStorage.getItem(PROFILE_CACHE_KEY);
      if (raw) setProfile(JSON.parse(raw) as Profile);
    } catch {}
  }, []);

  const currentPlan: Plan = (profile?.plan ?? "free") as Plan;

  const isPaidPlan =
    profile?.plan === "gowebsite" ||
    profile?.plan === "creator" ||
    profile?.plan === "pro";

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!profile) setLoading(true);

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!alive) return;

        if (!user) {
          setProfile(null);
          try {
            sessionStorage.removeItem(PROFILE_CACHE_KEY);
          } catch {}
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("plan, subscription_status, current_period_end")
          .eq("id", user.id)
          .single();

        if (!alive) return;
        if (error) throw error;

        const nextProfile: Profile = {
          plan: (data?.plan ?? "free") as Plan,
          subscription_status: data?.subscription_status ?? null,
          current_period_end: data?.current_period_end ?? null,
        };

        setProfile(nextProfile);
        try {
          sessionStorage.setItem(
            PROFILE_CACHE_KEY,
            JSON.stringify(nextProfile)
          );
        } catch {}
      } catch (e: any) {
        if (!alive) return;
        toast.error(e?.message ?? "Failed to load billing info");
      } finally {
        if (alive) setLoading(false);
      }
    }

    void load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void load();
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function startCheckout(plan: Exclude<Plan, "free">) {
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
            Upgrade to unlock publishing, more websites, more brand kits, and
            the full marketing suite.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!hydrated ? (
            <span className="text-xs text-slate-400">Loading…</span>
          ) : loading && !profile ? (
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

          {hydrated && isPaidPlan && (
            <button onClick={openPortal} className="btn-secondary">
              Manage
            </button>
          )}
        </div>
      </div>

      {/* Free plan (always visible) */}
      <div className="mt-6 rounded-2xl border border-slate-800 bg-bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Free</h2>
              {currentPlan === "free" && (
                <span className="text-[11px] rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-slate-200">
                  Current
                </span>
              )}
            </div>
            <div className="text-2xl font-bold mt-2">$0</div>
            <div className="text-sm text-text-muted mt-1">
              Try the full flow once and preview your website.
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!profile ? (
              <button
                onClick={() => router.push("/auth/login")}
                className="btn-secondary"
              >
                Login
              </button>
            ) : currentPlan !== "free" ? (
              <button onClick={openPortal} className="btn-secondary">
                Manage
              </button>
            ) : null}
          </div>
        </div>

        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {FREE_FEATURES.map((f) => (
            <li key={f} className="flex gap-2 text-slate-200">
              <span className="text-primary mt-0.5">✓</span>
              <span className="text-slate-200">{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 text-[11px] text-text-muted">
          Upgrade anytime to publish and unlock higher limits.
        </div>
      </div>

      {/* Paid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
                  <div className="text-xl font-bold mt-2">{p.price}</div>
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

              <div className="mt-5 flex gap-2 flex-wrap">
                {!hydrated ? (
                  <button
                    className={p.highlight ? "btn-fill" : "btn-secondary"}
                    disabled
                  >
                    Loading…
                  </button>
                ) : loading && !profile ? (
                  <button
                    className={p.highlight ? "btn-fill" : "btn-secondary"}
                    disabled
                  >
                    Loading…
                  </button>
                ) : profile ? (
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
                    onClick={() => router.push("/auth/login")}
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
              Never. You can keep your projects. Paid limits may revert to Free.
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
