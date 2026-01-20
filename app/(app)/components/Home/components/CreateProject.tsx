// app/(app)/components/Home/components/CreateProject.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { apiCreateAndGenerateProject } from "@/lib/api/project";

export default function CreateProjectHero() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);

    try {
      setLoading(true);

      const res = await apiCreateAndGenerateProject({
        description: description.trim(),
      });

      if (!res.success) {
        throw new Error("Failed to create website");
      }

      const projectId = res.projectId;

      router.push(`/website-builder/${projectId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-secondary-fade bg-linear-to-b from-secondary-soft to-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-secondary-dark">
        Describe your idea
      </h1>
      <p className="mt-1 text-sm text-secondary">
        Tell us what you want to build. We’ll handle the rest.
      </p>

      {/* Idea / Description */}
      <div className="mt-5">
        <label className="mb-2 block text-xs font-medium text-secondary-dark">
          Website idea
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: A modern landing page for a fitness coach offering online programs and 1-on-1 coaching."
          rows={5}
          className="
          w-full resize-none
          rounded-xl
          border border-secondary-fade
          bg-white
          px-4 py-3
          text-sm
          leading-relaxed
          outline-none
          transition
          placeholder:text-secondary
          focus:border-primary
          focus:ring-2
          focus:ring-primary/20
        "
        />

        <p className="mt-2 text-[11px] text-secondary">
          Be as short or detailed as you like.
        </p>
      </div>

      {error && (
        <p className="mt-3 text-xs font-medium text-red-600">{error}</p>
      )}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="
        mt-6 w-full
btn-fill
        px-4 py-3
    
        transition
       
        disabled:opacity-60
      "
      >
        {loading ? "Creating your website…" : "Generate Website"}
      </button>
    </div>
  );
}
