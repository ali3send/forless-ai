// app/(app)/billing/plans/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

import BillingHeader from "./_components/BillingHeader";
import FreePlanCard from "./_components/FreePlanCard";
import PaidPlanCard from "./_components/PaidPlanCard";

import { PLANS, FREE_FEATURES } from "./_data/plans";
import type { BillingInterval, PaidPlan, Plan, Profile } from "./_lib/types";
import { PROFILE_CACHE_KEY } from "./_lib/utils";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export default function BillingPlansPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  // const [interval, setInterval] = useState<BillingInterval>("monthly");

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
      } catch (e: unknown) {
        if (!alive) return;
        uiToast.error(getErrorMessage(e, "Failed to load profile"));
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

  async function startCheckout(
    plan: PaidPlan,
    billingInterval: BillingInterval
  ) {
    const t = uiToast.loading("Redirecting to checkout…");
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
          interval: billingInterval, // ✅ NEW
          idempotencyKey:
            typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `checkout:${Date.now()}`,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to start checkout");
      if (!json?.url) throw new Error("Missing checkout URL");

      uiToast.dismiss(t);
      uiToast.success("Opening Stripe checkout…");
      router.push(json.url);
    } catch (e: unknown) {
      uiToast.dismiss(t);
      uiToast.error(getErrorMessage(e, "Could not start checkout"));
    }
  }

  async function openPortal() {
    const t = uiToast.loading("Opening billing portal…");
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

      uiToast.dismiss(t);
      uiToast.success("Redirecting…");
      router.push(json.url);
    } catch (e: unknown) {
      uiToast.dismiss(t);
      uiToast.error(getErrorMessage(e, "Could not open billing portal"));
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <BillingHeader
        hydrated={hydrated}
        loading={loading}
        profile={profile}
        currentPlan={currentPlan}
        statusText={statusText}
        isPaidPlan={isPaidPlan}
        // interval={interval}
        // setInterval={setInterval}
        onManage={openPortal}
      />

      <FreePlanCard
        currentPlan={currentPlan}
        profile={profile}
        freeFeatures={FREE_FEATURES}
        onLogin={() => router.push("/auth/login")}
        onManage={openPortal}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {PLANS.map((p) => (
          <PaidPlanCard
            key={p.key}
            plan={p}
            // interval={interval}
            currentPlan={currentPlan}
            hydrated={hydrated}
            loading={loading}
            profile={profile}
            onCheckout={startCheckout}
            onManage={openPortal}
            onLogin={() => router.push("/auth/login")}
          />
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-secondary-fade bg-secondary-fade p-5 shadow-sm">
        <div className="text-sm font-semibold text-secondary-dark">FAQ</div>

        <div className="mt-2 grid gap-3 text-sm text-secondary">
          <div>
            <div className="font-semibold text-secondary-dark">
              Will my projects be deleted if I cancel?
            </div>
            <div>
              Never. You can keep your projects. Paid limits may revert to Free.
            </div>
          </div>

          <div>
            <div className="font-semibold text-secondary-dark">
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
