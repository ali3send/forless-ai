export default function EmptyInbox() {
  return (
    <div className="rounded-2xl border border-secondary-fade bg-secondary-soft p-10 text-center">
      <p className="text-sm font-medium text-secondary-dark">No messages yet</p>
      <p className="mt-1 text-xs text-secondary">
        Messages sent from your contact forms will appear here.
      </p>
    </div>
  );
}
