import { Suspense } from "react";
import WebsiteBuilderPage from "./_components/WebsiteBuilderPage";

export default function WebsiteBuilder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-secondary-text flex items-center justify-center">
          <p className="text-sm text-secondary-soft">
            Loading website builder…
          </p>
        </div>
      }
    >
      <WebsiteBuilderPage />
    </Suspense>
  );
}
