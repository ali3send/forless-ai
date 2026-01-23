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

      /* ── fetch website (NO .single() for safer debugging) ── */
      const { data: websites, error } = await supabase
        .from("websites")
        .select("id, slug, published_data, brand_id, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .limit(1);

      if (error) {
        return null;
      }

      const website = websites?.[0] ?? null;

      if (!website) {
        return null;
      }

      if (!website.published_data) {
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
        typeof website.published_data === "string"
          ? JSON.parse(website.published_data)
          : website.published_data;

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
