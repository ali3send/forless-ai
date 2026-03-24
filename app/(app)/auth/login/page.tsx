"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";

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
    setLoading(true);

    try {
      await login(email, password);

      await fetch("/api/claim-guest-project", {
        method: "POST",
        headers: {
          "x-guest-id": localStorage.getItem("guest_id") || "",
        },
        credentials: "include", // 🔥 REQUIRED
      });

      // clean up
      localStorage.removeItem("guest_id");

      router.replace("/dashboard");
    } catch (e) {
      setErrorMsg(getErrorMessage(e, "Failed to log in"));
      uiToast.error(getErrorMessage(e, "Failed to log in"));
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
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Log in to continue building and managing your website.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="shrink-0"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-secondary-dark">
                Password
              </label>
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="text-xs font-medium text-primary hover:text-primary-active transition-colors"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-secondary-fade bg-secondary-fade/30 px-3.5 py-2.5 pr-10 text-sm text-secondary-darker placeholder:text-secondary-light outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-secondary-light hover:text-secondary-dark transition-colors"
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
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-active hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-sm text-secondary">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="font-semibold text-primary hover:text-primary-active transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
