interface AdminDashboardHeaderProps {
  email: string;
  role: string;
}

export default function AdminDashboardHeader({
  email,
  role,
}: AdminDashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-secondary-dark">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-secondary">
          Logged in as{" "}
          <span className="font-medium text-secondary-dark">{email}</span>
          <span className="mx-2 opacity-40">•</span>
          Role <span className="font-medium text-primary">{role}</span>
        </p>
      </div>
    </header>
  );
}
