import ProjectsSectionHeader from "./projects/ProjectsSectionHeader";
import ProjectCard from "./projects/ProjectCard";
import { SanityImageArray } from "@/types/sanity";

interface ProjectsSectionData {
  title: string;
  viewAllLinkText: string;
  projectLinkText: string;
  projectsPageLink: {
    slug: { current: string };
  };
  selectedProjects: Array<{
    _id: string;
    name: string;
    date: string;
    slug: { current: string };
    previewImages: SanityImageArray;
  }>;
}

export default function ProjectsSection({
  data,
  currentLanguage = "fr",
}: {
  data: ProjectsSectionData;
  currentLanguage?: "en" | "fr";
}) {
  return (
    <div className="px-5 flex flex-col gap-5">
      <ProjectsSectionHeader
        title={data.title}
        viewAllLinkText={data.viewAllLinkText}
        projectsPageSlug={data.projectsPageLink.slug.current}
        currentLanguage={currentLanguage}
      />

      <div className="flex flex-col gap-5">
        {data.selectedProjects?.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            projectLinkText={data.projectLinkText}
            projectsPageSlug={data.projectsPageLink.slug.current}
            currentLanguage={currentLanguage}
          />
        ))}
      </div>
    </div>
  );
}
