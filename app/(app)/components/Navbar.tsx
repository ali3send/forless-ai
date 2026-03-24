// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [billingOpen, setBillingOpen] = useState(false);
  const billingRef = useRef<HTMLDivElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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

  const handleLogout = () => setShowLogout(true);

  async function confirmLogout() {
    setLoggingOut(true);
    try {
      await logout();
      window.location.href = "/auth/login";
    } catch (e: unknown) {
      uiToast.error(e, "Failed to log out.");
      setLoggingOut(false);
    }
  }

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
    <header className="sticky top-0 z-50 border-b border-secondary-fade bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/img.png"
            alt="ForlessAI Logo"
            width={140}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Center Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary-active">
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/billing/plans"
            className="transition-colors hover:text-primary"
          >
            Pricing
          </Link>

          {user && (
            <>
              <Link
                href="/dashboard"
                className="transition-colors hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/messages"
                className="transition-colors hover:text-primary"
              >
                Messages
              </Link>
            </>
          )}

          {user && (
            <div className="relative" ref={billingRef}>
              <button
                type="button"
                onClick={() => setBillingOpen((v) => !v)}
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                Packages <span className="text-[10px]">▾</span>
              </button>

              {billingOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-secondary-fade bg-white shadow-lg z-50 overflow-hidden">
                  <Link
                    href="/billing/plans"
                    onClick={() => setBillingOpen(false)}
                    className="block px-4 py-2.5 text-sm text-secondary-dark hover:bg-gray-50 transition-colors"
                  >
                    View Plans
                  </Link>
                  <button
                    onClick={() => {
                      setBillingOpen(false);
                      openBillingPortal();
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-secondary-dark hover:bg-gray-50 transition-colors"
                  >
                    Manage Subscription
                  </button>
                </div>
              )}
            </div>
          )}

          {isAdmin && (
            <Link
              href="/admin"
              className="transition-colors hover:text-primary"
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={handleLogout}
                className="rounded-full border border-secondary-fade px-5 py-2 text-sm font-medium text-secondary-dark transition-all hover:border-secondary-light hover:bg-gray-50"
              >
                Logout
              </button>

              <div className="flex items-center gap-2 rounded-full border border-secondary-fade bg-gray-50 px-3 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                  {userInitial}
                </span>
                <span className="hidden lg:inline text-sm text-secondary-dark">
                  {user.email}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-full border border-secondary-fade px-5 py-2 text-sm font-medium text-secondary-dark transition-all hover:border-primary hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-active hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-secondary-dark hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {mobileOpen ? (
              <>
                <path d="M5 5l10 10M15 5L5 15" />
              </>
            ) : (
              <>
                <path d="M3 5h14M3 10h14M3 15h14" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full md:hidden z-50 border-b border-secondary-fade bg-white shadow-lg">
          <div className="flex flex-col px-4 py-3 text-sm font-medium">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/billing/plans"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
            >
              Pricing
            </Link>

            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/messages"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
                >
                  Messages
                </Link>
                <Link
                  href="/billing/plans"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
                >
                  Plans
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-secondary-dark hover:bg-gray-50 transition-colors"
              >
                Admin Panel
              </Link>
            )}

            <div className="my-2 h-px bg-secondary-fade" />

            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full border border-secondary-fade py-2.5 text-center text-secondary-dark hover:border-primary hover:text-primary transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full bg-primary py-2.5 text-center font-semibold text-white hover:bg-primary-active transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Logout Modal */}
      {showLogout && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center">
            {/* Close */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                className="text-lg text-secondary hover:text-secondary-darker transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Icon */}
            <div className="mx-auto mt-1 flex h-14 w-14 items-center justify-center rounded-xl border border-secondary-fade">
              <LogOut size={24} className="text-secondary-darker" />
            </div>

            {/* Text */}
            <h2 className="mt-4 text-xl font-bold text-secondary-darker">
              Log Out
            </h2>
            <p className="mt-2 text-sm text-secondary">
              Are you sure you want to log out of your account?
            </p>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogout(false)}
                disabled={loggingOut}
                className="flex-1 rounded-full border border-secondary-fade px-4 py-2.5 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 rounded-full bg-accent-soft px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {loggingOut ? "Logging out…" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
