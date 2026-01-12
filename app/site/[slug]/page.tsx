export const runtime = "edge";
export const revalidate = 600;
export const dynamic = "force-static";

import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { ThemeProvider } from "@/components/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/components/websiteTemplates/templates";

function renderSite(data: any, brand: any) {
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
    .select("id, brand_data")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!project) return notFound();

  const { data: website } = await publicSupabase
    .from("websites")
    .select("data")
    .eq("project_id", project.id)
    .maybeSingle();

  if (!website?.data) return notFound();

  return renderSite(website.data, project.brand_data);
}
