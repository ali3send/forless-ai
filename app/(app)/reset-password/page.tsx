"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";
import { TextField } from "../components/ui/TextField";
import { Footer } from "../components/Footer";

export default function ResetPasswordRequestPage() {
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
            Forget Password
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email address to send a recover code.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetRequest} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            required
            placeholder="You@example.com"
            value={email}
            onChange={setEmail}
            limit="email"
            className="w-full py-2.5"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-1 w-full rounded-3xl bg-[#0149E1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0149E1]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
