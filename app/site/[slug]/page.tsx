// app/site/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const publicSupabase = await createPublicSupabaseClient();

  // 1) PUBLIC PATH: only published projects should be readable by anon (RLS-friendly)
  const { data: publicProject, error: pubErr } = await publicSupabase
    .from("projects")
    .select("id, published, brand_data, slug")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (pubErr) console.error("PUBLIC SITE: public project query error:", pubErr);

  // If it's published, render publicly
  if (publicProject?.id) {
    const { data: website, error: websiteErr } = await publicSupabase
      .from("websites")
      .select("data")
      .eq("project_id", publicProject.id)
      .maybeSingle();

    if (websiteErr)
      console.error("PUBLIC SITE: website query error:", websiteErr);

    if (!website?.data) return notFound();

    const theme =
      (publicProject as any).brand_data?.theme ??
      ((publicProject as any).brand_data
        ? {
            primary: (publicProject as any).brand_data.palette?.primary,
            secondary: (publicProject as any).brand_data.palette?.secondary,
            fontFamily: (publicProject as any).brand_data.font?.css,
          }
        : undefined);

    return <WebsiteTemplateBasic data={website.data} theme={theme} />;
  }

  // 2) OWNER PREVIEW PATH: project is either unpublished OR public policy hid it
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: ownerProject, error: ownerErr } = await supabase
    .from("projects")
    .select("id, published, brand_data, slug, user_id")
    .eq("slug", slug)
    .eq("user_id", user.id) // ✅ only owner's project
    .maybeSingle();

  if (ownerErr)
    console.error("PUBLIC SITE: owner project query error:", ownerErr);

  if (!ownerProject) return notFound();

  const { data: website, error: websiteErr } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", ownerProject.id)
    .maybeSingle();

  if (websiteErr)
    console.error("PUBLIC SITE: owner website query error:", websiteErr);

  if (!website?.data) return notFound();

  const theme =
    (ownerProject as any).brand_data?.theme ??
    ((ownerProject as any).brand_data
      ? {
          primary: (ownerProject as any).brand_data.palette?.primary,
          secondary: (ownerProject as any).brand_data.palette?.secondary,
          fontFamily: (ownerProject as any).brand_data.font?.css,
        }
      : undefined);

  return <WebsiteTemplateBasic data={website.data} theme={theme} />;
}
