import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

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

export type FooterData = {
  logoDesktop?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  logoMobile?: {
    asset?: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
  column1?: {
    showLanguageSwitch?: boolean;
    termsPageEN?: {
      name: string;
      slug: { current: string };
    };
    termsPageFR?: {
      name: string;
      slug: { current: string };
    };
  };
  settingsContact?: {
    headOfDesign?: {
      name: string;
      phone: string;
      email: string;
    };
    generalInquiries?: {
      email: string;
    };
  };
  settingsSocial?: Array<{
    platform: string;
    url: string;
  }>;
};

export async function getFooterData(): Promise<FooterData | null> {
  const { data } = await sanityFetch({ query: FOOTER_QUERY });
  return data;
}
