// components/dashboard/NewProjectButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
      const projectId = res.projectId;
      setModalOpen(false);
      setProjectIdea("");
      setProjectName("");

      router.push(`/website-builder/${projectId}`);
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
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0149E1] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0149E1]/90 disabled:opacity-60"
        style={{
          width: 188,
          height: 60,
          paddingTop: 12,
          paddingRight: 36,
          paddingBottom: 12,
          paddingLeft: 28,
        }}
      >
        <Plus className="h-5 w-5 shrink-0" strokeWidth={2.5} />
        {loading ? "Creating..." : "New Project"}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/55 p-4">
          <div
            className="flex flex-col bg-white text-sm shadow-xl"
            style={{
              width: 896,
              borderRadius: 32,
              padding: 32,
              rowGap: 32,
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  className="text-gray-900"
                  style={{
                    fontFamily: "Helvetica, sans-serif",
                    fontWeight: 700,
                    fontSize: "24px",
                    lineHeight: "32px",
                    letterSpacing: "0px",
                  }}
                >
                  Describe your idea
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Forless generates. Publish in second.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div>
                <TextField
                  as="textarea"
                  value={projectIdea}
                  onChange={setProjectIdea}
                  limit="projectIdea"
                  placeholder="I'm starting an online clothing store..."
                  className="h-32 w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800"
                />
              </div>

              <div>
                <TextField
                  label="Project Name"
                  placeholder="John Doe"
                  value={projectName}
                  onChange={setProjectName}
                  limit="projectName"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800"
                />
                <p className="mt-1 text-xs text-gray-400 text-left">
                  Give your project a name (You can change it anytime)
                </p>
              </div>

              <div className="rounded-2xl bg-[#E5F1FF] px-4 py-3 text-xs text-gray-700">
                <span className="font-semibold text-[#112E6D]">Tip: </span>
                <span>
                  Keep it short – we&apos;ll generate the website, branding, and
                  content for you.
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCreateProject}
                disabled={loading}
                className="flex flex-1 items-center justify-center bg-[#0149E1] text-sm font-semibold text-white shadow-sm transition hover:bg-[#0149E1]/90 disabled:opacity-60"
                style={{
                  height: 44,
                  maxWidth: 677,
                  borderRadius: 40,
                  paddingTop: 8,
                  paddingRight: 24,
                  paddingBottom: 8,
                  paddingLeft: 24,
                  gap: 8,
                }}
              >
                <Plus className="h-5 w-5 shrink-0" strokeWidth={2.2} />
                {loading ? "Generating..." : "Generate Website"}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={loading}
                className="inline-flex items-center justify-center bg-gray-100 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-200 disabled:opacity-60"
                style={{
                  width: 143,
                  height: 44,
                  borderRadius: 48,
                  padding: 12,
                  gap: 8,
                }}
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
