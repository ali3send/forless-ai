function QuickAdminActions() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-(--color-secondary-darker)">
        Quick actions
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Users", href: "/admin/users" },
          { label: "Projects", href: "/admin/projects" },
          { label: "Sites", href: "/admin/sites" },
          { label: "Campaigns", href: "/admin/campaigns" },
        ].map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="rounded-lg border border-secondary-fade bg-white p-4 text-sm font-medium text-(--color-secondary-darker) hover:border-primary"
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default QuickAdminActions;
