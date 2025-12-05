import { sanityFetch } from "@/sanity/lib/live";
import ComponentRenderer from "@/components/ComponentRenderer";
import { HOME_QUERY_EN } from "@/lib/queries/home";

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
