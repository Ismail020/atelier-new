import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const NAVBAR_QUERY = defineQuery(`*[_type == "navbar"][0]{
  navbarStructure {
    brandText,
    logo,
    menuItems {
      menuItemsEN[] {
        page-> {
          name,
          slug {
            current
          }
        },
        mobileImage
      },
      menuItemsFR[] {
        page-> {
          name,
          slug {
            current
          }
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
