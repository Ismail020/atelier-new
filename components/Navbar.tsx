"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { NAVBAR_QUERYResult } from "@/sanity/types";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import TransitionLink from "./utils/TransitionLink";
import { Language } from "@/types/TranslationsData";

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  data: NAVBAR_QUERYResult;
  lng: Language;
  theme?: string;
}

export default function Navbar({ data, lng, theme }: NavbarProps) {
  const pathname = usePathname();

  // Determine current language based on pathname
  const isEnglish = pathname.startsWith("/en");
  const [showLogo, setShowLogo] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuClosing, setIsDesktopMenuClosing] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [useWhiteText, setUseWhiteText] = useState(false);
  const [showNavbarBg, setShowNavbarBg] = useState(false);
  const brandTextRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use a timer to avoid synchronous setState in effect
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    const heroHeight = window.innerHeight - 62;
    const isProjectPage = pathname.includes("/projects/") || pathname.includes("/projets/");

    ScrollTrigger.create({
      start: heroHeight,
      end: "bottom bottom",
      onUpdate: (self) => {
        if (self.progress > 0) {
          setShowLogo(true);
          if (isProjectPage) {
            setUseWhiteText(false);
            setShowNavbarBg(true);
          }
        } else {
          setShowLogo(false);
          if (isProjectPage) {
            setUseWhiteText(true);
            setShowNavbarBg(false);
          }
        }
      },
    });

    if (isProjectPage) {
      setUseWhiteText(true);
    }
  }, [pathname]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // GSAP animations for mobile menu open/close
  useGSAP(() => {
    if (!overlayRef.current || !menuContentRef.current) return;

    if (isMobileMenuOpen) {
      // Opening animation
      gsap.set(overlayRef.current, { display: "flex" });

      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      ).fromTo(
        menuContentRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.1",
      );
    } else {
      // Closing animation
      const tl = gsap.timeline();
      tl.to(menuContentRef.current, { y: -50, opacity: 0, duration: 0.3, ease: "power2.in" })
        .to(overlayRef.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "-=0.1")
        .set(overlayRef.current, { display: "none" });
    }
  }, [isMobileMenuOpen]);

  // Desktop menu opening animation
  useGSAP(() => {
    if (!menuRef.current || !isDesktopMenuOpen) return;

    const menuItems = menuRef.current.children;

    // Set initial state for all items
    gsap.set(menuItems, {
      opacity: 0,
      x: 30,
    });

    // Animate each item in with stagger (from last to first)
    gsap.to(menuItems, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: "power2.out",
      stagger: -0.1, // Negative stagger starts from the last item
    });
  }, [isDesktopMenuOpen]);

  const toggleDesktopMenu = () => {
    if (isDesktopMenuOpen && !isDesktopMenuClosing) {
      // Start closing sequence for desktop menu
      setIsDesktopMenuClosing(true);
      if (menuRef.current) {
        const menuItems = menuRef.current.children;
        gsap.to(menuItems, {
          opacity: 0,
          x: 30,
          duration: 0.3,
          ease: "power2.in",
          stagger: 0.05,
          onComplete: () => {
            setIsDesktopMenuOpen(false);
            setIsDesktopMenuClosing(false);
          },
        });
      }
    } else if (!isDesktopMenuOpen) {
      // If opening, show immediately
      setIsDesktopMenuOpen(true);
      setIsDesktopMenuClosing(false);
    }
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen && !isMobileMenuClosing) {
      setIsMobileMenuClosing(true);
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
    } else if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      setIsMobileMenuClosing(false);
    }
  };

  if (!data?.navbarStructure) {
    return null;
  }

  // Check if we're on the home page
  const isHomePage = pathname === "/" || pathname === "/en";

  const menuItems = isEnglish
    ? data.navbarStructure.menuItems?.menuItemsEN
    : data.navbarStructure.menuItems?.menuItemsFR;

  const isProjectPage = pathname.includes("/projects/") || pathname.includes("/projets/");

  const isAtelierPage = pathname === "/l-atelier" || pathname === "/en/atelier";
  const useBlackTheme = theme === "black" || isAtelierPage;

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        useBlackTheme
          ? "bg-[#140D01]"
          : isProjectPage
            ? showNavbarBg
              ? "bg-[#F9F7F6]"
              : "bg-transparent"
            : "bg-[#F9F7F6]"
      }`}
    >
      <div className="mx-auto px-2.5 md:px-5">
        <div className="flex h-[62px] items-center justify-between">
          <TransitionLink
            className={`relative flex items-center ${isHomePage && showLogo ? "w-auto" : ""}`}
            href={`/${lng === "en" ? "en" : ""}`}
          >
            {/* Show brand text only on home page */}
            {isHomePage && !showLogo && (
              <span
                ref={brandTextRef}
                className={`nav whitespace-nowrap transition-opacity duration-300 ${
                  useBlackTheme ? "text-white" : "text-[#140D01]"
                }`}
              >
                {data.navbarStructure.brandText}
              </span>
            )}
            {/* Show logo on all pages, with smooth transitions between black and white versions */}
            {data.navbarStructure.logo?.asset && (
              <div
                className={`relative ${isHomePage && !showLogo ? "absolute left-0 opacity-0" : ""}`}
              >
                {/* Black logo */}
                <Image
                  ref={logoRef}
                  src={urlFor(data.navbarStructure.logo)
                    .width(data.navbarStructure.logo.asset.metadata?.dimensions?.width || 150)
                    .height(data.navbarStructure.logo.asset.metadata?.dimensions?.height || 50)
                    .quality(100)
                    .url()}
                  alt={data.navbarStructure.logo.alt || "Logo"}
                  width={data.navbarStructure.logo.asset.metadata?.dimensions?.width || 150}
                  height={data.navbarStructure.logo.asset.metadata?.dimensions?.height || 50}
                  className={`object-contain transition-opacity duration-500 ${
                    useBlackTheme
                      ? "opacity-0"
                      : isHomePage
                        ? showLogo
                          ? "opacity-100"
                          : "opacity-0"
                        : isProjectPage && useWhiteText && !showNavbarBg
                          ? "opacity-0"
                          : "opacity-100"
                  }`}
                />

                {/* White logo - show if white logo exists and either black theme or project page conditions are met */}
                {(data.navbarStructure as any).logoWhite?.asset &&
                  (useBlackTheme || (isProjectPage && !isHomePage)) && (
                    <Image
                      src={urlFor((data.navbarStructure as any).logoWhite)
                        .width(
                          (data.navbarStructure as any).logoWhite.asset.metadata?.dimensions
                            ?.width || 150,
                        )
                        .height(
                          (data.navbarStructure as any).logoWhite.asset.metadata?.dimensions
                            ?.height || 50,
                        )
                        .quality(100)
                        .url()}
                      alt={(data.navbarStructure as any).logoWhite.alt || "Logo"}
                      width={
                        (data.navbarStructure as any).logoWhite.asset.metadata?.dimensions?.width ||
                        150
                      }
                      height={
                        (data.navbarStructure as any).logoWhite.asset.metadata?.dimensions
                          ?.height || 50
                      }
                      className={`absolute top-0 left-0 object-contain transition-opacity duration-500 ${
                        useBlackTheme || (useWhiteText && !showNavbarBg)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                  )}
              </div>
            )}
          </TransitionLink>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-4 md:flex">
            {isDesktopMenuOpen && (
              <div ref={menuRef} className="flex items-center gap-4">
                {menuItems?.map((item, index) => (
                  <TransitionLink
                    key={index}
                    href={`/${lng === "en" ? "en/" : ""}${item.page?.slug?.current || "page"}`}
                    className={`nav transition-colors duration-500 ${
                      useBlackTheme
                        ? "text-white/50 hover:text-white"
                        : isProjectPage && useWhiteText
                          ? "text-white/50 hover:text-white"
                          : "text-[#140D01]/20 hover:text-[#140D01]"
                    }`}
                    onNavigationStart={() => setIsDesktopMenuOpen(false)}
                  >
                    {item.page?.name || "Page"}
                  </TransitionLink>
                ))}
              </div>
            )}
            <button
              onClick={toggleDesktopMenu}
              className={`nav w-fit cursor-pointer transition-colors duration-500 ${
                useBlackTheme
                  ? "text-white"
                  : isProjectPage && useWhiteText
                    ? "text-white"
                    : "text-[#140D01]"
              }`}
            >
              {isDesktopMenuOpen && !isDesktopMenuClosing
                ? isEnglish
                  ? "Close"
                  : "Fermer"
                : "Menu"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className={`nav w-fit cursor-pointer transition-colors duration-500 md:hidden ${
              useBlackTheme
                ? "text-white"
                : isProjectPage && useWhiteText
                  ? "text-white"
                  : "text-[#140D01]"
            }`}
          >
            {isMobileMenuOpen && !isMobileMenuClosing ? (isEnglish ? "Close" : "Fermer") : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile Fullscreen Menu Portal */}
      {isMounted &&
        createPortal(
          <div
            ref={overlayRef}
            className="fixed inset-0 z-50 hidden flex-col bg-[#140D01] px-2.5 py-4 md:hidden"
            style={{ display: "none" }}
          >
            {/* Menu Content */}
            <div ref={menuContentRef} className="flex h-full w-full flex-col justify-between">
              <div className="flex justify-between">
                <TransitionLink
                  href={`/${isEnglish ? "en" : ""}`}
                  className="flex items-center text-[#F9F7F6]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {(
                    data.navbarStructure as unknown as {
                      logoWhite?: {
                        asset?: {
                          metadata?: { dimensions?: { width?: number; height?: number } };
                        };
                        alt?: string;
                      };
                    }
                  ).logoWhite?.asset ? (
                    <Image
                      src={urlFor(
                        (
                          data.navbarStructure as unknown as {
                            logoWhite: { asset: { _id: string; url: string } };
                          }
                        ).logoWhite,
                      )
                        .height(
                          (
                            data.navbarStructure as unknown as {
                              logoWhite: {
                                asset: { metadata?: { dimensions?: { height?: number } } };
                              };
                            }
                          ).logoWhite.asset.metadata?.dimensions?.height || 50,
                        )
                        .width(
                          (
                            data.navbarStructure as unknown as {
                              logoWhite: {
                                asset: { metadata?: { dimensions?: { width?: number } } };
                              };
                            }
                          ).logoWhite.asset.metadata?.dimensions?.width || 150,
                        )
                        .url()}
                      alt={
                        (data.navbarStructure as unknown as { logoWhite: { alt?: string } })
                          .logoWhite.alt || "Logo"
                      }
                      width={
                        (
                          data.navbarStructure as unknown as {
                            logoWhite: {
                              asset: { metadata?: { dimensions?: { width?: number } } };
                            };
                          }
                        ).logoWhite.asset.metadata?.dimensions?.width || 150
                      }
                      height={
                        (
                          data.navbarStructure as unknown as {
                            logoWhite: {
                              asset: { metadata?: { dimensions?: { height?: number } } };
                            };
                          }
                        ).logoWhite.asset.metadata?.dimensions?.height || 50
                      }
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="nav text-[#F9F7F6]">{data.navbarStructure.brandText}</span>
                  )}
                </TransitionLink>

                {/* Close button */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <p className="nav text-[#F9F7F6] select-none">{isEnglish ? "Close" : "Fermer"}</p>
                </button>
              </div>

              <div className="flex flex-col gap-[22px]">
                {menuItems?.map((item, index) => (
                  <TransitionLink
                    key={index}
                    href={`/${lng === "en" ? "en/" : ""}${item.page?.slug?.current || "page"}`}
                    className="w-fit"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.mobileImage && item.mobileImage.asset ? (
                      <Image
                        src={urlFor(item.mobileImage)
                          .height(
                            (
                              item.mobileImage.asset as unknown as {
                                metadata?: { dimensions?: { height?: number } };
                              }
                            ).metadata?.dimensions?.height || 50,
                          )
                          .width(
                            (
                              item.mobileImage.asset as unknown as {
                                metadata?: { dimensions?: { width?: number } };
                              }
                            ).metadata?.dimensions?.width || 150,
                          )
                          .quality(100)
                          .url()}
                        alt={(item.mobileImage as unknown as { alt?: string }).alt || "Menu item"}
                        width={
                          (
                            item.mobileImage.asset as unknown as {
                              metadata?: { dimensions?: { width?: number } };
                            }
                          ).metadata?.dimensions?.width || 150
                        }
                        height={
                          (
                            item.mobileImage.asset as unknown as {
                              metadata?: { dimensions?: { height?: number } };
                            }
                          ).metadata?.dimensions?.height || 50
                        }
                        className="object-contain"
                        unoptimized
                      />
                    ) : (
                      <span className="h2-display text-[#F9F7F6]">{item.page?.name || "Page"}</span>
                    )}
                  </TransitionLink>
                ))}
              </div>

              <div className="nav flex flex-col gap-2 text-[#F9F7F6]">
                {/* Social Media Links */}
                {(
                  data as { settingsSocial?: Array<{ platform: string; url: string }> }
                ).settingsSocial?.map((social) =>
                  social.url ? (
                    <Link
                      key={social.platform}
                      href={social.url}
                      className="infos w-fit text-[#F9F7F6]/70 transition-colors hover:text-[#F9F7F6]"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {social.platform}
                    </Link>
                  ) : null,
                )}

                {/* Terms/Conditions Page Link */}
                {(
                  data as {
                    termsPageEN?: { slug: { current: string } };
                    termsPageFR?: { slug: { current: string } };
                  }
                ).termsPageEN ||
                (
                  data as {
                    termsPageEN?: { slug: { current: string } };
                    termsPageFR?: { slug: { current: string } };
                  }
                ).termsPageFR ? (
                  <TransitionLink
                    href={`/${isEnglish ? "en/" : ""}${
                      isEnglish
                        ? (data as { termsPageEN?: { slug: { current: string } } }).termsPageEN
                            ?.slug?.current
                        : (data as { termsPageFR?: { slug: { current: string } } }).termsPageFR
                            ?.slug?.current
                    }`}
                    className="infos w-fit text-[#F9F7F6]/70 transition-colors hover:text-[#F9F7F6]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {isEnglish ? "Terms of Service" : "Conditions Générales"}
                  </TransitionLink>
                ) : null}
              </div>

              <div className="nav flex items-end justify-between text-[#F9F7F6]">
                {/* Contact Info */}
                <div className="flex flex-col gap-1">
                  {(
                    data as unknown as {
                      settingsContact?: { headOfDesign?: { email: string; phone: string } };
                    }
                  ).settingsContact?.headOfDesign?.email && (
                    <a
                      href={`mailto:${(data as unknown as { settingsContact: { headOfDesign: { email: string } } }).settingsContact.headOfDesign.email}`}
                      className="infos w-fit text-[#F9F7F6]/70 transition-colors hover:text-[#F9F7F6]"
                    >
                      {
                        (
                          data as unknown as {
                            settingsContact: { headOfDesign: { email: string } };
                          }
                        ).settingsContact.headOfDesign.email
                      }
                    </a>
                  )}
                  {(data as unknown as { settingsContact?: { headOfDesign?: { phone: string } } })
                    .settingsContact?.headOfDesign?.phone && (
                    <a
                      href={`tel:${(data as unknown as { settingsContact: { headOfDesign: { phone: string } } }).settingsContact.headOfDesign.phone}`}
                      className="infos w-fit text-[#F9F7F6]/70 transition-colors hover:text-[#F9F7F6]"
                    >
                      {
                        (
                          data as unknown as {
                            settingsContact: { headOfDesign: { phone: string } };
                          }
                        ).settingsContact.headOfDesign.phone
                      }
                    </a>
                  )}
                </div>

                {/* Language Switcher */}
                <TransitionLink
                  href={isEnglish ? "/" : "/en"}
                  className="infos w-fit text-[#F9F7F6]/70 transition-colors hover:text-[#F9F7F6]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {isEnglish ? "Français" : "English"}
                </TransitionLink>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </nav>
  );
}
