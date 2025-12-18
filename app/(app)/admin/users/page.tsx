import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { UsersTable } from "../_components/UsersTable";
// import { UsersTable } from "./_components/UsersTable";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/dashboard");

  // We fetch via API so it merges auth.users emails + profiles fields.
  // (You could also fetch server-side directly, but this keeps it consistent.)
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 text-text">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="mt-1 text-sm text-text-muted">
            View emails (auth.users), manage roles, and suspend accounts.
          </p>
        </div>

        <a
          href="/admin"
          className="rounded-md border border-slate-700 bg-bg-card px-3 py-1.5 text-sm text-text-muted hover:text-text transition"
        >
          ← Back
        </a>
      </div>

      <div className="mt-6 rounded-xl border border-slate-700 bg-bg-card p-4">
        <UsersTable />
      </div>
    </div>
  );
}
