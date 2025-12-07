import { defineQuery } from "next-sanity";

export const HOME_QUERY_FR = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "fr"
][0]{
  ...,
  components[]{
    ...,
    "images": images[]{..., asset->},
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

export const HOME_QUERY_EN = defineQuery(`*[
  _type == "page" 
  && name == "Home" 
  && language == "en"
][0]{
  ...,
  components[]{
    ...,
    "images": images[]{..., asset->},
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
