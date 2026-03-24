import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import type { Metadata } from "next";
import Script from "next/script";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { ThemeProvider } from "@/Templates/websiteTheme/ThemeProvider";
import { resolveTemplate } from "@/Templates/websiteTemplates/templates";
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
  const ActiveTemplate = resolveTemplate(data.template, data.layout);

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
   Dynamic metadata (SEO)
────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getPublishedSite(slug);

  if (!site) return {};

  const { data } = site;

  return {
    title: data.seoTitle || data.websiteName || data.brandName,
    description: data.seoDescription || data.tagline,
  };
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

  return (
    <>
      {site.data.googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${site.data.googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.data.googleAnalyticsId}');`}
          </Script>
        </>
      )}
      {site.data.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${site.data.metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}
      {renderSite(site.data, site.brand, site.websiteId)}
    </>
  );
}
