"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

export default function SignupPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password !== confirmPassword) {
      uiToast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Creating your account…");

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      uiToast.dismiss(t);
      uiToast.success("Account created! Please check your email to verify.");
    } catch (err: unknown) {
      uiToast.dismiss(t);
      uiToast.error(getErrorMessage(err, "Failed to create account"));
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
            Create your account
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Sign up to start building your website.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Email
            </label>
            <input
              type="email"
              placeholder="You@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Password
            </label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-secondary-dark">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-active hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-secondary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="font-semibold text-primary hover:text-primary-active transition-colors"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
