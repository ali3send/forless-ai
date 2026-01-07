export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-dark">
          User Dashboard
        </h1>
        <p className="mt-1 text-sm text-secondary"></p>
      </div>
    </header>
  );
}
