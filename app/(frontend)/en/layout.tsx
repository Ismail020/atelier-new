import type { Metadata } from "next";
import { SanityLive } from "@/sanity/lib/live";
import Navbar from "@/components/Navbar";
import { getNavbarData } from "@/lib/navbar";

export const metadata: Metadata = {
  title: "Atelier Nextshift - English",
  description: "Creative design studio - English version",
};

export default async function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navbarData = await getNavbarData();

  return (
    <div className="relative">
      {navbarData && <Navbar data={navbarData} currentLanguage="en" />}
      <main className="relative pt-16">{children}</main>
      <SanityLive />
    </div>
  );
}