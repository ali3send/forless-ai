// app/website-builder/page.tsx
import { Suspense } from "react";
import WebsiteBuilderPage from "./_components/WebsiteBuilderPage";

export default function WebsiteBuilder() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-secondary-soft flex items-center justify-center">
          <p className="text-sm text-secondary">Loading website builder…</p>
        </div>
      }
    >
      <WebsiteBuilderPage />
    </Suspense>
  );
}
