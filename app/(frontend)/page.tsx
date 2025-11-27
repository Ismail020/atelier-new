import { sanityFetch } from "@/sanity/lib/live";
import { HOME_QUERY_FR } from "@/lib/queries/home";
import ComponentRenderer from "@/components/ComponentRenderer";

export default async function Home() {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_FR,
    params: {},
  });

  if (!page) {
    return null;
  }

  return <ComponentRenderer components={page.components || []} isHomePage={true} lng="fr" />;
}
