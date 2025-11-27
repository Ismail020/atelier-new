import { defineQuery } from "next-sanity";

export const PROJECT_QUERY = defineQuery(`*[
  _type == "project" 
  && slug.current == $projectSlug
][0]{
  _id,
  name,
  slug,
  date,
  shortDescription,
  projectSummary,
  projectDescription,
  mainImage{
    ...,
    alt,
    asset->
  },
  previewImages[]{
    ...,
    asset->,
    isFeatured,
    showOnMobile,
    isFeaturedMobile
  },
  gallery[]{
    ...,
    asset->
  },
  galleryLayout[]{
    type,
    images
  }
}`);
