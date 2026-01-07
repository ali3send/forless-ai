export default function LandingSection() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1 text-xs text-secondary">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="font-semibold tracking-wide">
          ForlessAI Website Builder
        </span>
        <span className="text-secondary">•</span>
        <span className="text-secondary">Next.js + Supabase</span>
      </div>

      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
        Launch{" "}
        <span className="bg-linear-to-r from-primary to-primary-light bg-clip-text text-transparent">
          modern websites
        </span>{" "}
        in minutes — not weeks.
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-6 text-secondary sm:text-base">
        Describe your business in a few lines. ForlessAI generates clean,
        editable Next.js pages, sections, and components — backed by a secure
        Supabase setup. Publish to your subdomain instantly.
      </p>

      {/* CTA */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <a
          href="/auth/signup"
          className="group inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
        >
          Get started
          <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
        </a>

        <a
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-md border border-secondary-fade px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
        >
          Log in
        </a>

        <div className="ml-0 flex items-center gap-2 text-xs sm:ml-2 text-secondary">
          <span className="inline-flex h-6 items-center rounded-full bg-secondary-soft px-2">
            No credit card
          </span>
          <span className="inline-flex h-6 items-center rounded-full bg-secondary-soft px-2">
            Publish-ready
          </span>
        </div>
      </div>
    </div>
  );
}
