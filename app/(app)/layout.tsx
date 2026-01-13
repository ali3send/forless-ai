import { Navbar } from "@/app/(app)/components/Navbar";
import Link from "next/link";
// import { Link } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto px-4 py-8 sm:py-10">{children}</div>
      </main>

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
    </div>
  );
}
