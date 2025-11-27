import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PROJECT_QUERY } from "@/lib/queries/project";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import { client } from "@/sanity/lib/client";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    project: string;
  }>;
}

export default async function ProjectPageEN({ params }: ProjectPageProps) {
  const { project } = await params;

  const { data: projectData } = await sanityFetch({
    query: PROJECT_QUERY,
    params: { projectSlug: project },
  });

  if (!projectData) {
    notFound();
  }

  // Get the first preview image as hero image
  const heroImage = projectData.previewImages?.find((img: any) => img.isFeatured) || projectData.previewImages?.[0];

  return (
    <div>
      {heroImage && (
        <ProjectHero 
          image={heroImage} 
          projectName={projectData.name} 
        />
      )}
      {/* Rest of project page content goes here */}
    </div>
  );
}

export async function generateStaticParams() {
  // Fetch all projects to get their slugs
  const allProjects = await client.fetch(
    `*[_type == "project" && defined(slug.current)]{ slug }`
  );

  const params = [];
  
  // Only generate project routes for the English "Projects" page
  if (allProjects) {
    for (const project of allProjects) {
      if (project.slug?.current) {
        params.push({
          slug: "projects", // Only under English projects page
          project: project.slug.current,
        });
      }
    }
  }

  return params;
}