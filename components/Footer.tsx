"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { usePathname } from "next/navigation";
import type { FOOTER_QUERYResult } from "@/sanity/types";
import TransitionLink from "./utils/TransitionLink";

interface FooterProps {
  data: FOOTER_QUERYResult | null;
}

export default function Footer({ data }: FooterProps) {
  const pathname = usePathname();
  const currentLanguage = pathname.startsWith("/en") ? "en" : "fr";

  if (!data) {
    return null;
  }

  const termsPage =
    currentLanguage === "en" ? data.column1?.termsPageEN : data.column1?.termsPageFR;

  const logo = data.logoDesktop;
  const mobileLogo = data.logoMobile;

  return (
    <footer className="mt-[140px] flex flex-col bg-[#140D01] px-2.5 text-[#F9F7F6] md:px-5">
      {logo?.asset && mobileLogo?.asset && (
        <>
          <Image
            src={urlFor(logo).quality(100).url()}
            alt={logo.alt || "Footer Logo"}
            width={logo.asset.metadata?.dimensions?.width || 150}
            height={logo.asset.metadata?.dimensions?.height || 50}
            className="mt-9 mb-[52px] hidden h-auto w-full object-contain sm:block"
            unoptimized
          />

          <Image
            src={urlFor(mobileLogo).quality(100).url()}
            alt={mobileLogo.alt || "Footer Logo"}
            width={mobileLogo.asset.metadata?.dimensions?.width || 150}
            height={mobileLogo.asset.metadata?.dimensions?.height || 50}
            className="opbject-contain mt-5 mb-[70px] block h-auto w-full sm:hidden"
            unoptimized
          />
        </>
      )}

      <div className="flex justify-between md:flex-wrap lg:gap-x-24">
        <div className="flex w-1/2 flex-col justify-between gap-1 md:w-[255px]">
          {data.column1?.showLanguageSwitch && (
            <TransitionLink href={currentLanguage === "en" ? "/" : "/en"} className="infos">
              Switch to{" "}
              <span className="text-[#ffffff70]">
                {currentLanguage === "en" ? "Français" : "English"}
              </span>
            </TransitionLink>
          )}

          {termsPage && termsPage.slug?.current && (
            <TransitionLink
              href={`/${currentLanguage === "en" ? "en/" : ""}${termsPage.slug.current}`}
              className="infos"
            >
              {currentLanguage === "en" ? "Terms of Service" : "Conditions Générales"}
            </TransitionLink>
          )}
        </div>

        <div className="flex w-1/2 flex-col gap-1 lg:hidden lg:w-[255px]">
          {data.settingsSocial?.map((social) =>
            social.url ? (
              <Link
                key={social.platform}
                href={social.url}
                className="infos"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.platform}
              </Link>
            ) : null,
          )}
        </div>

        <div className="hidden flex-wrap gap-24 lg:flex">
          {data.settingsContact?.headOfDesign && (
            <div className="flex w-[255px] flex-col gap-1">
              <a href={`mailto:${data.settingsContact.headOfDesign.email}`} className="infos">
                {data.settingsContact.headOfDesign.email}
              </a>
              <a href={`tel:${data.settingsContact.headOfDesign.phone}`} className="infos">
                {data.settingsContact.headOfDesign.phone}
              </a>
            </div>
          )}

          <div className="flex w-[255px] flex-col gap-1">
            {data.settingsSocial?.map((social) =>
              social.url ? (
                <Link
                  key={social.platform}
                  href={social.url}
                  className="infos"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.platform}
                </Link>
              ) : null,
            )}
          </div>
        </div>
      </div>

      {data.settingsContact?.headOfDesign && (
        <div className="mt-[170px] flex flex-col gap-3.5 lg:hidden">
          <a href={`tel:${data.settingsContact.headOfDesign.phone}`} className="infos">
            {data.settingsContact.headOfDesign.phone}
          </a>
          <a href={`mailto:${data.settingsContact.headOfDesign.email}`} className="infos">
            {data.settingsContact.headOfDesign.email}
          </a>
        </div>
      )}

      <div className="mt-[26px] flex flex-col gap-2 lg:mt-[200px]">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.44) 0%, rgba(0, 0, 0, 0.44) 100%), rgba(243, 244, 238, 0.50)",
          }}
        ></div>

        <div className="flex flex-col justify-between pb-3 sm:flex-row sm:items-center md:pb-4">
          <p className="tiny">
            {currentLanguage === "en" 
              ? "© 2025 Atelier Philibert. All Rights Reserved." 
              : "© 2025 Atelier Philibert. Tous droits réservés."}
          </p>

          <p className="tiny">Website credits</p>
        </div>
      </div>
    </footer>
  );
}
