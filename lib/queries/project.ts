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
  seoTitle,
  seoDescription,
  noIndex,
  seoImage{
    asset-> {
      url
    }
  },
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

export const SETTINGS_QUERY = defineQuery(`*[_type == "settings"][0]{
  contactUsButton{
    text,
    contactPages{
      english->{slug},
      french->{slug}
    },
    buttonStyle
  },
  relatedProjectsTitle,
  viewAllLinkText,
  seoDefaultImage {
    asset-> {
      url
    }
  }
}`);

export const RELATED_PROJECTS_QUERY = defineQuery(`*[
  _type == "project" 
  && _id != $currentProjectId
  && defined(slug.current)
]{
  _id,
  name,
  slug,
  date,
  shortDescription,
  mainImage{
    ...,
    asset->
  }
} | order(_createdAt desc) [0...10]`);
