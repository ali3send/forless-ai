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
  const { user, isAdmin } = useAuth();
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const [billingOpen, setBillingOpen] = useState(false);
  const billingRef = useRef<HTMLDivElement | null>(null);

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
          } catch {
            toast.error("Failed to log out.");
          } finally {
            toast.dismiss(t);
          }
        },
      },
      cancel: "Cancel",
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
    <header className="border-b border-secondary-fade bg-secondary-soft/90 backdrop-blur z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-md">
            <Image
              src="/img.jpeg"
              alt="ForlessAI Logo"
              width={32}
              height={32}
              className="object-cover mt-1.5"
            />
          </div>

          <span className="font-semibold tracking-tight text-sm sm:text-base text-secondary-dark">
            ForlessAI
          </span>
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-secondary">
          <Link href="/" className="hover:text-secondary-dark">
            Home
          </Link>

          {user && (
            <Link href="/dashboard" className="hover:text-secondary-dark">
              Dashboard
            </Link>
          )}

          {user && (
            <div className="relative" ref={billingRef}>
              <button
                type="button"
                onClick={() => setBillingOpen((v) => !v)}
                className="inline-flex items-center gap-1 hover:text-secondary-dark"
                aria-haspopup="menu"
                aria-expanded={billingOpen}
              >
                Packages <span className="text-[10px]">▾</span>
              </button>

              {billingOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-lg border border-secondary-fade bg-secondary-soft shadow-lg overflow-hidden z-50"
                  role="menu"
                >
                  <Link
                    href="/billing/plans"
                    onClick={() => setBillingOpen(false)}
                    className="block px-3 py-2 text-sm text-secondary-dark hover:bg-secondary-light"
                    role="menuitem"
                  >
                    <div className="font-semibold">View Plans</div>
                    <div className="text-[11px] text-secondary">
                      Upgrade or compare packages
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setBillingOpen(false);
                      openBillingPortal();
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-secondary-dark hover:bg-secondary-light"
                    role="menuitem"
                  >
                    <div className="font-semibold">Manage Subscription</div>
                    <div className="text-[11px] text-secondary">
                      Cancel, invoices, payment method
                    </div>
                  </button>

                  <div className="h-px bg-secondary-fade" />
                </div>
              )}
            </div>
          )}

          {user && isAdmin && (
            <Link href="/admin" className="hover:text-secondary-dark">
              Admin Panel
            </Link>
          )}

          <div className="h-4 w-px bg-secondary-fade hidden sm:block" />

          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="hover:text-secondary-dark"
              >
                Logout
              </button>

              <button className="flex items-center gap-2 rounded-full border border-secondary-fade bg-secondary-light px-3 py-1.5 text-xs text-secondary-dark">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary-soft text-[10px] text-secondary-dark border border-secondary-fade">
                  {userInitial}
                </span>
                <span className="hidden sm:inline text-secondary-darker">
                  {user.email}
                </span>
                <span className="text-[10px] text-secondary-dark">▾</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-secondary hover:text-secondary-dark"
              >
                Login
              </Link>

              <Link
                href="/auth/signup"
                className="rounded-md bg-primary px-3 py-1 text-white font-semibold hover:bg-primary-hover transition text-xs sm:text-sm"
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
