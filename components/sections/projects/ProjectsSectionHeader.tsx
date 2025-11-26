import Link from "next/link";
import { NavArrow } from "../../Icons";
import TransitionLink from "@/components/utils/TransitionLink";

interface ProjectsSectionHeaderProps {
  title: string;
  viewAllLinkText: string;
  projectsPageSlug: string;
  currentLanguage: "en" | "fr";
}

export default function ProjectsSectionHeader({
  title,
  viewAllLinkText,
  projectsPageSlug,
  currentLanguage,
}: ProjectsSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="h2 text-[#140D01]">{title}</h2>
      <TransitionLink
        className="nav hidden items-center gap-3 md:flex"
        href={`/${currentLanguage === "en" ? "en/" : ""}${projectsPageSlug}`}
      >
        {viewAllLinkText}
        <NavArrow />
      </TransitionLink>
    </div>
  );
}
