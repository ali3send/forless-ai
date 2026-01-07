import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { UsersTable } from "./UsersContent";
import AdminPageHeader from "../components/AdminPageHeader";

export default async function AdminUsersPage() {
  const admin = await requireAdmin();
  if (!admin.ok) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 text-secondary-dark">
      {/* Header */}
      <AdminPageHeader
        title="Users"
        description="Manage users, roles, and account status."
        backHref="/admin"
      />

      {/* Content */}
      <div className="mt-6">
        <UsersTable />
      </div>
    </div>
  );
}
