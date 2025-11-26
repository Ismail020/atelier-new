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

export type ProjectsData = PROJECTS_QUERYResult;

export async function getProjectsData(): Promise<PROJECTS_QUERYResult | null> {
  const { data } = await sanityFetch({ query: PROJECTS_QUERY });
  return data;
}
