"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";

export default function ResetPasswordRequestPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const t = uiToast.loading("Sending reset link...");

    try {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password/update`
          : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      uiToast.dismiss(t);

      if (error) {
        uiToast.error(error.message || "Failed to send reset link.");
        return;
      }

      uiToast.success("Reset link sent. Please check your email to continue.");

      setEmail("");
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
            Forgot password?
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetRequest} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-active hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "Sending reset link..." : "Send reset link"}
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
