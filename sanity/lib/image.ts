import createImageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { SanityImage } from "@/types/sanity";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource, quality: number = 80) => {
  return builder.image(source).quality(quality).auto("format");
};

export const getImageWidth = (image: SanityImage): number | undefined => {
  return image?.asset?.metadata?.dimensions?.width;
};

export const getImageHeight = (image: SanityImage): number | undefined => {
  return image?.asset?.metadata?.dimensions?.height;
};

export const hasImageDimensions = (image: SanityImage): boolean => {
  return !!(
    image?.asset?.metadata?.dimensions?.width && image?.asset?.metadata?.dimensions?.height
  );
};
