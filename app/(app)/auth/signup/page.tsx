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
  const inputClasses = "input-base w-full  py-2";

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl  bg-secondary-fade p-6 shadow-xl ">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            ForlessAI
          </p>
          <h1 className="text-2xl text-secondary-dark font-bold tracking-tight mb-1">
            Create your account
          </h1>
          <p className="text-xs text-secondary">
            Sign up with email & password to access your ForlessAI dashboard.
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary-dark">
              Full Name
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClasses}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary-dark">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-dark">
              Password
            </label>

            <div className="relative">
              <input
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-secondary-dark">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type="text"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full px-4 py-2  btn-fill disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-xs text-secondary">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-primary hover:text-primary-hover underline underline-offset-2"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
