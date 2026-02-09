import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import type { PROJECTS_QUERYResult } from "@/sanity/types";

const PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(date desc) {
  _id,
  name,
  slug,
  shortDescription,
  date,
  projectSummary,
  projectDescription,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt,
    hotspot,
    crop
  },
  "previewImages": previewImages[]{
    ..., 
    asset->,
    isFeatured,
    showOnMobile,
    isFeaturedMobile
  },
  projectGallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt,
    hotspot,
    crop,
    showInGrid,
    gridSpan
  }
}`);

const PROJECTS_ORDER_QUERY = defineQuery(`*[_type == "projectsOrder"][0].orderedProjects[]-> {
  _id,
  name,
  slug,
  shortDescription,
  date,
  projectSummary,
  projectDescription,
  mainImage {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt,
    hotspot,
    crop
  },
  "previewImages": previewImages[]{
    ...,
    asset->,
    isFeatured,
    showOnMobile,
    isFeaturedMobile
  },
  projectGallery[] {
    asset-> {
      _id,
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    },
    alt,
    hotspot,
    crop,
    showInGrid,
    gridSpan
  }
}`);

export type ProjectsData = PROJECTS_QUERYResult;

export async function getProjectsData(): Promise<PROJECTS_QUERYResult | null> {
  const { data: orderedProjects } = await sanityFetch({ query: PROJECTS_ORDER_QUERY });

  if (orderedProjects && orderedProjects.length > 0) {
    return orderedProjects as PROJECTS_QUERYResult;
  }

  const { data } = await sanityFetch({ query: PROJECTS_QUERY });
  return data;
}
