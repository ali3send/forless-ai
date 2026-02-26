import Link from "next/link";
import { Sparkles } from "lucide-react";

export function ReadyToCreateSection() {
  return (
    <section
      className="relative flex w-full min-w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center sm:px-10"
      style={{
        minHeight: 284,
        minWidth: "100%",
        width: "100%",
        background: "linear-gradient(180deg, #4A87FF 0%, #0149E1 100%)",
      }}
    >
      <h2
        className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
        style={{ fontFamily: "Helvetica, sans-serif", lineHeight: 1.25 }}
      >
        Ready to create your website?
      </h2>
      <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link
          href="/auth/signup"
          className="inline-flex items-center justify-center gap-2 bg-white text-xs font-normal text-[#0149E1] transition hover:bg-gray-50"
          style={{
            width: 205,
            height: 48,
            borderRadius: 48,
            paddingTop: 12,
            paddingRight: 40,
            paddingBottom: 12,
            paddingLeft: 40,
            gap: 8,
            border: "2px solid #0149E1",
          }}
        >
          <Sparkles className="h-4 w-4 shrink-0" />
          Generate website
        </Link>
        <Link
          href="/#templates"
          className="inline-flex items-center justify-center gap-2 bg-[#0149E1] text-xs font-normal text-white transition hover:bg-[#0149E1]/90"
          style={{
            width: 189,
            height: 48,
            borderRadius: 48,
            border: "0.5px solid white",
            paddingTop: 16,
            paddingRight: 40,
            paddingBottom: 16,
            paddingLeft: 40,
            gap: 8,
          }}
        >
          View templates
        </Link>
      </div>
    </section>
  );
}
