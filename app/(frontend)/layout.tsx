import type { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { NavbarProvider } from "@/components/NavbarContext";
import { getNavbarData } from "@/lib/navbar";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Footer from "@/components/Footer";
import { getFooterData } from "@/lib/footer";

export const metadata: Metadata = {
  title: "Atelier Nextshift",
  description: "Creative design studio",
};

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const navbarData = await getNavbarData();
  const foooterData = await getFooterData();

  return (
    <NavbarProvider navbarData={navbarData}>
      <SmoothScrollProvider />
      <div className="relative">
        <ConditionalNavbar navbarData={navbarData} />
        <main className="relative">{children}</main>
        <Footer data={foooterData} />
        <SanityLive />
      </div>
    </NavbarProvider>
  );
}
