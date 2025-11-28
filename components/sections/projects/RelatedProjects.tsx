import { Language } from "@/types/TranslationsData";
import RelatedProjectCard from "./RelatedProjectCard";
import { getLocalizedValue } from "@/utils/getLocalizedValue";
import ProjectsSectionHeader from "./ProjectsSectionHeader";
import { RELATED_PROJECTS_QUERYResult, InternationalizedArrayString } from "@/sanity/types";

type RelatedProject = RELATED_PROJECTS_QUERYResult[0];

interface RelatedProjectsProps {
  projects: RELATED_PROJECTS_QUERYResult;
  lng: Language;
  projectsPageSlug: string;
  relatedProjectsTitle?: InternationalizedArrayString | null;
  viewAllLinkText?: InternationalizedArrayString | null;
}

function getRandomProjects(projects: RelatedProject[], count: number = 3): RelatedProject[] {
  // Filter out projects with null required fields
  const validProjects = projects.filter(
    (project): project is RelatedProject =>
      project.name !== null &&
      project.slug !== null &&
      project.slug.current !== undefined &&
      project.date !== null,
  );

  const shuffled = [...validProjects].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function RelatedProjects({
  projects,
  lng,
  projectsPageSlug,
  relatedProjectsTitle,
  viewAllLinkText,
}: RelatedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const relatedProjects = getRandomProjects(projects, 3);

  return (
    <section className="flex flex-col gap-3.5 px-2.5 pt-[110px] md:px-5 md:pt-[130px]">
      <ProjectsSectionHeader
        title={getLocalizedValue(relatedProjectsTitle, lng)}
        viewAllLinkText={getLocalizedValue(viewAllLinkText, lng) || ""}
        projectsPageSlug={projectsPageSlug}
        lng={lng}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-1.5">
        {relatedProjects.map((project) => (
          <RelatedProjectCard
            key={project._id}
            project={project}
            projectsPageSlug={projectsPageSlug}
            lng={lng}
          />
        ))}
      </div>
    </section>
  );
}
