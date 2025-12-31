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

  async function handleCreateProject() {
    if (loading) return;

    const trimmedName = projectName.trim();
    const trimmedIdea = projectIdea.trim();

    if (!trimmedName) {
      toast.error("Please enter a project name.");
      return;
    }

    try {
      setLoading(true);

      // ✅ CREATE ONLY (no generation)
      const result = await apiCreateProject({
        name: trimmedName,
        description: trimmedIdea || trimmedName,
      });

      toast.success("Project created!");

      // Reset UI
      setModalOpen(false);
      setProjectIdea("");
      setProjectName("");

      // ✅ Redirect to project page
      router.push(`/dashboard/projects/${result.id}`);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "Failed to create project"
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
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
          <div className="w-full max-w-md rounded-2xl border border-secondary-fade bg-secondary-soft p-5 text-xs">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-secondary-dark">
                  Describe your business idea
                </h2>
                <p className="mt-1 text-[12px] leading-5 text-secondary">
                  Describe your business idea in a few sentences, and let the AI
                  do the rest for you.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="rounded-md border border-secondary-fade bg-secondary-light px-2 py-1 text-[11px] text-secondary-dark hover:bg-secondary-hover"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="mt-4 space-y-3">
              <label className="block text-[11px] font-medium text-secondary-dark">
                Business Idea
                <textarea
                  className="
                  mt-1 h-24 w-full resize-none
                  rounded-lg
                  border border-secondary-fade
                  bg-secondary-light
                  px-3 py-2
                  text-[13px] text-secondary-dark
                  placeholder:text-secondary
                  outline-none
                  ring-primary/30
                  focus:border-primary
                  focus:ring-2
                "
                  placeholder="Example: I'm starting a small tea shop for young professionals..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                />
              </label>

              <label className="block text-[11px] font-medium text-secondary-dark">
                Project name
                <input
                  className="
                  mt-1 w-full
                  rounded-lg
                  border border-secondary-fade
                  bg-secondary-light
                  px-3 py-2
                  text-[13px] text-secondary-dark
                  placeholder:text-secondary
                  outline-none
                  ring-primary/30
                  focus:border-primary
                  focus:ring-2
                "
                  placeholder="Tea Shop Website"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="
                px-4 py-2
                text-xs font-semibold
                disabled:opacity-60
                btn-secondary
              "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCreateProject}
                disabled={loading}
                className="
                rounded-lg
                btn-fill
                px-4 py-2
                text-xs font-semibold 
              
                disabled:opacity-60
              "
              >
                {loading ? "Creating..." : "Create Project"}
              </button>
            </div>

            {/* Subtle hint */}
            <p className="mt-3 text-[11px] text-secondary">
              Tip: Keep it short — we’ll generate sections, branding, and
              content from it.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
