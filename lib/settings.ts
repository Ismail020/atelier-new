import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const SETTINGS_QUERY = defineQuery(`*[_type == "settings"][0]{
  "settingsContact": contactInfo {
    headOfDesign {
      name,
      phone,
      email
    },
    generalInquiries {
      email
    }
  },
  "settingsSocial": socialMedia[] {
    platform,
    url
  },
  "structuredData": structuredData {
    localBusiness {
      name,
      url,
      image {
        asset-> {
          _id,
          url
        }
      },
      address {
        addressCountry,
        addressLocality,
        addressRegion,
        postalCode,
        streetAddress
      },
      telephone
    },
    website {
      name,
      url
    }
  }
}`);

export async function getSettingsData() {
  const { data } = await sanityFetch({ query: SETTINGS_QUERY });
  return data;
}

export type SettingsData = NonNullable<Awaited<ReturnType<typeof getSettingsData>>>;