"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      await login(email, password); // 🔑 provider login
      window.location.href = "/dashboard"; // hard navigation
    } catch (e: unknown) {
      setErrorMsg(getErrorMessage(e, "Failed to log in"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-secondary-fade bg-secondary-fade p-6 shadow-sm">
        {/* Header */}
        <div className="mb-5 text-secondary-active">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-2">
            ForlessAI
          </p>
          <h1 className="text-2xl font-bold tracking-tight mb-1 ">
            Welcome back
          </h1>
          <p className="text-xs text-secondary">
            Log in to continue building and managing your AI-generated websites.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-secondary-active mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base w-full py-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-secondary-active">
                Password
              </label>
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="text-[11px] text-primary hover:text-primary-hover underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-base w-full pr-10 py-2"
                placeholder="Your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 flex items-center text-secondary hover:text-secondary-dark transition"
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

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full px-4 py-2  btn-fill disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-4 text-xs text-secondary">
          Dont have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-primary hover:text-primary-hover underline underline-offset-2"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
