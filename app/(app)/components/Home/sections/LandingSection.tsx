export default function LandingSection() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full border border-secondary-fade bg-secondary-soft px-3 py-1 text-xs text-secondary">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
        <span className="font-semibold tracking-wide">
          ForlessAI Website Builder
        </span>
        <span className="text-secondary">•</span>
        <span className="text-secondary">
          v1 · New features every week · No extra cost
        </span>
      </div>

      <h1 className="mt-5 text-5xl font-bold w-full tracking-tight sm:text-5xl">
        Your website, live in{" "}
        <span className="bg-linear-to-r from-primary to-primary-light bg-clip-text text-transparent">
          60 seconds
        </span>
        . For less than $1.
      </h1>

      <p className="mt-4 max-w-xl text-sm leading-6 text-secondary sm:text-base">
        Describe it. Generate it. Publish it.
        <br />
        No code. No designers. No delays.
        <br />
        Describe your idea.{" "}
        <span className="font-semibold text-primary">
          FOR<span className="text-accent">LESS</span>
        </span>{" "}
        generates. Publish in seconds.
      </p>
      <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-secondary-dark">
        <span className="font-semibold text-primary">Version 1</span>
        <span className="opacity-60">—</span>
        <span>
          We’re shipping improvements weekly. Early users get everything at no
          extra cost.
        </span>
      </div>

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
