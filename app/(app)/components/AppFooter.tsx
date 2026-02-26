"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppFooter() {
  const pathname = usePathname();

  // Hide footer on dashboard; home has its own full footer
  if (pathname.startsWith("/dashboard") || pathname === "/") {
    return null;
  }

  return (
    <footer className="mt-8 border-t border-secondary-fade bg-secondary-soft">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-4 text-xs text-secondary">
        <span>© {new Date().getFullYear()} ForlessAI</span>

        <span className="hidden sm:inline">
          <Link
            href="/privacy"
            className="text-secondary hover:text-secondary-dark underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
        </span>
      </div>
    </footer>
  );
}

