function SystemHealth() {
  return (
    <div className="rounded-xl border border-secondary-fade bg-white p-6">
      <h3 className="text-sm font-semibold text-(--color-secondary-darker)">
        System health
      </h3>

      <ul className="mt-4 space-y-2 text-sm">
        <li className="flex justify-between">
          <span>API status</span>
          <span className="text-primary">Operational</span>
        </li>
        <li className="flex justify-between">
          <span>Auth</span>
          <span className="text-primary">Operational</span>
        </li>
        <li className="flex justify-between">
          <span>Storage</span>
          <span className="text-primary">Operational</span>
        </li>
      </ul>
    </div>
  );
}

export default SystemHealth;
