import { Navbar } from "@/app/(app)/components/Navbar";
import { AppFooter } from "@/app/(app)/components/AppFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="mx-auto px-4 py-4 sm:py-4">{children}</div>
      </main>

      <AppFooter />
    </div>
  );
}
