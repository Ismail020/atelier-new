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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Menu opening animation
  useGSAP(() => {
    if (!menuRef.current || !isMenuOpen) return;

    const menuItems = menuRef.current.children;

    // Set initial state for all items
    gsap.set(menuItems, {
      opacity: 0,
      x: 30,
    });

    // Animate each item in with stagger
    gsap.to(menuItems, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: 0.1, // Delay between each item
    });
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen && !isClosing) {
      // Start closing sequence
      setIsClosing(true);
      if (menuRef.current) {
        const menuItems = menuRef.current.children;
        gsap.to(menuItems, {
          opacity: 0,
          x: 30,
          duration: 0.3,
          ease: "power2.in",
          stagger: 0.05,
          onComplete: () => {
            setIsMenuOpen(false);
            setIsClosing(false);
          }
        });
      }
    } else if (!isMenuOpen) {
      // If opening, show immediately
      setIsMenuOpen(true);
      setIsClosing(false);
    }
  };
  
  if (!data?.navbarStructure) {
    return null;
  }  const menuItems =
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
            {isMenuOpen && (
              <div ref={menuRef} className="flex items-center gap-4">
                {menuItems?.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${currentLanguage === "en" ? "en/" : ""}${item.page?.slug?.current || "page"}`}
                    className="nav text-opacity-50 text-[#140D01]/20 hover:text-[#140D01]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.page?.name || "Page"}
                  </Link>
                ))}
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="nav text-[#140D01] cursor-pointer hover:opacity-70 transition-opacity"
            >
              {(isMenuOpen && !isClosing) ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
