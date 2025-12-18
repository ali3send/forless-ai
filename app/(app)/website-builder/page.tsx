import { Suspense } from "react";
import WebsiteBuilderPage from "./_components/WebsiteBuilderPage";

export default function WebsiteBuilder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
          <p className="text-sm text-slate-300">Loading website builder…</p>
        </div>
      }
    >
      <WebsiteBuilderPage />
    </Suspense>
  );
}
