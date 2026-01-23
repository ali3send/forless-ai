import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { ThemeProvider } from "@/Templates/websiteTheme/ThemeProvider";
import {
  WEBSITE_TEMPLATES,
  type TemplateKey,
} from "@/Templates/websiteTemplates/templates";
import { WebsiteData } from "@/lib/types/websiteTypes";
import { BrandDataNew } from "@/lib/types/brandTypes";

/* ──────────────────────────────────────────────
   Load published website by slug (public + cached)
────────────────────────────────────────────── */
const getPublishedSite = (slug: string) =>
  unstable_cache(
    async () => {
      const supabase = createPublicSupabaseClient();

      console.log("🌍 [PUBLIC SITE] fetching slug:", slug);

      /* ── fetch website (NO .single() for safer debugging) ── */
      const { data: websites, error } = await supabase
        .from("websites")
        .select("id, slug, draft_data, brand_id, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .limit(1);

      if (error) {
        console.error("❌ [PUBLIC SITE] website query error:", error);
        return null;
      }

      const website = websites?.[0] ?? null;

      if (!website) {
        console.warn("⚠️ [PUBLIC SITE] no published website found for:", slug);
        return null;
      }

      if (!website.draft_data) {
        console.warn(
          "⚠️ [PUBLIC SITE] published site missing draft_data:",
          website.id
        );
        return null;
      }

      let brand: BrandDataNew | null = null;

      if (website.brand_id) {
        const { data: brandData, error: brandError } = await supabase
          .from("brands")
          .select("*")
          .eq("id", website.brand_id)
          .limit(1);

        if (brandError) {
          console.error("❌ [PUBLIC SITE] brand query error:", brandError);
        } else {
          const row = brandData?.[0] ?? null;

          if (row) {
            brand = {
              ...row,
              logoSvg: row.logo_svg,
            };
          }
        }
      }
      const data: WebsiteData =
        typeof website.draft_data === "string"
          ? JSON.parse(website.draft_data)
          : website.draft_data;

      console.log("✅ [PUBLIC SITE] loaded:", {
        websiteId: website.id,
        slug,
      });

      return {
        websiteId: website.id,
        data,
        brand,
      };
    },
    ["published-site", slug],
    {
      tags: ["max"],
    }
  )();

/* ──────────────────────────────────────────────
   Render website
────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   Page
────────────────────────────────────────────── */
export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  console.log("🌍 [PUBLIC SITE] render start:", slug);

  const site = await getPublishedSite(slug);

  if (!site) {
    return notFound();
  }

  return renderSite(site.data, site.brand, site.websiteId);
}
