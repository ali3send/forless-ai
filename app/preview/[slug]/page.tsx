export const runtime = "nodejs";

import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/Templates/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/Templates/websiteTemplates/templates";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandDataNew } from "@/lib/types/brandTypes";

function renderSite(
  data: WebsiteData,
  brand: BrandDataNew | null,
  websiteId: string
) {
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
      <ActiveTemplate data={data} brand={brand} websiteId={websiteId} />
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

  const { data: website, error } = await supabase
    .from("websites")
    .select(
      `
        id,
        project_id,
        brand_id,
        draft_data,
        is_published
      `
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !website || !website.draft_data) {
    return notFound();
  }

  /* ── load brand ── */
  let brand = null;
  if (website.brand_id) {
    const { data } = await supabase
      .from("brands")
      .select("*")
      .eq("id", website.brand_id)
      .single();

    if (data === null) {
      return notFound();
    }

    brand = {
      ...data,
      logoSvg: data.logo_svg,
    };
  }

  /* ── parse draft ── */
  const data: WebsiteData =
    typeof website.draft_data === "string"
      ? JSON.parse(website.draft_data)
      : website.draft_data;

  return renderSite(data, brand, website.id);
}
