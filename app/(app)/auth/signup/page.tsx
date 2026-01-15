"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";

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

      await supabase.from("activity_logs").insert({
        type: "new_user_created",
        message: "New user Signed up",
        entity_type: "user",
      });

      uiToast.dismiss(t);
      uiToast.success("Account created! Please check your email to verify.");
    } catch (err: unknown) {
      uiToast.dismiss(t);
      uiToast.error(getErrorMessage(err, "Failed to create account"));
    } finally {
      setLoading(false);
    }
  };
  const inputClasses = "py-2";

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
          <TextField
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={setFullName}
            limit="fullName"
            className={inputClasses}
          />

          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            limit="email"
            className={inputClasses}
          />

          <TextField
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={setPassword}
            limit="password"
            className={inputClasses}
          />

          <TextField
            label="Confirm Password"
            type="password"
            placeholder="Minimum 6 characters"
            value={confirmPassword}
            onChange={setConfirmPassword}
            limit="password"
            className={inputClasses}
          />

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
