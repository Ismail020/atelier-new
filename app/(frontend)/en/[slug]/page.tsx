import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ComponentRenderer from "@/components/ComponentRenderer";
import { PAGE_QUERY_EN } from "@/lib/queries/page";

interface PageProps {
  params: Promise<{ slug: string }>;
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
