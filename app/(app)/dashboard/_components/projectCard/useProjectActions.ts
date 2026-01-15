"use client";

import { useRouter } from "next/navigation";
import { uiToast } from "@/lib/utils/uiToast";

export function useProjectActions(project: { id: string; name: string }) {
  const router = useRouter();

  const softDelete = async () => {
    uiToast.confirm({
      title: `Delete "${project.name}"?`,
      destructive: true,
      confirmLabel: "Delete",
      onConfirm: async () => {
        const t = uiToast.loading("Deleting project...");
        try {
          const res = await fetch(`/api/projects/${project.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error();
          uiToast.success("Project deleted.");
          router.refresh();
        } catch {
          uiToast.error("Failed to delete project.");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  };

  const restore = async () => {
    const t = uiToast.loading("Restoring project...");
    try {
      const res = await fetch(`/api/projects/${project.id}/restore`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        uiToast.error(json?.error || "Restore failed");
        return;
      }
      uiToast.success("Project restored to draft.");
      router.refresh();
    } finally {
      uiToast.dismiss(t);
    }
  };

  const permanentDelete = async () => {
    uiToast.confirm({
      title: `Permanently delete "${project.name}"?`,
      destructive: true,
      confirmLabel: "Delete permanently",
      onConfirm: async () => {
        const t = uiToast.loading("Deleting permanently...");
        try {
          const res = await fetch(
            `/api/projects/${project.id}/permanent-delete`,
            { method: "DELETE" }
          );
          if (!res.ok) throw new Error();
          uiToast.success("Project permanently deleted.");
          router.refresh();
        } catch {
          uiToast.error("Permanent delete failed.");
        } finally {
          uiToast.dismiss(t);
        }
      },
    });
  };

  return { softDelete, restore, permanentDelete };
}
