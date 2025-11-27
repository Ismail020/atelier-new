import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import ComponentRenderer from "@/components/ComponentRenderer";

const PAGE_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && slug.current == $pageName 
  && language == "fr"
][0]{
  name,
  language,
  components[]{
    ...,
    "images": images[]{..., asset->},
    "logo": logo{..., asset->},
    "backgroundImage": backgroundImage{..., asset->},
    "contactUsImage": contactUsImage{..., asset->},
    "mainImage": mainImage{..., asset->},
    "previewImages": previewImages[]{..., asset->},
    "gallery": gallery[]{..., asset->},
    "selectedProjects": selectedProjects[]-> {
      _id,
      _type,
      name,
      slug,
      date,
      "previewImages": previewImages[]{
        ..., 
        asset->,
        isFeatured,
        showOnMobile,
        isFeaturedMobile
      },
    },
    "projectsPageLink": projectsPageLink->{
      _id,
      _type,
      name,
      slug
    },
    headline[]{
      ...,
      markDefs[]{
        ...,
        "linkToPage": linkToPage->{
          _id,
          _type,
          name,
          slug
        }
      }
    }
  }
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
    params: { pageName },
  });

  if (!page) {
    notFound();
  }

  return <ComponentRenderer components={page.components || []} currentLanguage="fr" />;
}

export async function generateStaticParams() {
  // Fetch French pages only, excluding "Home" page (handled by root route)
  const allPages = await client.fetch(
    `*[_type == "page" && defined(slug.current) && name != "Home" && language == "fr"]{ slug }`,
  );

  return (
    allPages
      ?.filter((page: { slug: { current: string } | null }) => page.slug?.current)
      .map((page: { slug: { current: string } }) => ({
        slug: page.slug.current,
      })) || []
  );
}
