import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PROJECT_QUERY, SETTINGS_QUERY, RELATED_PROJECTS_QUERY } from "@/lib/queries/project";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectGallery from "@/components/sections/projects/ProjectGallery";
import { client } from "@/sanity/lib/client";
import ProjectDescription from "@/components/sections/projects/ProjectDescription";
import RelatedProjects from "@/components/sections/projects/RelatedProjects";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    project: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project } = await params;
  const lng = "fr";

  const [{ data: projectData }, { data: settingsData }] = await Promise.all([
    sanityFetch({
      query: PROJECT_QUERY,
      params: { projectSlug: project },
    }),
    sanityFetch({
      query: SETTINGS_QUERY,
    }),
  ]);

  if (!projectData) {
    notFound();
  }

  const { data: relatedProjectsData } = await sanityFetch({
    query: RELATED_PROJECTS_QUERY,
    params: { currentProjectId: projectData._id },
  });

  return (
    <div className="mb-[100px] flex flex-col gap-5 md:mb-[140px]">
      <ProjectHero data={projectData} lng={lng} />

      <ProjectGallery gallery={projectData.gallery} galleryLayout={projectData.galleryLayout} />

      <ProjectDescription data={projectData} lng={lng} settings={settingsData} />

      <RelatedProjects
        projects={relatedProjectsData || []}
        lng={lng}
        viewAllLinkText={settingsData?.viewAllLinkText}
        projectsPageSlug="projets"
        relatedProjectsTitle={settingsData?.relatedProjectsTitle}
      />
    </div>
  );
}

export async function generateStaticParams() {
  const allProjects = await client.fetch(`*[_type == "project" && defined(slug.current)]{ slug }`);

  const params = [];

  // Only generate project routes for the French "Projets" page
  if (allProjects) {
    for (const project of allProjects) {
      if (project.slug?.current) {
        params.push({
          slug: "projets",
          project: project.slug.current,
        });
      }
    }
  }

  return params;
}
