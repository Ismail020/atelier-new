"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { NAVBAR_QUERYResult } from "@/sanity/types";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  data: NAVBAR_QUERYResult;
  currentLanguage?: "en" | "fr";
}

export default function Navbar({ data, currentLanguage = "en" }: NavbarProps) {
  const [showLogo, setShowLogo] = useState(false);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const heroHeight = window.innerHeight - 62;

    ScrollTrigger.create({
      start: heroHeight,
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.progress > 0) {
          setShowLogo(true);
        } else {
          setShowLogo(false);
        }
      },
    });
  }, []);

  if (!data?.navbarStructure) {
    return null;
  }

  const menuItems =
    currentLanguage === "en"
      ? data.navbarStructure.menuItems?.menuItemsEN
      : data.navbarStructure.menuItems?.menuItemsFR;

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F7F6]">
      <div className="mx-auto px-2.5 md:px-5">
        <div className="flex h-[62px] items-center justify-between">
          <Link
            className="relative flex items-center"
            href={`/${currentLanguage === "en" ? "en" : ""}`}
          >
            <span
              ref={brandTextRef}
              className={`nav text-[#140D01] transition-opacity duration-300 ${showLogo ? "opacity-0" : "opacity-100"}`}
            >
              {data.navbarStructure.brandText}
            </span>
            {data.navbarStructure.logo && data.navbarStructure.logo.asset && (
              <Image
                ref={logoRef}
                src={urlFor(data.navbarStructure.logo).height(40).url()}
                alt={data.navbarStructure.logo.alt || "Logo"}
                width={data.navbarStructure.logo.asset.metadata?.dimensions?.width || 150}
                height={data.navbarStructure.logo.asset.metadata?.dimensions?.height || 50}
                className={`absolute left-0 object-contain transition-opacity duration-300 ${showLogo ? "opacity-100" : "opacity-0"}`}
                unoptimized
              />
            )}
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            {menuItems?.map((item, index) => (
              <Link
                key={index}
                href={`/${currentLanguage === "en" ? "en/" : ""}${item.page?.name?.toLowerCase().replace(/\s+/g, "-") || "page"}`}
                className="nav text-opacity-50 text-[#140D01]/20 hover:text-[#140D01]"
              >
                {item.page?.name || "Page"}
              </Link>
            ))}
            <p className="nav text-[#140D01]">Close</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
