import Link from "next/link";
import { NavArrow } from "../../Icons";
import { SanityImageArray } from "@/types/sanity";
import ProjectImageGrid from "./ProjectImageGrid";
import TransitionLink from "@/components/utils/TransitionLink";

interface ProjectCardProps {
  project: {
    _id: string;
    name: string;
    date: string;
    slug: { current: string };
    previewImages: SanityImageArray;
  };
  projectLinkText: string;
  projectsPageSlug: string;
  currentLanguage: "en" | "fr";
}

export default function ProjectCard({
  project,
  projectLinkText,
  projectsPageSlug,
  currentLanguage,
}: ProjectCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <ProjectImageGrid images={project.previewImages} projectName={project.name} />

      <div className="grid grid-cols-3 md:grid-cols-5">
        <h3 className="infos text-[#140D01]">{project.name}</h3>
        <p className="infos text-[#CECECE]">
          {new Date(project.date).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>

        <div className="flex justify-end md:col-span-3">
          <TransitionLink
            className="buttons flex items-center gap-3"
            href={`/${currentLanguage}/${projectsPageSlug}/${project.slug.current}`}
          >
            <span className="hidden md:block">{projectLinkText}</span>
            <NavArrow />
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
