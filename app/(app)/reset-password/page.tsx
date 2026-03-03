"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";
import { Footer } from "../components/Footer";

export default function ResetPasswordRequestPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [supabase] = useState(() => createBrowserSupabaseClient());

  const handleResetRequest = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    const t = uiToast.loading("Sending recover code...");

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
        uiToast.error(error.message || "Failed to send recover code.");
        return;
      }

      uiToast.success(
        "Recover code sent. Please check your email to continue.",
      );

      router.push(`/reset-password/verify?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      uiToast.dismiss(t);
      uiToast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-light min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div
        className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8"
        style={{
          width: "100%",
          maxWidth: "576px",
          height: "398px",
          borderRadius: "24px",
          boxSizing: "border-box",
        }}
      >
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
            Forget Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address to send a recover code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetRequest} className="space-y-4">
          <label className="block">
            <span className="form-label mb-1 block">Email</span>
            <input
              type="email"
              required
              placeholder="You@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base w-full outline-none transition-all focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
              style={{
                height: "54px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                paddingTop: "14px",
                paddingRight: "16px",
                paddingBottom: "14px",
                paddingLeft: "16px",
                boxSizing: "border-box",
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0149E1] font-semibold text-white shadow-sm hover:bg-[#0149E1]/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              height: "48px",
              borderRadius: "48px",
              paddingTop: "12px",
              paddingRight: "40px",
              paddingBottom: "12px",
              paddingLeft: "40px",
              gap: "8px",
              fontSize: "14px",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
