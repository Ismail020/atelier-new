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
    logoWhite {
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
        mobileImage {
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
        }
      },
      menuItemsFR[] {
        page-> {
          name,
          slug,
          language  
        },
        mobileImage {
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
        }
      }
    }
  },
  "settingsSocial": *[_type == "settings"][0].socialMedia[] {
    platform,
    url
  },
  "termsPageEN": *[_type == "page" && language == "en" && name match "*Terms*" || name match "*Conditions*"][0] {
    name,
    slug
  },
  "termsPageFR": *[_type == "page" && language == "fr" && name match "*Terms*" || name match "*Conditions*"][0] {
    name,
    slug
  },
  "settingsContact": *[_type == "settings"][0].contactInfo {
    headOfDesign {
      name,
      phone,
      email
    },
    generalInquiries {
      email
    }
  }
}`);

export async function getNavbarData() {
  const { data } = await sanityFetch({ query: NAVBAR_QUERY });
  return data;
}
