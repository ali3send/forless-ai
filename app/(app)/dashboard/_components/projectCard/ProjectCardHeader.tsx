export function ProjectCardHeader({
  name,
  status,
}: {
  name: string;
  status: string;
}) {
  return (
    <div className="mt-3">
      <div className="truncate text-sm font-semibold text-secondary-dark">
        {name}
      </div>
      <div className="mt-1 text-[11px] text-secondary-dark">
        Status:{" "}
        <span className="capitalize font-medium">
          {status === "unpublished" ? "Unpublished by admin" : status}
        </span>
      </div>
    </div>
  );
}
