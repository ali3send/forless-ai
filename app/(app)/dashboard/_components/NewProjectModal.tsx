// components/dashboard/NewProjectButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiCreateAndGenerateProject,
  apiCreateProject,
} from "@/lib/api/project";
import { toast } from "sonner";

export default function NewProjectModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectIdea, setProjectIdea] = useState("");
  const [projectName, setProjectName] = useState("");

  //for create and generate direct from dashboard
  async function handleCreateAndGenerate() {
    if (loading) return;

    const trimmedName = projectName.trim();
    const trimmedIdea = projectIdea.trim();

    if (!trimmedName) {
      toast.error("Please enter a project name.");
      return;
    }

    try {
      setLoading(true);

      const result = await apiCreateAndGenerateProject({
        name: trimmedName,
        idea: trimmedIdea || trimmedName,
      });
      toast.success("Project created and website generated!");
      // Close modal
      setModalOpen(false);
      setProjectIdea("");
      setProjectName("");

      // Go straight to builder
      router.push(`/website-builder?projectId=${result.project.id}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to create and generate project"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className="btn-fill"
      >
        {loading ? "Creating..." : "New Project"}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-secondary-dark bg-slate-950 p-4 text-xs text-secondary-text">
            <h2 className="text-sm font-medium">Describe your business idea</h2>
            <p className="mt-1 text-[11px] text-secondary-light">
              Describe your business idea in a few sentences, and let the AI do
              the rest for you.
            </p>

            <label className="mt-3 block text-[11px] text-secondary-soft">
              Business Idea
              <textarea
                className="mt-1 h-24 w-full resize-none rounded-md border border-secondary-active bg-slate-900 px-3 py-2 text-xs outline-none ring-primary/40 focus:ring-1"
                placeholder="Example: I'm starting a small tea shop for young professionals..."
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
              />
            </label>

            <label className="mt-3 block text-[11px] text-secondary-soft">
              Project name
              <input
                className="mt-1 w-full rounded-md border border-secondary-active bg-slate-900 px-3 py-1.5 text-xs outline-none ring-primary/40 focus:ring-1"
                placeholder="Tea Shop Website"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-md border border-secondary-active bg-slate-900 px-3 py-1.5 text-xs text-secondary-fade hover:bg-secondary-dark"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateAndGenerate}
                disabled={loading}
                className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-slate-950 hover:bg-primary-hover disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
