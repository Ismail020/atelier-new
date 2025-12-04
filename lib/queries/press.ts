import { groq } from "next-sanity";

export const PRESS_QUERY = groq`
  *[_type == "press"] | order(_createdAt desc) {
    _id,
    magazineName,
    media {
      type,
      image {
        asset-> {
          _id,
          url,
          metadata {
            lqip,
            dimensions {
              width,
              height
            }
          }
        },
        alt
      },
      video
    },
    body,
    externalLink,
    _createdAt
  }
`;