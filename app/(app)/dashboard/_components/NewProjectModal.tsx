// components/dashboard/NewProjectButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCreateAndGenerateProject } from "@/lib/api/project";
import { Sparkles } from "lucide-react";
import { uiToast } from "@/lib/utils/uiToast";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export default function NewProjectModal({ trigger }: { trigger?: React.ReactNode } = {}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [projectIdea, setProjectIdea] = useState("");
  const [projectName, setProjectName] = useState("");

  //for create and generate direct from dashboard
  async function handleCreateProject() {
    if (loading) return;

    // setError(null);

    const name = projectName;
    const description = projectIdea;

    if (!name) {
      uiToast.error("Please enter a name");
      return;
    }
    if (!description) {
      uiToast.error("Please enter a description");
      return;
    }

    try {
      setLoading(true);
      const res = await apiCreateAndGenerateProject({
        name: name.trim(),
        description: description.trim() || name.trim(),
      });

      if (!res.success) {
        throw new Error("Failed to create website");
      }
      uiToast.success("Project created!");
      const websiteId = res.websiteId;
      setModalOpen(false);
      setProjectIdea("");
      setProjectName("");

      router.push(`/website-builder/${websiteId}`);
    } catch (err) {
      uiToast.error(getErrorMessage(err, "Failed to create project"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setModalOpen(true)} className="cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          onClick={() => setModalOpen(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:bg-primary-active hover:shadow-lg disabled:opacity-60"
        >
          <span className="text-lg leading-none">+</span>
          {loading ? "Creating..." : "New Project"}
        </button>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-secondary-darker">
                  Describe your idea
                </h2>
                <p className="mt-1 text-sm text-secondary">
                  Forless generates. Publish in second
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="text-xl text-secondary hover:text-secondary-darker transition"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Idea textarea */}
            <div className="mt-5">
              <textarea
                placeholder="I’m starting an online clothing store..."
                value={projectIdea}
                onChange={(e) => setProjectIdea(e.target.value)}
                rows={5}
                className="w-full resize-none rounded-xl border border-secondary-fade bg-white px-4 py-3 text-sm text-secondary-darker placeholder:text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Project name */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-secondary-darker">
                Project Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-secondary-fade bg-white px-4 py-2.5 text-sm text-secondary-darker placeholder:text-secondary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="mt-1.5 text-xs text-secondary">
                Give your project a name (You can change it anytime)
              </p>
            </div>

            {/* Tip */}
            <div className="mt-4 rounded-xl bg-primary/5 px-4 py-3">
              <p className="text-sm text-secondary-dark">
                <span className="font-semibold text-primary">Tip:</span> Keep it
                short - We&apos;ll generate the website, branding, and content for
                you
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleCreateProject}
                disabled={loading || !projectIdea.trim() || !projectName.trim()}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-active disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles size={16} />
                {loading ? "Generating..." : "Generate Website"}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="rounded-full border border-secondary-fade px-6 py-3 text-sm font-semibold text-secondary-darker transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
