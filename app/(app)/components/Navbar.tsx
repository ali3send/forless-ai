// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers";
import { LogOut, User } from "lucide-react";
import { useState } from "react";
import { uiToast } from "@/lib/utils/uiToast";
import { LogoutModal } from "./LogoutModal";

/** Placeholder unread count for Messages badge; replace with real data when available. */
const MESSAGES_BADGE_COUNT = 2;

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true);
    try {
      await logout();
      setLogoutModalOpen(false);
      window.location.href = "/auth/login";
    } catch (e: unknown) {
      uiToast.error(e, "Failed to log out.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const navLinkClass = "text-sm font-medium transition hover:opacity-80";
  const activeClass = "text-[#0149E1]";
  const inactiveClass = "text-gray-800";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="relative mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        {/* Brand: blue square + $ then FORLESS */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-[#0149E1] bg-white text-[#FD6C11]"
            style={{ fontFamily: "Helvetica, sans-serif", fontWeight: 700 }}
          >
            $
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "Helvetica, sans-serif" }}
          >
            <span className="text-[#0149E1]">FOR</span>
            <span className="text-[#FD6C11]">LESS</span>
          </span>
        </Link>

        {/* Center nav: Home, Dashboard, Messages, Pricing */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:flex md:items-center md:gap-8">
          <Link
            href="/"
            className={`${navLinkClass} ${pathname === "/" ? activeClass : inactiveClass}`}
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                href="/dashboard"
                className={`${navLinkClass} ${pathname === "/dashboard" ? activeClass : inactiveClass}`}
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/messages"
                className={`relative ${navLinkClass} ${pathname === "/dashboard/messages" ? activeClass : inactiveClass}`}
              >
                Messages
                {MESSAGES_BADGE_COUNT > 0 && (
                  <span
                    className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
                    aria-label={`${MESSAGES_BADGE_COUNT} unread`}
                  >
                    {MESSAGES_BADGE_COUNT}
                  </span>
                )}
              </Link>
              <Link
                href="/billing/plans"
                className={`${navLinkClass} ${pathname?.startsWith("/billing") ? activeClass : inactiveClass}`}
              >
                Pricing
              </Link>
              <Link
                href="/profile"
                className={`${navLinkClass} ${pathname === "/profile" ? activeClass : inactiveClass}`}
              >
                Profile
              </Link>
            </>
          )}
          {!user && (
            <Link
              href="/billing/plans"
              className={`${navLinkClass} ${inactiveClass}`}
            >
              Pricing
            </Link>
          )}
        </div>

        {/* Right: user pill + logout icon */}
        <div className="flex shrink-0 items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden items-center gap-2 rounded-full bg-gray-100 px-4 py-2 md:flex hover:bg-gray-200 transition"
              >
                <User size={18} className="shrink-0 text-gray-500" />
                <span className="text-sm font-medium text-gray-800 max-w-[180px] truncate">
                  {user.email}
                </span>
              </Link>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Log out"
              >
                <LogOut size={20} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex flex-row items-center justify-center gap-2 text-[#0149E1] hover:opacity-80"
                style={{
                  minWidth: 120,
                  height: 48,
                  borderRadius: 48,
                  border: "0.5px solid #0149E1",
                  paddingTop: 16,
                  paddingRight: 40,
                  paddingBottom: 16,
                  paddingLeft: 40,
                  gap: 8,
                  fontFamily: "Helvetica, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex flex-row items-center justify-center gap-2 text-white hover:opacity-90"
                style={{
                  minWidth: 135,
                  height: 48,
                  borderRadius: 48,
                  paddingTop: 12,
                  paddingRight: 40,
                  paddingBottom: 12,
                  paddingLeft: 40,
                  gap: 8,
                  backgroundColor: "#0149E1",
                  fontFamily: "Helvetica, sans-serif",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: 0,
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden rounded p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-50 md:hidden">
          <div className="mx-2 mt-2 rounded-xl border border-gray-200 bg-white shadow-xl">
            <div className="flex flex-col divide-y divide-gray-100 py-2 text-sm font-medium">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-gray-800 hover:bg-gray-50"
              >
                Home
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-800 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/messages"
                    onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 text-gray-800 hover:bg-gray-50"
                  >
                    Messages
                    {MESSAGES_BADGE_COUNT > 0 && (
                      <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">
                        {MESSAGES_BADGE_COUNT}
                      </span>
                    )}
                  </Link>
                </>
              )}
              <Link
                href="/billing/plans"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-gray-800 hover:bg-gray-50"
              >
                Pricing
              </Link>
              {user && (
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-gray-800 hover:bg-gray-50"
                >
                  Profile
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogoutClick}
                  className="text-left px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex flex-row items-center justify-center gap-2 text-gray-800 hover:bg-gray-50"
                    style={{
                      minWidth: 120,
                      height: 48,
                      borderRadius: 48,
                      border: "0.5px solid #e5e7eb",
                      paddingTop: 16,
                      paddingRight: 40,
                      paddingBottom: 16,
                      paddingLeft: 40,
                      gap: 8,
                      fontFamily: "Helvetica, sans-serif",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: 0,
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setMobileOpen(false)}
                    className="mx-3 inline-flex flex-row items-center justify-center gap-2 text-white hover:opacity-90"
                    style={{
                      minWidth: 135,
                      height: 48,
                      borderRadius: 48,
                      paddingTop: 12,
                      paddingRight: 40,
                      paddingBottom: 12,
                      paddingLeft: 40,
                      gap: 8,
                      backgroundColor: "#0149E1",
                      fontFamily: "Helvetica, sans-serif",
                      fontWeight: 400,
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: 0,
                    }}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LogoutModal
        open={logoutModalOpen}
        onClose={() => !logoutLoading && setLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        loading={logoutLoading}
      />
    </header>
  );
}
