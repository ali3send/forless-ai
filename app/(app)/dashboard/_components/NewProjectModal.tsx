// components/dashboard/NewProjectButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCreateAndGenerateProject } from "@/lib/api/project";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";

export default function NewProjectModal() {
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
      <button
        onClick={() => setModalOpen(true)}
        disabled={loading}
        className="btn-fill"
      >
        {loading ? "Creating..." : "New Project"}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4">
          <div className="w-full max-w-md rounded-2xl  bg-secondary-fade p-5 text-xs">
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
                className="rounded-md  bg-secondary-light px-2 py-1 text-[11px] text-secondary-dark hover:bg-secondary"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="mt-4 space-y-3">
              <TextField
                as="textarea"
                label="Business Idea"
                placeholder="Example: I'm starting a small tea shop for young professionals..."
                value={projectIdea}
                onChange={setProjectIdea}
                limit="projectIdea"
                showLimit
                className="
                    h-24 resize-none
                      px-3 py-2
                      text-[13px]
                    "
              />

              <TextField
                label="Project name"
                placeholder="Tea Shop Website"
                value={projectName}
                onChange={setProjectName}
                limit="projectName"
                className="                   
                  px-3 py-2
                  text-[13px]
                    "
              />
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
