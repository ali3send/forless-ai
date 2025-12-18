export type UserRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "user" | "admin" | string | null;
  is_suspended: boolean | null;
  suspended_at: string | null;
  suspended_reason: string | null;

  created_at?: string | null;
  auth_created_at?: string | null;
  last_sign_in_at?: string | null;
};
