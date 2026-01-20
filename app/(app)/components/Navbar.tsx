// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [billingOpen, setBillingOpen] = useState(false);
  const billingRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    uiToast.confirm({
      title: "Are you sure you want to logout?",
      confirmLabel: "Logout",
      destructive: true,

      onConfirm: async () => {
        const t = uiToast.loading("Logging out...");

        try {
          await logout();
          window.location.href = "/auth/login"; // hard navigation
        } catch (e: unknown) {
          uiToast.error(e, "Failed to log out.");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  };

  async function openBillingPortal() {
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
      if (!res.ok)
        throw new Error(json?.error || "Failed to open billing portal");

      if (!json?.url) throw new Error("Missing portal URL");
      uiToast.dismiss(t);
      uiToast.success("Redirecting…");
      window.location.href = json.url;
    } catch (e: unknown) {
      uiToast.dismiss(t);
      uiToast.error(getErrorMessage(e, "Could not open billing portal"));
    }
  }

  const userInitial = useMemo(() => {
    const x = user?.email?.slice(0, 1).toUpperCase();
    return x || "U";
  }, [user?.email]);

  return (
    <header className="sm:relative border-b border-secondary-fade bg-secondary-fade backdrop-blur  sticky top-0 z-50">
      <nav className="mx-auto flex items-center justify-between px-4 py-3 ">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/img.png"
            alt="ForlessAI Logo"
            width={90}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 text-xs sm:text-sm text-secondary-dark font-semibold">
          <Link href="/" className="hover:underline">
            Home
          </Link>

          {user && (
            <>
              <Link href="/dashboard" className="hover:underline">
                Dashboard
              </Link>
              <Link href="/dashboard/messages" className="hover:underline">
                Messages
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={billingRef}>
              <button
                type="button"
                onClick={() => setBillingOpen((v) => !v)}
                className="inline-flex items-center gap-1"
              >
                Packages <span className="text-[10px]">▾</span>
              </button>

              {billingOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-secondary-soft shadow-lg z-50 overflow-hidden">
                  <Link
                    href="/billing/plans"
                    onClick={() => setBillingOpen(false)}
                    className="block px-3 py-2 hover:bg-secondary-light"
                  >
                    View Plans
                  </Link>
                  <button
                    onClick={() => {
                      setBillingOpen(false);
                      openBillingPortal();
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-secondary-light"
                  >
                    Manage Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <Link href="/admin" className="hover:underline">
              Admin Panel
            </Link>
          )}

          <div className="h-4 w-px bg-secondary-fade" />

          {user ? (
            <>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>

              <div className="flex items-center gap-2 rounded-full border bg-secondary-soft px-3 py-1.5">
                <span className="h-6 w-6 rounded-full bg-secondary-light flex items-center justify-center text-[10px]">
                  {userInitial}
                </span>
                <span className="hidden sm:inline">{user.email}</span>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link
                href="/auth/signup"
                className="rounded-md bg-primary px-3 py-1 text-white"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden text-xl font-bold"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full md:hidden z-50">
          <div className="mx-2 mt-2 rounded-xl border border-secondary-fade bg-secondary-soft shadow-xl">
            <div className="flex flex-col divide-y divide-secondary-fade text-sm font-medium">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 hover:bg-secondary-light"
              >
                Home
              </Link>

              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 hover:bg-secondary-light"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/messages"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 hover:bg-secondary-light"
                  >
                    Messages
                  </Link>

                  <Link
                    href="/billing/plans"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 hover:bg-secondary-light"
                  >
                    Plans
                  </Link>
                </>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 hover:bg-secondary-light"
                >
                  Admin Panel
                </Link>
              )}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-3 text-red-600 hover:bg-red-500/10"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-4 py-3 hover:bg-secondary-light"
                  >
                    Login
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="m-3 rounded-md bg-primary px-4 py-2 text-center text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
