import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";

const PAGE_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && name == $pageName 
  && language == "fr"
][0]{
  name,
  language,
  components
}`);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  // Safety check for params
  if (!slug) {
    notFound();
  }
  
  // Use slug as-is since it matches the page name in Sanity
  const pageName = slug;
  
  const { data: page } = await sanityFetch({ 
    query: PAGE_QUERY_FR,
    params: { pageName }
  });

  if (!page) {
    notFound();
  }

  return (
    <main>
      <h1>{page.name}</h1>
      <p>Language: {page.language}</p>
      <p>Page Name: {page.name}</p>
      {/* We'll add component rendering here */}
    </main>
  );
}

export async function generateStaticParams() {
  // Fetch French pages only, excluding "Home" page (handled by root route)
  const allPages = await client.fetch(`*[_type == "page" && defined(name) && name != "Home" && language == "fr"]{ name }`);
  
  return allPages?.filter((page: { name: string | null }) => page.name).map((page: { name: string }) => ({
    slug: page.name
  })) || [];
}