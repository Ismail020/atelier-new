import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PROJECT_QUERY, SETTINGS_QUERY } from "@/lib/queries/project";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectGallery from "@/components/sections/projects/ProjectGallery";
import { client } from "@/sanity/lib/client";
import ProjectDescription from "@/components/sections/projects/ProjectDescription";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    project: string;
  }>;
}

export default async function ProjectPageEN({ params }: ProjectPageProps) {
  const { project } = await params;
  const lng = "en";

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

  return (
    <div className="flex flex-col gap-5">
      <ProjectHero data={projectData} lng={lng} />

      <ProjectGallery gallery={projectData.gallery} galleryLayout={projectData.galleryLayout} />

      <ProjectDescription data={projectData} lng={lng} settings={settingsData} />
    </div>
  );
}

export async function generateStaticParams() {
  const allProjects = await client.fetch(`*[_type == "project" && defined(slug.current)]{ slug }`);

  const params = [];

  // Only generate project routes for the English "Projects" page
  if (allProjects) {
    for (const project of allProjects) {
      if (project.slug?.current) {
        params.push({
          slug: "projects",
          project: project.slug.current,
        });
      }
    }
  }

  return params;
}
