// app/(app)/components/Home/components/CreateProject.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

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

      const websiteId = res.websiteId;

      router.push(`/website-builder/${websiteId}`);
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
    <div>
      <div className="relative rounded-2xl border border-secondary-fade bg-white p-1 shadow-xl shadow-black/5">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="I'm starting an online clothing store . . ."
          rows={4}
          className="w-full resize-none rounded-xl border-none bg-transparent px-5 py-4 text-sm leading-relaxed text-secondary-darker outline-none placeholder:text-secondary-light"
        />

        <div className="flex items-center justify-end px-3 pb-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-active hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-xs font-medium text-red-600">
          {error}
        </p>
      )}

      {/* Version badge */}
      <div className="mt-4 flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-secondary-fade bg-white px-4 py-2 text-xs text-secondary">
          Version 1 . New features every week No extra cost
        </span>
      </div>
    </div>
  );
}
