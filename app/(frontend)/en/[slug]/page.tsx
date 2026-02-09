import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ComponentRenderer from "@/components/ComponentRenderer";
import { PAGE_QUERY_EN } from "@/lib/queries/page";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {};
  }

  const { data: page } = await sanityFetch({
    query: PAGE_QUERY_EN,
    params: { slug },
  });

  if (!page) {
    return {};
  }

  const title = page.seoTitle || page.name;
  const description = page.seoDescription || undefined;
  const imageUrl = page.seoImage?.asset?.url;
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl}/en/${slug}`;

  return {
    title,
    description,
    robots: page.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        fr: `${siteUrl}/${slug}`,
        en: canonical,
        "x-default": `${siteUrl}/${slug}`,
      },
    },
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
  };
}

export default async function EnglishPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const { data: page } = await sanityFetch({
    query: PAGE_QUERY_EN,
    params: { slug },
  });

  if (!page) {
    notFound();
  }

  return (
    <div className="mb-[100px] md:mb-[140px]">
      <ComponentRenderer components={page.components || []} lng="en" />
    </div>
  );
}

export async function generateStaticParams() {
  // Fetch English pages only, excluding "Home" page (handled by root route)
  const allPages = await client.fetch(
    `*[_type == "page" && defined(slug.current) && name != "Home" && language == "en"]{ slug }`,
  );

  return (
    allPages
      ?.filter((page: { slug: { current: string } | null }) => page.slug?.current)
      .map((page: { slug: { current: string } }) => ({
        slug: page.slug.current,
      })) || []
  );
}
