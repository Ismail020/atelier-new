import Link from "next/link";
import { NavArrow } from "../../Icons";

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
      <Link
        className="nav flex items-center gap-3"
        href={`/${currentLanguage}/${projectsPageSlug}`}
      >
        {viewAllLinkText}
        <NavArrow />
      </Link>
    </div>
  );
}