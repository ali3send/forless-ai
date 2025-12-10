"use client";

type Section = {
  id: string;
  label: string;
};

type BuilderSection = "hero" | "about" | "features" | "contact";

type SectionStepperProps = {
  sections: readonly Section[];
  active: BuilderSection;
  onChange: (id: BuilderSection) => void;
};

export function SectionStepper({
  sections,
  active,
  onChange,
}: SectionStepperProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id as BuilderSection)}
          className={`rounded-full px-3 py-1 text-xs border ${
            active === s.id
              ? "bg-primary text-slate-950 border-primary"
              : "bg-slate-800 text-slate-200 border-slate-700"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
