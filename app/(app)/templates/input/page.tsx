"use client";

import { useRouter } from "next/navigation";
import { AddTemplateForm } from "@/app/(app)/website-builder/_components/AddTemplateForm";
import Link from "next/link";

export default function TemplateInputPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl py-8 px-4">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          ← Back
        </button>
        <span className="text-secondary">·</span>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-secondary hover:text-primary"
        >
          Dashboard
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-secondary-dark">
          Add template
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Enter HTML and CSS for a template. Saving to the database will be
          added later.
        </p>
      </div>

      <AddTemplateForm />
    </div>
  );
}
