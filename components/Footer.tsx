"use client";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { usePathname } from "next/navigation";
import type { FooterData } from "@/lib/footer";

interface FooterProps {
  data: FooterData | null;
}

export default function Footer({ data }: FooterProps) {
  const pathname = usePathname();
  const currentLanguage = pathname.startsWith("/en") ? "en" : "fr";

  if (!data) {
    return null;
  }

  const termsPage =
    currentLanguage === "en" ? data.column1?.termsPageEN : data.column1?.termsPageFR;

  return (
    <footer className="mt-[140px] flex flex-col bg-[#140D01] px-5 text-[#F9F7F6]">
      <Image
        src={urlFor(data.logoDesktop).url()}
        alt="Footer Logo"
        width={data.logoDesktop.asset.metadata.dimensions.width}
        height={data.logoDesktop.asset.metadata.dimensions.height}
        className="mt-9 mb-[52px] h-auto w-full object-contain"
      />

      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          {data.column1?.showLanguageSwitch && (
            <Link href={currentLanguage === "en" ? "/" : "/en"} className="infos">
              Switch to{" "}
              <span className="text-[#ffffff70]">
                {currentLanguage === "en" ? "Français" : "English"}
              </span>
            </Link>
          )}

          {termsPage && (
            <Link
              href={`/${currentLanguage === "en" ? "en/" : ""}${termsPage.slug.current}`}
              className="infos"
            >
              {currentLanguage === "en" ? "Terms of Service" : "Conditions Générales"}
            </Link>
          )}
        </div>

        {data.settingsContact?.headOfDesign && (
          <div className="flex flex-col gap-1">
            <a href={`mailto:${data.settingsContact.headOfDesign.email}`} className="infos">
              {data.settingsContact.headOfDesign.email}
            </a>
            <a href={`tel:${data.settingsContact.headOfDesign.phone}`} className="infos">
              {data.settingsContact.headOfDesign.phone}
            </a>
          </div>
        )}

        <div className="flex flex-col gap-1">
          {data.settingsSocial?.map((social) => (
            <Link
              key={social.platform}
              href={social.url}
              className="infos"
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.platform}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-[200px] flex flex-col gap-2">
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.44) 0%, rgba(0, 0, 0, 0.44) 100%), rgba(243, 244, 238, 0.50)",
          }}
        ></div>

        <div className="flex items-center justify-between pb-4">
          <p className="tiny">© 2025 Atelier Philibert. All Rights Reserved.</p>

          <p className="tiny">Website credits</p>
        </div>
      </div>
    </footer>
  );
}
