"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import type { NAVBAR_QUERYResult } from "@/sanity/types";

interface ConditionalNavbarProps {
  navbarData: NAVBAR_QUERYResult | null;
}

export default function ConditionalNavbar({ navbarData }: ConditionalNavbarProps) {
  const pathname = usePathname();

  const isHomePage = pathname === "/" || pathname === "/en";

  const lng = pathname.startsWith("/en") ? "en" : "fr";

  // Only render navbar on non-home pages (home pages handle it via ComponentRenderer)
  if (isHomePage || !navbarData) {
    return null;
  }

  return <Navbar data={navbarData} lng={lng} />;
}
