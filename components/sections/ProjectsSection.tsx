import ProjectsSectionHeader from "./projects/ProjectsSectionHeader";
import ProjectCard from "./projects/ProjectCard";
import { Link } from "next-view-transitions";
import { NavArrow } from "../Icons";

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
    previewImages: Array<{
      _key: string;
      _type: "image";
      asset?: {
        _ref: string;
        _type: "reference";
      };
      isFeatured?: boolean;
      showOnMobile?: boolean;
      isFeaturedMobile?: boolean;
    }>;
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
    <div className="flex flex-col gap-4 px-2.5 md:gap-5 md:px-5">
      <ProjectsSectionHeader
        title={data.title}
        viewAllLinkText={data.viewAllLinkText}
        projectsPageSlug={data.projectsPageLink.slug.current}
        currentLanguage={currentLanguage}
      />

      <div className="flex flex-col gap-4 md:gap-5">
        {data.selectedProjects?.map((project, index) => (
          <ProjectCard
            key={`${project._id}-${index}`}
            project={project}
            projectLinkText={data.projectLinkText}
            projectsPageSlug={data.projectsPageLink.slug.current}
            currentLanguage={currentLanguage}
          />
        ))}
      </div>

      <Link
        className="nav flex items-center justify-end gap-3 md:hidden"
        href={`/${currentLanguage}/${data.projectsPageLink.slug.current}`}
      >
        {data.viewAllLinkText}
        <NavArrow />
      </Link>
    </div>
  );
}
