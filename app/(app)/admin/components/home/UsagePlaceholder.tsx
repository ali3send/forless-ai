function UsagePlaceholder() {
  return (
    <div className="lg:col-span-2 rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-(--color-secondary-darker)">
        Platform usage (last 30 days)
      </h3>

      <div className="mt-4 h-48 rounded-md bg-secondary-fade/40 flex items-center justify-center text-sm text-secondary">
        Usage chart coming soon
      </div>
    </div>
  );
}

export default UsagePlaceholder;
