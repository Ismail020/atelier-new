import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { NAVBAR_QUERYResult } from "@/sanity/types";

interface NavbarProps {
  data: NAVBAR_QUERYResult;
  currentLanguage?: "en" | "fr";
}

export default function Navbar({ data, currentLanguage = "en" }: NavbarProps) {
  if (!data?.navbarStructure) {
    return null;
  }

  const menuItems =
    currentLanguage === "en"
      ? data.navbarStructure.menuItems?.menuItemsEN
      : data.navbarStructure.menuItems?.menuItemsFR;

  return (
    <nav className="sticky top-0 z-50 bg-[#F9F7F6]">
      <div className="mx-auto px-5">
        <div className="flex h-[62px] items-center justify-between">
          <Link className="flex items-center" href={`/${currentLanguage === "en" ? "en" : ""}`}>
            <span className="nav text-[#140D01]">{data.navbarStructure.brandText}</span>
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
