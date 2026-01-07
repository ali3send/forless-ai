function ActivityFeed() {
  const items = [
    "New user registered",
    "Website published",
    "User suspended",
    "Project deleted",
  ];

  return (
    <div className="rounded-xl border order-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-(--color-secondary-darker)">
        Recent activity
      </h3>

      <ul className="mt-4 space-y-3 text-sm text-secondary">
        {items.map((i, idx) => (
          <li key={idx}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityFeed;
