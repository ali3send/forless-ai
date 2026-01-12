export const runtime = "nodejs";

import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  noStore();

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: project } = await supabase
    .from("projects")
    .select("id, brand_data")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!project) return notFound();

  const { data: website } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", project.id)
    .maybeSingle();

  if (!website?.data) return notFound();

  return renderSite(website.data, project.brand_data);
}
