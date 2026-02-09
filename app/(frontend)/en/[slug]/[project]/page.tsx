import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PROJECT_QUERY, SETTINGS_QUERY, RELATED_PROJECTS_QUERY } from "@/lib/queries/project";
import ProjectHero from "@/components/sections/projects/ProjectHero";
import ProjectGallery from "@/components/sections/projects/ProjectGallery";
import { client } from "@/sanity/lib/client";
import ProjectDescription from "@/components/sections/projects/ProjectDescription";
import RelatedProjects from "@/components/sections/projects/RelatedProjects";
import type { Metadata } from "next";
import { getLocalizedValue } from "@/utils/getLocalizedValue";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
    project: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { project, slug } = await params;

  if (!project || !slug) {
    return {};
  }

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
    return {};
  }

  const title = projectData.seoTitle || projectData.name;
  const localizedSeoDescription = getLocalizedValue(projectData.seoDescription, "en");
  const description = localizedSeoDescription || projectData.shortDescription || undefined;
  const imageUrl =
    projectData.seoImage?.asset?.url || settingsData?.seoDefaultImage?.asset?.url;
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const canonical = `${siteUrl}/en/${slug}/${project}`;

  return {
    title,
    description,
    robots: projectData.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
      languages: {
        fr: `${siteUrl}/${slug}/${project}`,
        en: canonical,
        "x-default": `${siteUrl}/${slug}/${project}`,
      },
    },
    openGraph: imageUrl
      ? {
          images: [{ url: imageUrl }],
        }
      : undefined,
  };
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
        projectsPageSlug="projects"
        relatedProjectsTitle={settingsData?.relatedProjectsTitle}
      />
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
