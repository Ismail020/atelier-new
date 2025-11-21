import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import ComponentRenderer from "@/components/ComponentRenderer";

const HOME_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "fr"
][0]{
  ...,
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
    }
  }
}`);

export default async function Home() {
  const { data: page } = await sanityFetch({
    query: HOME_QUERY_FR,
    params: {},
  });

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">
          No French homepage found. Create one in Sanity Studio with name
          &quot;Home&quot; and language &quot;fr&quot;.
        </p>
      </div>
    );
  }

  return (
    <ComponentRenderer 
      components={page.components || []} 
      isHomePage={true}
      currentLanguage="fr"
    />
  );
}
