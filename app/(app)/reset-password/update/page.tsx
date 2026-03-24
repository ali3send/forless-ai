"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";

export default function ResetPasswordUpdatePage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(
    "Setting a new password for your ForlessAI account."
  );
  const [linkInvalid, setLinkInvalid] = useState(false);

  // Optional: check session exists (user came from valid email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        setLinkInvalid(true);
        setInfo(
          "This reset link is invalid or expired. Please request a new reset email."
        );
        uiToast.error("Reset link invalid or expired.");
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (newPassword.length < 6) {
      uiToast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirm) {
      uiToast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Updating password...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      uiToast.dismiss(t);

      if (error) {
        uiToast.error(error.message || "Failed to update password.");
        return;
      }

      uiToast.success("Password updated. Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      uiToast.dismiss(t);
      uiToast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] rounded-2xl border border-secondary-fade bg-white p-8 shadow-xl shadow-black/8">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
            Forless
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-secondary-darker">
            Set new password
          </h1>
          {info && (
            <p className="mt-2 text-sm text-secondary">{info}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              New password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading || linkInvalid}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Confirm new password
            </label>
            <input
              type="password"
              placeholder="Repeat new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading || linkInvalid}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || linkInvalid}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-active hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "Saving new password..." : "Update password"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-secondary">
          Remember your password?{" "}
          <a
            href="/auth/login"
            className="font-semibold text-primary hover:text-primary-active transition-colors"
          >
            Back to login
          </a>
        </p>
      </div>
    </div>
  );
}
