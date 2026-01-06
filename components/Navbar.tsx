// components/Navbar.tsx
"use client";

import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
// import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export function Navbar() {
  // const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  // const [supabase] = useState(() => createBrowserSupabaseClient());

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

  const handleLogout = () => {
    toast.error("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: async () => {
          const t = toast.loading("Logging out...");
          try {
            await logout(); // 🔑 provider-controlled logout
            window.location.href = "/auth/login"; // hard navigation
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
    } catch (e: unknown) {
      toast.dismiss(t);
      toast.error(getErrorMessage(e, "Could not open billing portal"));
    }
  }

  const userInitial = useMemo(() => {
    const x = user?.email?.slice(0, 1).toUpperCase();
    return x || "U";
  }, [user?.email]);

  return (
    <header className="border-b border-secondary-fade bg-secondary-fade backdrop-blur z-50">
      <nav className=" mx-auto flex items-center justify-between px-5  py-3">
        <Link href="/" className="">
          <div className=" overflow-hidden rounded-md">
            <Image
              src="/img.png"
              alt="ForlessAI Logo"
              width={100}
              height={100}
              className="object-cover mt-1.5"
            />
          </div>
        </Link>

        <div className="flex items-center gap-4 text-xs sm:text-sm text-secondary-dark font-semibold">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {user && (
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          )}

          {user && (
            <div className="relative" ref={billingRef}>
              <button
                type="button"
                onClick={() => setBillingOpen((v) => !v)}
                className="inline-flex items-center gap-1 "
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
                    className="cursor-pointer block w-full text-left px-3 py-2 text-sm text-secondary-dark hover:bg-secondary-light"
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

          {isAdmin && (
            <Link href="/admin" className="hover:underline">
              Admin Panel
            </Link>
          )}

          <div className="h-4 w-px bg-secondary-fade hidden sm:block" />

          {user ? (
            <>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>

              <button className="flex items-center gap-2 rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1.5 text-xs text-secondary-dark">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary-light text-[10px] text-secondary-dark ">
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
                className="text-secondary hover:underline"
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
