export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]" />
        <div className="absolute -bottom-32 right-[-120px] h-[520px] w-[520px] rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.05),transparent_45%)]" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr),minmax(0,1fr)] lg:items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-semibold tracking-wide">
                ForlessAI Website Builder
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-400">Next.js + Supabase</span>
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              Launch{" "}
              <span className="bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent">
                modern websites
              </span>{" "}
              in minutes — not weeks.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Describe your business in a few lines. ForlessAI generates clean,
              editable Next.js pages, sections, and components — backed by a
              secure Supabase setup. Publish to your subdomain instantly.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-primary-hover"
              >
                Get started
                <span className="ml-2 transition group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-slate-900/30 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-primary hover:text-primary-hover"
              >
                Log in
              </a>

              <div className="ml-0 flex items-center gap-2 text-xs text-slate-400 sm:ml-2">
                <span className="inline-flex h-6 items-center rounded-full border border-slate-800 bg-slate-900/50 px-2">
                  No credit card
                </span>
                <span className="inline-flex h-6 items-center rounded-full border border-slate-800 bg-slate-900/50 px-2">
                  Publish-ready
                </span>
              </div>
            </div>

            {/* Social proof + small features */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-400">Average first draft</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  &lt; 2 minutes
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-400">Generated output</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  Next.js code
                </p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-xs text-slate-400">Backend</p>
                <p className="mt-1 text-lg font-semibold text-slate-100">
                  Supabase
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Log in → describe your project → edit components → publish to your
              subdomain.
            </p>
          </div>

          {/* Right: AI Builder Console */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-violet-500/10 blur-2xl" />

            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/45 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
              {/* top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                  </div>
                  <p className="text-xs text-slate-400">ForlessAI Builder</p>
                </div>

                <span className="rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-300">
                  Live
                </span>
              </div>

              {/* Headline */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-slate-100">
                  From basic layout to polished landing page
                </h3>
                <p className="mt-1 text-sm text-slate-300">
                  ForlessAI improves structure, spacing, hierarchy, and section
                  flow — while keeping everything editable.
                </p>
              </div>

              {/* Split preview */}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {/* BEFORE */}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                      Before
                    </p>
                    <span className="rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-400">
                      Draft
                    </span>
                  </div>

                  {/* messy blocks */}
                  <div className="mt-4 space-y-2">
                    <div className="h-8 w-2/3 rounded-md border border-slate-800 bg-slate-900/40" />
                    <div className="h-3 w-full rounded border border-slate-800 bg-slate-900/30" />
                    <div className="h-3 w-5/6 rounded border border-slate-800 bg-slate-900/30" />

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/30" />
                      <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/30" />
                    </div>

                    <div className="h-10 rounded-lg border border-slate-800 bg-slate-900/30" />
                    <div className="h-10 w-3/4 rounded-lg border border-slate-800 bg-slate-900/30" />

                    <div className="mt-3 h-8 rounded-md border border-slate-800 bg-slate-900/30" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Unclear CTA", "Weak hierarchy", "Generic layout"].map(
                      (x) => (
                        <span
                          key={x}
                          className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-400"
                        >
                          {x}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* AFTER */}
                <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary/18 blur-3xl" />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-hover">
                      After
                    </p>
                    <span className="rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] text-emerald-300">
                      Optimized
                    </span>
                  </div>

                  {/* polished blocks */}
                  <div className="mt-4 space-y-3">
                    {/* hero */}
                    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                      <div className="h-3 w-24 rounded bg-primary/30" />
                      <div className="mt-2 h-6 w-3/4 rounded bg-slate-200/10" />
                      <div className="mt-2 h-3 w-full rounded bg-slate-200/5" />
                      <div className="mt-1 h-3 w-5/6 rounded bg-slate-200/5" />
                      <div className="mt-3 flex gap-2">
                        <div className="h-8 w-24 rounded-md bg-primary/80" />
                        <div className="h-8 w-20 rounded-md border border-slate-700 bg-slate-900/40" />
                      </div>
                    </div>

                    {/* features */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/35" />
                      <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/35" />
                      <div className="h-16 rounded-lg border border-slate-800 bg-slate-900/35" />
                    </div>

                    {/* section */}
                    <div className="h-12 rounded-lg border border-slate-800 bg-slate-900/35" />

                    {/* footer */}
                    <div className="h-9 rounded-lg border border-slate-800 bg-slate-900/35" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Clear CTA", "Better spacing", "Modern sections"].map(
                      (x) => (
                        <span
                          key={x}
                          className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-300"
                        >
                          {x}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
              {/* prompt */}
              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Prompt
                </p>

                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-200">
                    “Create a modern landing page with a hero, features,
                    pricing, and a contact section.”
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Business", "Minimal", "Dark", "Fast"].map((x) => (
                      <span
                        key={x}
                        className="rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-xs text-slate-300"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* console */}
              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Build log
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/40" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Running
                  </span>
                </div>

                <div className="mt-3 space-y-2 font-mono text-[12px] leading-5">
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="mt-0.5 text-emerald-300">✓</span>
                    <span>Scaffold Next.js layout</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="mt-0.5 text-emerald-300">✓</span>
                    <span>Generate sections: hero, features, pricing</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="mt-0.5 text-emerald-300">✓</span>
                    <span>Wire data + forms (Supabase)</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300">
                    <span className="mt-0.5 text-primary-hover">›</span>
                    <span className="text-slate-200">
                      Optimize styling + spacing…
                    </span>
                  </div>

                  {/* progress bar */}
                  <div className="pt-2">
                    <div className="h-2 w-full rounded-full bg-slate-800">
                      <div className="h-2 w-[76%] rounded-full bg-gradient-to-r from-primary to-violet-300" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Generating clean components</span>
                      <span>76%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* output */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Output
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">
                    Editable Next.js code
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Components you can tweak, move, or delete.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Publish
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">
                    Instant subdomain
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Preview on /s/&lt;slug&gt; and go live when ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
