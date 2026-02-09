import { defineQuery } from "next-sanity";

export const PAGE_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && slug.current == $slug 
  && language == "fr"
][0]{
  name,
  language,
  components[]{
    ...,
    "images": images[]{..., asset->},
    "mobileImages": mobileImages[]{..., asset->},
    "logo": logo{..., asset->},
    "backgroundImage": backgroundImage{..., asset->},
    "contactUsImage": contactUsImage{..., asset->},
    "mainImage": mainImage{..., asset->},
    "previewImages": previewImages[]{..., asset->},
    "gallery": gallery[]{..., asset->},
    "selectedProjects": selectedProjects[]-> {
      _id,
      _type,
      name,
      slug,
      date,
      shortDescription,
      "previewImages": previewImages[]{
        ..., 
        asset->,
        isFeatured,
        showOnMobile,
        isFeaturedMobile
      },
    },
    "projectsPageLink": projectsPageLink->{
      _id,
      _type,
      name,
      slug
    },
    _type == "contentSection" => {
      section3 {
        ...,
        "image": image{..., asset->},
        "buttonLink": buttonLink->{
          _id,
          _type,
          name,
          slug
        }
      }
    },
    headline[]{
      ...,
      markDefs[]{
        ...,
        "linkToPage": linkToPage->{
          _id,
          _type,
          name,
          slug
        }
      }
    }
  }
}`);

export const PAGE_QUERY_EN = defineQuery(`*[
  _type == "page" 
  && slug.current == $slug 
  && language == "en"
][0]{
  name,
  language,
  components[]{
    ...,
    "images": images[]{..., asset->},
    "mobileImages": mobileImages[]{..., asset->},
    "logo": logo{..., asset->},
    "backgroundImage": backgroundImage{..., asset->},
    "contactUsImage": contactUsImage{..., asset->},
    "mainImage": mainImage{..., asset->},
    "previewImages": previewImages[]{..., asset->},
    "gallery": gallery[]{..., asset->},
    "selectedProjects": selectedProjects[]-> {
      _id,
      _type,
      name,
      slug,
      date,
      shortDescription,
      "previewImages": previewImages[]{
        ..., 
        asset->,
        isFeatured,
        showOnMobile,
        isFeaturedMobile
      },
    },
    "projectsPageLink": projectsPageLink->{
      _id,
      _type,
      name,
      slug
    },
    _type == "contentSection" => {
      section3 {
        ...,
        "image": image{..., asset->},
        "buttonLink": buttonLink->{
          _id,
          _type,
          name,
          slug
        }
      }
    },
    headline[]{
      ...,
      markDefs[]{
        ...,
        "linkToPage": linkToPage->{
          _id,
          _type,
          name,
          slug
        }
      }
    }
  }
}`);
