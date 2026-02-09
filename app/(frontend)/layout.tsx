import { SanityLive } from "@/sanity/lib/live";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { NavbarProvider } from "@/components/NavbarContext";
import { getNavbarData } from "@/lib/navbar";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Footer from "@/components/Footer";
import { getFooterData } from "@/lib/footer";
import { getSettingsData } from "@/lib/settings";
import { SettingsProvider } from "@/components/SettingsContext";
import { ViewTransitions } from "next-view-transitions";
import PageThemeWrapper from "@/components/PageThemeWrapper";

type StructuredDataSettings = {
  localBusiness?: {
    name?: string;
    url?: string;
    image?: { asset?: { url?: string } };
    address?: {
      addressCountry?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      streetAddress?: string;
    };
    telephone?: string;
  };
  website?: {
    name?: string;
    url?: string;
  };
};

function buildStructuredData(structuredData?: StructuredDataSettings) {
  if (!structuredData) return null;

  const items: Array<Record<string, unknown>> = [];

  if (structuredData.localBusiness?.name || structuredData.localBusiness?.url) {
    const localBusiness = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: structuredData.localBusiness?.name,
      url: structuredData.localBusiness?.url,
      image: structuredData.localBusiness?.image?.asset?.url,
      address: structuredData.localBusiness?.address
        ? {
            "@type": "PostalAddress",
            addressCountry: structuredData.localBusiness.address.addressCountry,
            addressLocality: structuredData.localBusiness.address.addressLocality,
            addressRegion: structuredData.localBusiness.address.addressRegion,
            postalCode: structuredData.localBusiness.address.postalCode,
            streetAddress: structuredData.localBusiness.address.streetAddress,
          }
        : undefined,
      telephone: structuredData.localBusiness?.telephone,
    };

    items.push(localBusiness);
  }

  if (structuredData.website?.name || structuredData.website?.url) {
    items.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: structuredData.website?.name,
      url: structuredData.website?.url,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return JSON.parse(JSON.stringify(items));
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const navbarData = await getNavbarData();
  const footerData = await getFooterData();
  const settingsData = await getSettingsData();
  const structuredData = buildStructuredData(settingsData?.structuredData);

  return (
    <ViewTransitions>
      <PageThemeWrapper>
        <SettingsProvider settingsData={settingsData}>
          <NavbarProvider navbarData={navbarData}>
            <SmoothScrollProvider />
            <div className="relative">
              {structuredData && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                  }}
                />
              )}
              <ConditionalNavbar navbarData={navbarData} />
              <main className="relative">{children}</main>
              <Footer data={footerData} />
              <SanityLive />
            </div>
          </NavbarProvider>
        </SettingsProvider>
      </PageThemeWrapper>
    </ViewTransitions>
  );
}
