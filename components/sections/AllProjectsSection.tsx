"use client";

import { useState, useEffect } from "react";
import HeadlineSection, { HeadlineSectionData } from "./HeadlineSection";
import ProjectCard from "./projects/ProjectCard";
import { Language } from "@/types/TranslationsData";

export interface AllProjectsSectionData {
  _key: string;
  _type: string;
  headline: HeadlineSectionData["headline"];
  projectLinkText: string;
  projectsSource: boolean;
  projectsPageLink: {
    slug: { current: string };
  };
}

interface Project {
  _id: string;
  name: string;
  slug: { current: string };
  shortDescription: string;
  date: string;
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
  mainImage?: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  };
}

interface AllProjectsSectionProps {
  data: AllProjectsSectionData;
  lng: Language;
}

export default function AllProjectsSection({ data, lng }: AllProjectsSectionProps) {
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/projects");
        const result = await response.json();

        if (result.success) {
          setProjectsData(result.data || []);
        } else {
          setError(result.error || "Failed to fetch projects");
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to fetch projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return (
      <div>
        <HeadlineSection data={{ ...data, _key: data._key, _type: "headlineSection" }} lng={lng} />
        <div className="flex justify-center py-8">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <HeadlineSection lng={lng} data={{ ...data, _key: data._key, _type: "headlineSection" }} />
        <div className="flex justify-center py-8">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeadlineSection lng={lng} data={{ ...data, _key: data._key, _type: "headlineSection" }} />

      <div className="flex flex-col gap-4 px-2.5 md:gap-5 md:px-5">
        {projectsData?.map((project, index) => (
          <ProjectCard
            key={`${project._id}-${index}`}
            project={project}
            projectLinkText={data.projectLinkText}
            projectsPageSlug={data.projectsPageLink.slug.current}
            lng={lng}
          />
        ))}
      </div>
    </div>
  );
}
