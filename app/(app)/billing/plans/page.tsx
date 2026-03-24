// app/(app)/billing/plans/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

import BillingHeader from "./_components/BillingHeader";
import FreePlanCard from "./_components/FreePlanCard";
import PaidPlanCard from "./_components/PaidPlanCard";
import type { CheckoutDetails } from "./_components/CheckoutDetailsModal";
import type {
  BillingInterval,
  PaidPlan,
  Plan,
  Profile,
} from "../../../../lib/billing/types/types";
import { PROFILE_CACHE_KEY } from "./_lib/utils";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { PLANS } from "@/lib/billing/data/plans";

const FAQ_ITEMS = [
  {
    q: "Will my projects be deleted if I cancel?",
    a: "No. Your projects stay safe. If you cancel, paid features stop and your account returns to the Free plan.",
  },
  {
    q: "Will my projects be deleted if I cancel ?",
    a: "No. Your projects stay safe. If you cancel, paid features stop and your account returns to the Free plan.",
  },
  {
    q: "Do I need a credit card to get started ?",
    a: "No. You can start with the Free plan without any payment information.",
  },
  {
    q: "What happens when I upgrade?",
    a: "You get instant access to all features in your new plan. Your existing projects are preserved.",
  },
  {
    q: "Can I use my own domain?",
    a: "Yes. All paid plans support connecting your own custom domain.",
  },
  {
    q: "Is hosting included?",
    a: "Yes. All plans include fast, secure hosting with SSL certificates.",
  },
  {
    q: "Is my website live immediately?",
    a: "Yes. Once you publish, your website goes live within seconds.",
  },
  {
    q: "Can I edit my website after it\u2019s generated?",
    a: "Absolutely. You can edit every section, text, image, and layout after generation.",
  },
  {
    q: "Is Forless good for small businesses and freelancers?",
    a: "Yes. Forless is built specifically for small businesses, freelancers, and creators who need a professional website quickly.",
  },
  {
    q: "Do you offer refunds?",
    a: "We offer a satisfaction guarantee. Contact support within 7 days for a full refund.",
  },
];

export default function BillingPlansPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    profile?.plan === "creator";

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
          setUserEmail(null);
          try {
            sessionStorage.removeItem(PROFILE_CACHE_KEY);
          } catch {}
          return;
        }

        setUserEmail(user.email ?? null);

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
    billingInterval: BillingInterval,
    details: CheckoutDetails
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
          interval: billingInterval,
          fullName: details.fullName,
          email: details.email,
          company: details.company,
          city: details.city,
          country: details.country,
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <BillingHeader
          hydrated={hydrated}
          loading={loading}
          profile={profile}
          currentPlan={currentPlan}
          statusText={statusText}
          isPaidPlan={isPaidPlan}
          onManage={openPortal}
        />

        {/* Pricing cards */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <FreePlanCard
            currentPlan={currentPlan}
            hydrated={hydrated}
            loading={loading}
            profile={profile}
            onLogin={() => router.push("/auth/login")}
          />
          {PLANS.map((p) => (
            <PaidPlanCard
              key={p.key}
              plan={p}
              currentPlan={currentPlan}
              hydrated={hydrated}
              loading={loading}
              profile={profile}
              userEmail={userEmail}
              onCheckout={startCheckout}
              onManage={openPortal}
              onLogin={() => router.push("/auth/login")}
            />
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-center text-3xl font-bold tracking-tight text-secondary-darker">
            FAQ
          </h2>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className={`rounded-xl border transition ${
                    isOpen
                      ? "border-primary bg-white"
                      : "border-secondary-fade bg-gray-50"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-secondary-darker">
                      {item.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-primary text-white"
                          : "bg-secondary-fade text-secondary"
                      }`}
                    >
                      <ChevronDown
                        size={16}
                        className={`transition ${isOpen ? "rotate-180" : ""}`}
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed text-secondary">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
