"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getOrCreateGuestId } from "@/lib/guest/guest";

export default function CreateProjectHero() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!name.trim()) {
      setError("Please enter a website name");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const guestId = getOrCreateGuestId();

      const res = await fetch("/api/projects/guest-create-and-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-guest-id": guestId,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || name.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json?.success) {
        throw new Error(json?.error || "Failed to create website");
      }

      const projectId = json.projectId as string;

      // Go straight to builder
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
    <div className="mx-auto max-w-xl rounded-xl border border-secondary-fade bg-secondary-soft p-6">
      <h1 className="text-xl font-semibold">Create your website</h1>
      <p className="mt-1 text-sm text-secondary">
        Start building instantly — no account required.
      </p>

      {/* Website name */}
      <div className="mt-4">
        <label className="block text-xs font-medium text-secondary-dark">
          Website name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My Startup"
          className="mt-1 w-full rounded-md border border-secondary-fade bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {/* Description */}
      <div className="mt-3">
        <label className="block text-xs font-medium text-secondary-dark">
          Short description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this website about?"
          rows={3}
          className="mt-1 w-full resize-none rounded-md border border-secondary-fade bg-white px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={loading}
        className="mt-5 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create Website"}
      </button>
    </div>
  );
}
