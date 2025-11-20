import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ComponentRenderer from "@/components/ComponentRenderer";

const PAGE_QUERY_EN_SLUG = defineQuery(`*[
  _type == "page" 
  && name == $pageName 
  && language == "en"
][0]{
  name,
  language,
  components[]{
    _type,
    _key,
    ...
  }
}`);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EnglishPage({ params }: PageProps) {
  const { slug } = await params;
  // Safety check for params
  if (!slug) {
    notFound();
  }

  // Use slug as-is since it matches the page name in Sanity
  const pageName = slug;

  const { data: page } = await sanityFetch({
    query: PAGE_QUERY_EN_SLUG,
    params: { pageName },
  });

  if (!page) {
    notFound();
  }

  return <ComponentRenderer components={page.components || []} />;
}

export async function generateStaticParams() {
  // Fetch English pages only, excluding "Home" page (handled by root route)
  const allPages = await client.fetch(
    `*[_type == "page" && defined(name) && name != "Home" && language == "en"]{ name }`
  );

  return (
    allPages
      ?.filter((page: { name: string | null }) => page.name)
      .map((page: { name: string }) => ({
        slug: page.name,
      })) || []
  );
}
