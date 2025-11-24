import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import type { FOOTER_QUERYResult } from "@/sanity/types";

const FOOTER_QUERY = defineQuery(`*[_type == "footer"][0]{
  logoDesktop {
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
  logoMobile {
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
  column1 {
    showLanguageSwitch,
    termsPageEN->{
      name,
      slug
    },
    termsPageFR->{
      name,  
      slug
    }
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
  },
  "settingsSocial": *[_type == "settings"][0].socialMedia[] {
    platform,
    url
  },
}`);

export type FooterData = FOOTER_QUERYResult;

export async function getFooterData(): Promise<FOOTER_QUERYResult | null> {
  const { data } = await sanityFetch({ query: FOOTER_QUERY });
  return data;
}
