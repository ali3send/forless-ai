"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { apiCreateAndGenerateProject } from "@/lib/api/project";

export default function HeroSection() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    try {
      setLoading(true);
      const res = await apiCreateAndGenerateProject({
        description: description.trim(),
      });
      if (!res.success) throw new Error("Failed to create website");
      router.push(`/website-builder/${res.projectId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="mx-auto flex max-w-[1047px] flex-col text-center"
      style={{ gap: 16 }}
    >
      {/* Headline — Helvetica 72px, 140% line height, 0 letter spacing, center */}
      <h1
        className="text-gray-900"
        style={{
          fontFamily: "Helvetica, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(2.5rem, 8vw, 72px)",
          lineHeight: "140%",
          letterSpacing: "0%",
          textAlign: "center",
        }}
      >
        Your website, live in{" "}
        <span
          style={{ fontWeight: 700, whiteSpace: "nowrap" }}
          className="text-[#7c3aed]"
        >
          60 seconds
        </span>
      </h1>
      <p
        className="text-gray-700"
        style={{
          fontFamily: "Helvetica, sans-serif",
          fontWeight: 400,
          fontSize: "clamp(2.5rem, 8vw, 72px)",
          lineHeight: "140%",
          letterSpacing: "0%",
          textAlign: "center",
        }}
      >
        For less than $1
      </p>

      {/* Descriptive text — same font family, smaller size for hierarchy */}
      <p
        className="text-gray-500"
        style={{
          fontFamily: "Helvetica, sans-serif",
          fontWeight: 400,
          fontSize: "18px",
          lineHeight: "140%",
          letterSpacing: "0%",
          textAlign: "center",
        }}
      >
        Describe it. Generate it. Publish it.
        <br />
        No code. No designers. No delays.
      </p>

      {/* Input field container — 882×214, radius 16px, border 0.5px, centered */}
      <div
        className="relative mx-auto w-full overflow-hidden bg-white"
        style={{
          maxWidth: 882,
          height: 214,
          borderRadius: 16,
          border: "0.5px solid #cbd5e1",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="I'm starting an online clothing store..."
          className="h-full w-full resize-none rounded-[15px] border-0 bg-transparent p-4 pr-[170px] text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-400 focus:ring-0"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="absolute bottom-4 right-4 inline-flex items-center justify-center bg-[#0149E1] text-sm font-normal text-white shadow-sm transition hover:bg-[#0149E1]/90 disabled:opacity-60 sm:bottom-5 sm:right-5"
          style={{
            width: 147,
            height: 44,
            borderRadius: 40,
            paddingTop: 8,
            paddingRight: 24,
            paddingBottom: 8,
            paddingLeft: 24,
            gap: 8,
          }}
        >
          <Sparkles className="h-4 w-4 shrink-0" strokeWidth={2} />
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}

      {/* Info banner — hug width 423px, radius 40px, light blue */}
      <div
        className="mx-auto inline-flex max-w-[423px] items-center justify-center gap-2 text-center text-sm text-gray-700"
        style={{
          minHeight: 42,
          borderRadius: 40,
          border: "1px solid rgba(1, 73, 225, 0.35)",
          paddingTop: 8,
          paddingRight: 32,
          paddingBottom: 8,
          paddingLeft: 32,
          gap: 8,
          background: "#E5F1FF",
        }}
      >
        Version 1 · New features every week · No extra cost
      </div>
    </div>
  );
}
