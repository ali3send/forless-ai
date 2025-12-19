// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { user, loading, isAdmin, role } = useAuth();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  // --- Billing dropdown state
  const [billingOpen, setBillingOpen] = useState(false);
  const billingRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click / ESC
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!billingOpen) return;
      const el = billingRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target))
        setBillingOpen(false);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!billingOpen) return;
      if (e.key === "Escape") setBillingOpen(false);
    }

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [billingOpen]);

  const handleLogout = async () => {
    toast.error("are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: async () => {
          const t = toast.loading("Logging out...");
          try {
            await supabase.auth.signOut();
            router.push("/auth/login");
            toast.success("Logged out successfully!");
          } catch (error) {
            toast.error("Failed to log out.");
          } finally {
            toast.dismiss(t);
          }
        },
      },
      cancel: { label: "Cancel" },
    });
  };

  async function openBillingPortal() {
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
      if (!res.ok)
        throw new Error(json?.error || "Failed to open billing portal");

      if (!json?.url) throw new Error("Missing portal URL");
      toast.dismiss(t);
      toast.success("Redirecting…");
      window.location.href = json.url;
    } catch (e: any) {
      toast.dismiss(t);
      toast.error(e?.message ?? "Could not open billing portal");
    }
  }

  const userInitial = useMemo(() => {
    const x = user?.email?.slice(0, 1).toUpperCase();
    return x || "U";
  }, [user?.email]);

  return (
    <header className="border-b border-slate-800 bg-bg-card backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden">
            <Image
              src="/img.jpeg"
              alt="ForlessAI Logo"
              width={32}
              height={32}
              className="object-cover mt-1.5"
            />
          </div>

          <span className="font-semibold tracking-tight text-sm sm:text-base">
            ForlessAI
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <Link href="/" className="text-slate-300 hover:text-white">
            Home
          </Link>

          {user && (
            <Link href="/dashboard" className="text-slate-300 hover:text-white">
              Dashboard
            </Link>
          )}

          {/* ✅ Packages / Billing dropdown (only when logged in) */}
          {user && (
            <div className="relative" ref={billingRef}>
              <button
                type="button"
                onClick={() => setBillingOpen((v) => !v)}
                className="text-slate-300 hover:text-white inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={billingOpen}
              >
                Packages <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {billingOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 rounded-lg border border-slate-700 bg-slate-950 shadow-lg overflow-hidden z-50"
                  role="menu"
                >
                  <Link
                    href="/billing/plans"
                    onClick={() => setBillingOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
                    role="menuitem"
                  >
                    View Plans
                    <div className="text-[11px] text-slate-400">
                      Upgrade or compare packages
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setBillingOpen(false);
                      openBillingPortal();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
                    role="menuitem"
                  >
                    Manage Subscription
                    <div className="text-[11px] text-slate-400">
                      Cancel, invoices, payment method
                    </div>
                  </button>

                  <div className="h-px bg-slate-800" />

                  <Link
                    href="/billing"
                    onClick={() => setBillingOpen(false)}
                    className="block px-3 py-2 text-sm text-slate-300 hover:bg-slate-900"
                    role="menuitem"
                  >
                    Billing Dashboard
                  </Link>
                </div>
              )}
            </div>
          )}

          {user && isAdmin && (
            <Link
              href="/admin"
              className="text-sm text-white/80 hover:text-white"
            >
              Admin Panel
            </Link>
          )}

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-white"
              >
                Logout
              </button>

              <button className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 text-[10px]">
                  {userInitial}
                </span>
                <span className="hidden sm:inline">{user.email}</span>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-slate-300 hover:text-white"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-primary px-3 py-1 text-slate-950 font-semibold hover:bg-primary-hover transition text-xs sm:text-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
