"use client";

import { useState } from "react";
import {
  WebsiteType,
  WebsiteData,
  getDefaultWebsiteData,
} from "@/lib/websiteTypes";
import { WebsiteTemplateBasic } from "@/components/website/WebsiteTemplateBasic";

import { HeroSectionForm } from "./_components/HeroSectionForm";
import { AboutSectionForm } from "./_components/AboutSectionForm";
import { SectionStepper } from "./_components/SectionStepper";

const builderSections = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About" },
  { id: "features", label: "Features" },
  { id: "contact", label: "Contact" },
] as const;

type BuilderSection = (typeof builderSections)[number]["id"];

export default function WebsiteBuilderPage() {
  const [type, setType] = useState<WebsiteType>("product");
  const [data, setData] = useState<WebsiteData>(() =>
    getDefaultWebsiteData("product")
  );
  const [section, setSection] = useState<BuilderSection>("hero");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="w-full space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 lg:w-80">
          <h1 className="text-lg font-semibold mb-2">Website Builder</h1>

          <SectionStepper
            sections={builderSections}
            active={section}
            onChange={setSection}
          />

          {section === "hero" && (
            <HeroSectionForm
              type={type}
              onTypeChange={(t) => {
                setType(t);
                setData(getDefaultWebsiteData(t));
              }}
              data={data}
              setData={setData}
            />
          )}

          {section === "about" && (
            <AboutSectionForm data={data} setData={setData} />
          )}
        </aside>

        <main className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <WebsiteTemplateBasic data={data} />
        </main>
      </div>
    </div>
  );
}
