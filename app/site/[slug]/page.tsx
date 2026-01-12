export const runtime = "edge";
export const dynamic = "force-static";
export const revalidate = false;

import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { ThemeProvider } from "@/components/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/components/websiteTemplates/templates";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandData } from "@/lib/types/brandTypes";

function renderSite(data: WebsiteData, brand: BrandData | null) {
  const templateKey = (data.template ?? "template1") as TemplateKey;
  const ActiveTemplate =
    WEBSITE_TEMPLATES[templateKey]?.component ??
    WEBSITE_TEMPLATES.template1.component;
  return (
    <ThemeProvider
      value={{
        primary: brand?.palette?.primary,
        secondary: brand?.palette?.secondary,
        fontFamily: brand?.font?.css,
      }}
    >
      <ActiveTemplate data={data} brand={brand} />
    </ThemeProvider>
  );
}

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const publicSupabase = await createPublicSupabaseClient();

  const { data: project } = await publicSupabase
    .from("projects")
    .select("published_website_data, brand_data")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project?.published_website_data) return notFound();
  console.log(
    "🔥 PUBLISHED PAGE RENDERED",
    new Date().toISOString(),
    "slug:",
    slug
  );

  return renderSite(project.published_website_data, project.brand_data);
}
