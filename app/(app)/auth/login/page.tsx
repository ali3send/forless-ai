"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Eye, EyeOff } from "lucide-react";
import { getErrorMessage } from "@/lib/utils/getErrorMessage";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../../components/ui/TextField";
import { Footer } from "../../components/Footer";

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
        credentials: "include",
      });

      localStorage.removeItem("guest_id");
      router.replace("/dashboard");
    } catch (e) {
      setErrorMsg(getErrorMessage(e, "Failed to log in"));
      uiToast.error(getErrorMessage(e, "Failed to log in"));
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
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Log in to continue building and managing your website.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            placeholder="You@example.com"
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

            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/reset-password")}
                className="text-xs text-[#0149E1] hover:text-[#0149E1]/80 underline underline-offset-2"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-3xl bg-[#0149E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0149E1]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign up */}
        <p className="mt-5 text-sm text-gray-600 text-center">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/signup")}
            className="text-[#0149E1] hover:text-[#0149E1]/90 font-medium underline underline-offset-2"
          >
            Sign up
          </button>
        </p>
      </div>

      <Footer />
    </div>
  );
}
