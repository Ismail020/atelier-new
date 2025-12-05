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

  return (
    <div className="mb-[100px] md:mb-[140px]">
      <ComponentRenderer components={page.components || []} isHomePage={true} lng="fr" />
    </div>
  );
}
