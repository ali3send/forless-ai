import React from "react";

function SkeltonLayout() {
  return (
    <div className="mt-16 relative rounded-2xl border border-secondary-fade bg-secondary-fade p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.06)] backdrop-blur">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary/80" />
          </div>
          <p className="text-xs text-secondary-dark">ForlessAI Builder</p>
        </div>
        <span className="rounded-full border border-secondary-fade bg-accent px-2 py-1 text-[11px] text-white">
          Live
        </span>
      </div>

      {/* Headline */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-secondary-dark">
          From basic layout to polished landing page
        </h3>
        <p className="mt-1 text-sm text-secondary">
          ForlessAI improves structure, spacing, hierarchy, and section flow —
          while keeping everything editable.
        </p>
      </div>

      {/* Split preview */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {/* BEFORE */}
        <div className="rounded-xl bg-secondary-soft p-4">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-secondary-dark">
              Before
            </p>

            <span className="rounded-full border border-secondary px-2 py-1 text-[11px] text-secondary">
              Draft
            </span>
          </div>

          {/* messy blocks */}
          <div className="mt-4 space-y-2">
            <div className="h-8 w-2/3 rounded-md border border-secondary-soft bg-secondary-light" />
            <div className="h-3 w-full rounded border border-secondary-soft bg-secondary-light" />
            <div className="h-3 w-5/6 rounded border border-secondary-soft bg-secondary-light" />

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-16 rounded-lg border border-secondary-soft bg-secondary-light" />
              <div className="h-16 rounded-lg border border-secondary-soft bg-secondary-light" />
            </div>

            <div className="h-10 rounded-lg border border-secondary-soft bg-secondary-light" />
            <div className="h-10 w-3/4 rounded-lg border border-secondary-soft bg-secondary-light" />

            <div className="mt-3 h-8 rounded-md border border-secondary-soft bg-secondary-light" />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Unclear CTA", "Weak hierarchy", "Generic layout"].map((x) => (
              <span
                key={x}
                className="rounded-md  border border-secondary bg-secondary-soft px-2 py-1 text-xs text-secondary"
              >
                {x}
              </span>
            ))}
          </div>
        </div>

        {/* AFTER */}
        <div className="relative overflow-hidden rounded-xl border border-secondary-fade bg-secondary-soft p-4">
          <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-primary-fade blur-3xl" />

          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              After
            </p>

            {/* same fix as Draft */}
            <span className="rounded-full border border-secondary px-2 py-1 text-[11px] text-secondary">
              Optimized
            </span>
          </div>

          {/* polished blocks */}
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-secondary-light bg-secondary-soft p-3">
              <div className="h-3 w-24 rounded bg-accent/25" />
              <div className="mt-2 h-6 w-3/4 rounded bg-secondary-light" />
              <div className="mt-2 h-3 w-full rounded bg-secondary-light" />
              <div className="mt-1 h-3 w-5/6 rounded bg-secondary-light" />
              <div className="mt-3 flex gap-2">
                <div className="h-8 w-24 rounded-md bg-accent-soft" />
                <div className="h-8 w-20 rounded-md bg-secondary-light" />
              </div>
            </div>

            {/* features */}
            <div className="grid grid-cols-3 gap-2">
              <div className="h-16 rounded-lg  bg-secondary-light" />
              <div className="h-16 rounded-lg  bg-secondary-light" />
              <div className="h-16 rounded-lg  bg-secondary-light" />

              <div className="h-12 rounded-lg  bg-secondary-light" />
              <div className="h-9 rounded-lg  bg-secondary-light" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {["Clear CTA", "Better spacing", "Modern sections"].map((x) => (
                <span
                  key={x}
                  className="rounded-md border border-secondary bg-secondary-soft px-2 py-1 text-xs text-secondary"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkeltonLayout;
