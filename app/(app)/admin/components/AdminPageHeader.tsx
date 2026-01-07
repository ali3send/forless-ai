interface AdminPageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
}

export default function AdminPageHeader({
  title,
  description,
  backHref,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-dark">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        )}
      </div>

      {backHref && (
        <a
          href={backHref}
          className="
            rounded-md
            border border-secondary-fade
            bg-secondary-soft
            px-3 py-1.5
            text-sm font-semibold
            text-secondary-dark
            transition
            hover:border-primary
            hover:text-primary
          "
        >
          ← Back
        </a>
      )}
    </div>
  );
}
