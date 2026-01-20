"use client";

export function ProjectCardDeleted({
  canRestore,
  onRestore,
  onPermanentDelete,
}: {
  canRestore: boolean;
  onRestore: () => void;
  onPermanentDelete: () => void;
}) {
  return (
    <div className="mt-3 rounded-md  bg-secondary-soft p-3 text-center">
      <div className="text-xs font-semibold text-secondary-dark">
        Project deleted
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {canRestore ? (
          <button onClick={onRestore} className="btn-fill px-3 py-1 text-xs">
            Restore
          </button>
        ) : (
          <span className="text-[11px] text-secondary">
            Restricted by admin
          </span>
        )}

        <button
          onClick={onPermanentDelete}
          className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-500/20"
        >
          Delete permanently
        </button>
      </div>
    </div>
  );
}
