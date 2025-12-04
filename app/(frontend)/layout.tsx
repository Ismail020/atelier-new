import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Atelier Nextshift",
  description: "Creative design studio",
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const navbarData = await getNavbarData();
  const footerData = await getFooterData();
  const settingsData = await getSettingsData();

  return (
    <ViewTransitions>
      <PageThemeWrapper>
        <SettingsProvider settingsData={settingsData}>
          <NavbarProvider navbarData={navbarData}>
            <SmoothScrollProvider />
            <div className="relative">
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
