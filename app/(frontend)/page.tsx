import { sanityFetch } from "@/sanity/lib/live";
import { HOME_QUERY_FR } from "@/lib/queries/home";
import ComponentRenderer from "@/components/ComponentRenderer";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_FR,
    params: {},
  });

  if (!page) {
    return {};
  }

  const title = page.seoTitle || page.name;
  const description = page.seoDescription || undefined;
  const imageUrl = page.seoImage?.asset?.url;
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const canonical = siteUrl;

  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        fr: canonical,
        en: `${siteUrl}/en`,
        "x-default": canonical,
      },
    },
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
  };
}

export default async function Home() {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_FR,
    params: {},
  });

  if (!page) {
    return null;
  }

  return (
    <div className="mb-[100px] md:mb-[140px]">
      <ComponentRenderer components={page.components || []} isHomePage={true} lng="fr" />
    </div>
  );
}
