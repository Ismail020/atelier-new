import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const NAVBAR_QUERY = defineQuery(`*[_type == "navbar"][0]{
  navbarStructure {
    brandText,
    logo {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    },
    menuItems {
      menuItemsEN[] {
        page-> {
          name,
          slug,
          language
        },
        mobileImage
      },
      menuItemsFR[] {
        page-> {
          name,
          slug,
          language  
        },
        mobileImage
      }
    }
  }
}`);

export async function getNavbarData() {
  const { data } = await sanityFetch({ query: NAVBAR_QUERY });
  return data;
}
