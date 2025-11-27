import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PROJECT_QUERY } from "@/lib/queries/project";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectGallery from "@/components/sections/projects/ProjectGallery";
import { client } from "@/sanity/lib/client";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    project: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project } = await params;

  const { data: projectData } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { projectSlug: project },
  });

  if (!projectData) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-5">
      <ProjectHero
        image={projectData.mainImage}
        projectName={projectData.name}
        shortDescription={projectData.shortDescription}
        projectSummary={projectData.projectSummary}
      />

      <ProjectGallery gallery={projectData.gallery} galleryLayout={projectData.galleryLayout} />
    </div>
  );
}

export async function generateStaticParams() {
  // Fetch all projects to get their slugs
  const allProjects = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug }`
  );

  const params = [];
  
  // Only generate project routes for the French "Projets" page
  if (allProjects) {
    for (const project of allProjects) {
      if (project.slug?.current) {
        params.push({
          slug: "Projets", // Only under French projects page
          project: project.slug.current,
        });
      }
    }
  }

  return params;
}
