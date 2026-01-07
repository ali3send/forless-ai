import ModerationRow from "./ModerationRow";

function ModerationSummary({
  suspendedUsers,
  unpublishedSites,
}: {
  suspendedUsers: number;
  unpublishedSites: number;
}) {
  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-(--color-secondary-darker)">
        Moderation summary
      </h3>

      <p className="mt-1 text-xs text-(--color-secondary">
        Accounts and content requiring attention
      </p>

      <div className="mt-5 space-y-4">
        <ModerationRow
          label="Suspended users"
          value={suspendedUsers}
          href="/admin/users?status=suspended"
          danger={suspendedUsers > 0}
        />

        <ModerationRow
          label="Unpublished sites"
          value={unpublishedSites}
          href="/admin/sites"
        />

        {/* future-ready */}
        <ModerationRow label="Reported content" value="—" muted />
      </div>
    </div>
  );
}

export default ModerationSummary;
