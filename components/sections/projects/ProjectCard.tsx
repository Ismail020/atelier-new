import { NavArrow } from "../../Icons";
import { SanityImageArray } from "@/types/sanity";
import ProjectImageGrid from "./ProjectImageGrid";
import TransitionLink from "@/components/utils/TransitionLink";
import { Language } from "@/types/TranslationsData";

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
  lng: Language;
}

export default function ProjectCard({
  project,
  projectLinkText,
  projectsPageSlug,
  lng,
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
            href={`/${lng === "en" ? "en/" : ""}${projectsPageSlug}/${project.slug.current}`}
          >
            <span className="hidden md:block">{projectLinkText}</span>
            <NavArrow />
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
