"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";
import { Footer } from "../../components/Footer";

export default function SignupPage() {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="auth-page-light min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="mb-6">
          <span className="inline-block rounded-full bg-[#E1F0FF] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0149E1] mb-4">
            Forless
          </span>
          <h1
            className="text-gray-900 mb-1"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "36px",
              letterSpacing: "0.4px",
            }}
          >
            Create your account
          </h1>
          <p
            className="text-gray-500"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0px",
            }}
          >
            Sign up and start building your website in seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          <TextField
            label="Full Name"
            placeholder="Ali Mohamed Ahmed"
            value={fullName}
            onChange={setFullName}
            limit="fullName"
            className="w-full py-2.5"
          />

          <TextField
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            limit="email"
            className="w-full py-2.5"
          />

          <div>
            <div className="mb-1.5">
              <span className="text-xs font-medium text-gray-700">
                Password
              </span>
            </div>
            <div className="relative">
              <TextField
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={setPassword}
                limit="password"
                className="w-full pr-10 py-2.5"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1.5">
              <span className="text-xs font-medium text-gray-700">
                Confirm Password
              </span>
            </div>
            <div className="relative">
              <TextField
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                limit="password"
                className="w-full pr-10 py-2.5"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-3xl bg-[#0149E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0149E1]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-[#0149E1] hover:text-[#0149E1]/90 font-medium underline underline-offset-2"
          >
            Log in
          </button>
        </p>
      </div>

      <Footer />
    </div>
  );
}
