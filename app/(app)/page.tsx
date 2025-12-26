export default function HomePage() {
  return (
    <main className="relative overflow-hidden text-black">
      {/* Background */}
      {/* <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary-soft/60 blur-[110px]" />
        <div className="absolute -bottom-32 right-[-120px] h-[520px] w-[520px] rounded-full bg-primary-soft/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(1,72,224,0.08),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(254,107,14,0.07),transparent_45%)]" />
      </div> */}

      <section className="relative mx-auto max-w-6xl px-4 py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr),minmax(0,1fr)] lg:items-center">
          {/* Left */}
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
              editable Next.js pages, sections, and components — backed by a
              secure Supabase setup. Publish to your subdomain instantly.
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="group inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover"
              >
                Get started
                <span className="ml-2 transition group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              {/* FIX 1: border-secondary -> border-secondary-fade */}
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

            {/* Social proof + small features */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3">
                {/* FIX 2: text-secondary-active (surface token) -> text-secondary */}
                <p className="text-xs text-secondary">Average first draft</p>
                {/* FIX 2: text-secondary-active -> text-secondary-dark */}
                <p className="mt-1 text-lg font-semibold text-secondary-dark">
                  &lt; 2 minutes
                </p>
              </div>

              <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3">
                <p className="text-xs text-secondary">Generated output</p>
                <p className="mt-1 text-lg font-semibold text-secondary-dark">
                  Next.js code
                </p>
              </div>

              <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3">
                <p className="text-xs text-secondary">Backend</p>
                <p className="mt-1 text-lg font-semibold text-secondary-dark">
                  Supabase
                </p>
              </div>
            </div>

            {/* FIX 2: text-secondary-active -> text-secondary */}
            <p className="mt-4 text-xs text-secondary">
              Log in → describe your project → edit components → publish to your
              subdomain.
            </p>
          </div>

          {/* Right: AI Builder Console */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-r from-primary/10 via-transparent to-primary-light/10 blur-2xl" />

            {/* FIX 3: border-secondary-hover -> border-secondary-fade (clean border token) */}
            <div className="relative rounded-2xl border border-secondary-fade bg-secondary-soft p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.06)] backdrop-blur">
              {/* top bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
                  </div>
                  <p className="text-xs text-secondary-dark">
                    ForlessAI Builder
                  </p>
                </div>

                {/* FIX 4: bg-secondary + text-white -> light surface + readable text */}
                <span className="rounded-full border border-secondary-fade bg-secondary-soft px-2 py-1 text-[11px] text-secondary-dark">
                  Live
                </span>
              </div>

              {/* Headline */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-secondary-dark">
                  From basic layout to polished landing page
                </h3>
                <p className="mt-1 text-sm text-secondary">
                  ForlessAI improves structure, spacing, hierarchy, and section
                  flow — while keeping everything editable.
                </p>
              </div>

              {/* Split preview */}
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {/* BEFORE */}
                <div className="rounded-xl border border-secondary-fade bg-secondary-light p-4">
                  <div className="flex items-center justify-between">
                    {/* FIX 5: text-secondary-active -> text-secondary-dark */}
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark">
                      Before
                    </p>

                    {/* FIX 6: bg-secondary + text-secondary-fade -> bg-secondary-soft + readable text */}
                    <span className="rounded-full border border-secondary-fade bg-secondary-soft px-2 py-1 text-[11px] text-secondary">
                      Draft
                    </span>
                  </div>

                  {/* messy blocks */}
                  <div className="mt-4 space-y-2">
                    <div className="h-8 w-2/3 rounded-md border border-secondary-fade bg-secondary-hover" />
                    <div className="h-3 w-full rounded border border-secondary-fade bg-secondary-hover" />
                    <div className="h-3 w-5/6 rounded border border-secondary-fade bg-secondary-hover" />

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="h-16 rounded-lg border border-secondary-fade bg-secondary-hover" />
                      <div className="h-16 rounded-lg border border-secondary-fade bg-secondary-hover" />
                    </div>

                    <div className="h-10 rounded-lg border border-secondary-fade bg-secondary-hover" />
                    <div className="h-10 w-3/4 rounded-lg border border-secondary-fade bg-secondary-hover" />

                    <div className="mt-3 h-8 rounded-md border border-secondary-fade bg-secondary-hover" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Unclear CTA", "Weak hierarchy", "Generic layout"].map(
                      (x) => (
                        <span
                          key={x}
                          className="rounded-md border border-secondary-fade bg-secondary-soft px-2 py-1 text-xs text-secondary"
                        >
                          {x}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* AFTER */}
                <div className="relative overflow-hidden rounded-xl border border-secondary-fade bg-secondary-light p-4">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-soft/70 blur-3xl" />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                      After
                    </p>

                    {/* same fix as Draft */}
                    <span className="rounded-full border border-secondary-fade bg-secondary-soft px-2 py-1 text-[11px] text-secondary">
                      Optimized
                    </span>
                  </div>

                  {/* polished blocks */}
                  <div className="mt-4 space-y-3">
                    {/* hero */}
                    {/* FIX 7: bg-secondary -> bg-secondary-soft (better light surface) */}
                    <div className="rounded-lg border border-secondary-fade bg-secondary-soft p-3">
                      <div className="h-3 w-24 rounded bg-primary/25" />
                      {/* FIX 7: bg-secondary -> bg-secondary-hover */}
                      <div className="mt-2 h-6 w-3/4 rounded bg-secondary-hover" />
                      <div className="mt-2 h-3 w-full rounded bg-secondary-hover" />
                      <div className="mt-1 h-3 w-5/6 rounded bg-secondary-hover" />
                      <div className="mt-3 flex gap-2">
                        <div className="h-8 w-24 rounded-md bg-primary" />
                        <div className="h-8 w-20 rounded-md border border-secondary-fade bg-secondary-hover" />
                      </div>
                    </div>

                    {/* features */}
                    {/* FIX 7: bg-secondary -> bg-secondary-hover */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-16 rounded-lg border border-secondary-fade bg-secondary-hover" />
                      <div className="h-16 rounded-lg border border-secondary-fade bg-secondary-hover" />
                      <div className="h-16 rounded-lg border border-secondary-fade bg-secondary-hover" />
                    </div>

                    <div className="h-12 rounded-lg border border-secondary-fade bg-secondary-hover" />
                    <div className="h-9 rounded-lg border border-secondary-fade bg-secondary-hover" />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Clear CTA", "Better spacing", "Modern sections"].map(
                      (x) => (
                        <span
                          key={x}
                          className="rounded-md border border-secondary-fade bg-secondary-soft px-2 py-1 text-xs text-secondary"
                        >
                          {x}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* prompt */}
              <div className="mt-4 rounded-xl border border-secondary-fade bg-secondary-light p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">
                  Prompt
                </p>

                <div className="mt-3 space-y-2">
                  <div className="rounded-lg border border-secondary-fade bg-secondary-soft px-3 py-2 text-sm text-secondary">
                    “Create a modern landing page with a hero, features,
                    pricing, and a contact section.”
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["Business", "Minimal", "Light", "Fast"].map((x) => (
                      <span
                        key={x}
                        className="rounded-md border border-secondary-fade bg-secondary-soft px-2 py-1 text-xs text-secondary"
                      >
                        {x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* console */}
              <div className="mt-3 rounded-xl border border-secondary-fade bg-secondary-light p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary">
                    Build log
                  </p>
                  <span className="inline-flex items-center gap-2 text-xs text-secondary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-hover/25" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-hover" />
                    </span>
                    Running
                  </span>
                </div>

                <div className="mt-3 space-y-2 font-mono text-[12px] leading-5">
                  <div className="flex items-start gap-2 text-secondary-dark">
                    <span className="mt-0.5 text-primary">✓</span>
                    <span>Scaffold Next.js layout</span>
                  </div>
                  <div className="flex items-start gap-2 text-secondary-dark">
                    <span className="mt-0.5 text-primary">✓</span>
                    <span>Generate sections: hero, features, pricing</span>
                  </div>
                  <div className="flex items-start gap-2 text-secondary-dark">
                    <span className="mt-0.5 text-primary">✓</span>
                    <span>Wire data + forms (Supabase)</span>
                  </div>
                  <div className="flex items-start gap-2 text-secondary-dark">
                    <span className="mt-0.5 text-primary-hover">›</span>
                    <span className="text-secondary-dark">
                      Optimize styling + spacing…
                    </span>
                  </div>

                  {/* FIX 8: progress bg-secondary -> bg-secondary-hover */}
                  <div className="pt-2">
                    <div className="h-2 w-full rounded-full bg-secondary-hover">
                      <div className="h-2 w-[76%] rounded-full bg-gradient-to-r from-primary to-primary-light" />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-secondary">
                      <span>Generating clean components</span>
                      <span>76%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* output */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-secondary-fade bg-secondary-light p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark">
                    Output
                  </p>
                  <p className="mt-2 text-sm font-semibold text-secondary-dark">
                    Editable Next.js code
                  </p>
                  <p className="mt-1 text-xs text-secondary-dark">
                    Components you can tweak, move, or delete.
                  </p>
                </div>

                <div className="rounded-xl border border-secondary-fade bg-secondary-light p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark">
                    Publish
                  </p>
                  <p className="mt-2 text-sm font-semibold text-secondary-dark">
                    Instant subdomain
                  </p>
                  <p className="mt-1 text-xs text-secondary-dark">
                    Preview on /site/&lt;slug&gt; and go live when ready.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* End right */}
        </div>
      </section>
    </main>
  );
}
