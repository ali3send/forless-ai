"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  FormEvent,
  KeyboardEvent,
  ClipboardEvent,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { uiToast } from "@/lib/utils/uiToast";
import { Footer } from "../../components/Footer";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function CodeVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [supabase] = useState(() => createBrowserSupabaseClient());
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  const focusInput = useCallback((idx: number) => {
    inputRefs.current[idx]?.focus();
  }, []);

  const updateDigit = useCallback((idx: number, value: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  const handleChange = (idx: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    updateDigit(idx, char);
    if (char && idx < CODE_LENGTH - 1) {
      focusInput(idx + 1);
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[idx] && idx > 0) {
        updateDigit(idx - 1, "");
        focusInput(idx - 1);
      } else {
        updateDigit(idx, "");
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      focusInput(idx - 1);
    } else if (e.key === "ArrowRight" && idx < CODE_LENGTH - 1) {
      focusInput(idx + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < CODE_LENGTH; i++) {
        next[i] = pasted[i] ?? "";
      }
      return next;
    });

    const focusIdx = Math.min(pasted.length, CODE_LENGTH - 1);
    focusInput(focusIdx);
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== CODE_LENGTH) {
      uiToast.error("Please enter the full verification code.");
      return;
    }
    if (!email) {
      uiToast.error("Email is missing. Please go back and try again.");
      return;
    }

    setLoading(true);
    const t = uiToast.loading("Verifying code...");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "recovery",
      });

      uiToast.dismiss(t);

      if (error) {
        uiToast.error(error.message || "Invalid or expired code.");
        setLoading(false);
        return;
      }

      uiToast.success("Code verified!");
      router.push("/reset-password/update");
    } catch {
      uiToast.dismiss(t);
      uiToast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || !email) return;

    const t = uiToast.loading("Resending code...");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/reset-password/update`
            : undefined,
      });

      uiToast.dismiss(t);

      if (error) {
        uiToast.error(error.message || "Failed to resend code.");
        return;
      }

      uiToast.success("A new code has been sent to your email.");
      setCountdown(RESEND_COOLDOWN);
      setDigits(Array(CODE_LENGTH).fill(""));
      focusInput(0);
    } catch {
      uiToast.dismiss(t);
      uiToast.error("Something went wrong. Please try again.");
    }
  };

  const maskedEmail = email || "your email";

  return (
    <div className="auth-page-light min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12">
      <div
        className="flex flex-col items-center rounded-2xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
        style={{
          width: "100%",
          maxWidth: "768px",
          height: "580px",
          gap: "32px",
          padding: "64px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          className="text-center"
          style={{ gap: "8px", display: "flex", flexDirection: "column" }}
        >
          <h1
            className="text-gray-900"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 700,
              fontSize: "32px",
              lineHeight: "36px",
              letterSpacing: "0.4px",
              marginBottom: "24px",
            }}
          >
            Code Verification
          </h1>
          <p
            className="text-gray-500"
            style={{
              fontFamily: "Helvetica, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "-0.31px",
              textAlign: "center",
            }}
          >
            Enter the verification code sent to the email address{" "}
            <span
              className="text-gray-900"
              style={{
                fontFamily: "Helvetica, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.31px",
              }}
            >
              {maskedEmail}
            </span>{" "}
            to complete reset your password .
          </p>
        </div>

        {/* OTP Inputs */}
        <form
          onSubmit={handleVerify}
          className="flex flex-col items-center w-full"
          style={{ gap: "32px" }}
        >
          <div className="flex items-center justify-center gap-3">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="text-center text-xl font-semibold text-gray-900 outline-none transition-all focus:border-[#0149E1] focus:ring-2 focus:ring-[#0149E1]/20"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "#F9FAFB",
                }}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
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
            {loading ? "Verifying..." : "Verification"}
          </button>
        </form>

        {/* Resend */}
        <p
          className="text-center text-gray-500"
          style={{
            fontFamily: "Helvetica, sans-serif",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "-0.31px",
          }}
        >
          {countdown > 0 ? (
            <>
              Resend will be available in{" "}
              <span className="text-gray-900" style={{ fontWeight: 700 }}>
                {countdown} seconds
              </span>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#0149E1] hover:text-[#0149E1]/80 underline underline-offset-2"
            >
              Resend code
            </button>
          )}
        </p>
      </div>

      <Footer />
    </div>
  );
}
