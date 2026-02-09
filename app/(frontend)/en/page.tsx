import { sanityFetch } from "@/sanity/lib/live";
import ComponentRenderer from "@/components/ComponentRenderer";
import { HOME_QUERY_EN } from "@/lib/queries/home";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_EN,
    params: {},
  });

  if (!page) {
    return {};
  }

  const title = page.seoTitle || page.name;
  const description = page.seoDescription || undefined;
  const imageUrl = page.seoImage?.asset?.url;
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl}/en`;

  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        fr: siteUrl,
        en: canonical,
        "x-default": siteUrl,
      },
    },
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
  };
}

export default async function EnglishHome() {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_EN,
    params: {},
  });

  if (!page) {
    return null;
  }

  return (
    <div className="mb-[100px] md:mb-[140px]">
      <ComponentRenderer components={page.components || []} isHomePage={true} lng="en" />
    </div>
  );
}
