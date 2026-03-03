"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";
import { Footer } from "../../components/Footer";

export default function ResetPasswordUpdatePage() {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        uiToast.error("Reset link invalid or expired.");
      }
    };

    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (newPassword.length < 6) {
      uiToast.error("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirm) {
      uiToast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Updating password...");

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      uiToast.dismiss(t);

      if (error) {
        uiToast.error(error.message || "Failed to update password.");
        return;
      }

      uiToast.success("Password updated. Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (err) {
      console.error(err);
      uiToast.dismiss(t);
      uiToast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "54px",
    borderRadius: "10px",
    border: "1px solid #E5E7EB",
    paddingTop: "14px",
    paddingRight: "44px",
    paddingBottom: "14px",
    paddingLeft: "16px",
    boxSizing: "border-box",
    backgroundColor: "#F9FAFB",
  };

  return (
    <div className="auth-page-light min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div
        className="bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 sm:p-8"
        style={{
          width: "100%",
          maxWidth: "576px",
          height: "504px",
          borderRadius: "24px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
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
            New Password
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
            You can reset your password easily
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <span className="form-label mb-1 block text-xs font-medium text-gray-700">
              New Password
            </span>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Your password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="input-base w-full outline-none transition-all focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20 disabled:opacity-60"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <span className="form-label mb-1 block text-xs font-medium text-gray-700">
              Confirm Password
            </span>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={loading}
                className="input-base w-full outline-none transition-all focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20 disabled:opacity-60"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

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
            {loading ? "Saving..." : "Confirm Password"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
