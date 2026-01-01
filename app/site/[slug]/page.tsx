import { notFound } from "next/navigation";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ThemeProvider } from "@/components/websiteTheme/ThemeProvider";
import { WebsiteTemplateBasic } from "@/components/websiteTemplates/Template1/WebsiteTemplateBasic";

export default async function SitePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const publicSupabase = await createPublicSupabaseClient();

  // ─────────────────────────────
  // 1) PUBLIC PATH
  // ─────────────────────────────
  const { data: publicProject } = await publicSupabase
    .from("projects")
    .select("id, published, brand_data")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (publicProject?.id) {
    const { data: website } = await publicSupabase
      .from("websites")
      .select("data")
      .eq("project_id", publicProject.id)
      .maybeSingle();

    if (!website?.data) return notFound();

    const brand = publicProject.brand_data;

    return (
      <ThemeProvider
        value={{
          primary: brand?.palette?.primary,
          secondary: brand?.palette?.secondary,
          fontFamily: brand?.font?.css,
        }}
      >
        <WebsiteTemplateBasic data={website.data} />
      </ThemeProvider>
    );
  }

  // ─────────────────────────────
  // 2) OWNER PREVIEW PATH
  // ─────────────────────────────
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return notFound();

  const { data: ownerProject } = await supabase
    .from("projects")
    .select("id, brand_data")
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!ownerProject) return notFound();

  const { data: website } = await supabase
    .from("websites")
    .select("data")
    .eq("project_id", ownerProject.id)
    .maybeSingle();

  if (!website?.data) return notFound();

  const brand = ownerProject.brand_data;

  return (
    <ThemeProvider
      value={{
        primary: brand?.palette?.primary,
        secondary: brand?.palette?.secondary,
        fontFamily: brand?.font?.css,
      }}
    >
      <WebsiteTemplateBasic data={website.data} />
    </ThemeProvider>
  );
}
