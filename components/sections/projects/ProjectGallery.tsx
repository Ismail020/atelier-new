"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface ProjectImage {
  _key: string;
  _type: string;
  asset: {
    _id: string;
    _type: "sanity.imageAsset";
    _createdAt: string;
    _updatedAt: string;
    _rev: string;
    originalFilename?: string;
    label?: string;
    title?: string;
    description?: string;
    altText?: string;
    sha1hash?: string;
    extension?: string;
    mimeType?: string;
    size?: number;
    assetId?: string;
    uploadId?: string;
    path?: string;
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
      hasAlpha?: boolean;
      isOpaque?: boolean;
      lqip?: string;
      blurHash?: string;
      palette?: {
        dominant?: {
          background?: string;
          foreground?: string;
        };
      };
    };
    source?: Record<string, unknown>;
  } | null;
  alt?: string;
}

interface GalleryRow {
  type: string | null;
  images: string[] | null;
}

interface ProjectGalleryProps {
  gallery?: ProjectImage[] | null;
  galleryLayout?: GalleryRow[] | null;
}

export default function ProjectGallery({ gallery = [], galleryLayout = [] }: ProjectGalleryProps) {
  // Early return if gallery or galleryLayout is null or empty
  if (!gallery || gallery.length === 0 || !galleryLayout || galleryLayout.length === 0) {
    return null;
  }

  // Create a map of images by their _key for easy lookup
  const imageMap = gallery.reduce(
    (acc, image) => {
      acc[image._key] = image;
      return acc;
    },
    {} as Record<string, ProjectImage>,
  );

  interface LayoutRow {
    type: 'row1' | 'row2' | 'row3' | 'row4';
    images: ProjectImage[];
  }

  // Convert galleryLayout (with string keys) to LayoutRow (with ProjectImage objects)
  const desktopLayout: LayoutRow[] = (galleryLayout as any[])
    .map((row) => ({
      type: row.type as 'row1' | 'row2' | 'row3' | 'row4',
      images: (row.images || [])
        .map((key: string) => imageMap[key])
        .filter(Boolean),
    }))
    .filter((row) => row.images.length > 0);

  // Mobile layout: preserve backend order, chunk rows to max 2 images, keep row1 full-width
  const mobileLayout: LayoutRow[] = desktopLayout.flatMap((row) => {
    if (row.type === 'row1') return [row];

    const chunks: LayoutRow[] = [];
    for (let i = 0; i < row.images.length; i += 2) {
      const slice = row.images.slice(i, i + 2);
      if (slice.length === 1) {
        chunks.push({ type: 'row1', images: slice });
      } else {
        chunks.push({ type: row.type, images: slice });
      }
    }
    return chunks;
  });

  const getGridClassDesktop = (type: string) => {
    switch (type) {
      case "row1":
        return "grid-cols-1";
      case "row2":
        return "grid-cols-3";
      case "row3":
        return "grid-cols-2";
      case "row4":
        return "grid-cols-2";
      default:
        return "grid-cols-2";
    }
  };

  const getGridClassMobile = (type: string) => {
    // Mobile: row1 stays 1 col, others max 2 cols
    if (type === "row1") return "grid-cols-1";
    return "grid-cols-2";
  };

  const getImageConfig = (type: string) => {
    switch (type) {
      case "row1":
        return {
          aspectClass: "aspect-[1400/1040]",
          width: 1400,
          height: 1040,
        };
      case "row2":
        return {
          aspectClass: "aspect-[463/627]",
          width: 800,
          height: 1080,
        };
      case "row3":
        return {
          aspectClass: "aspect-[697/518]",
          width: 1200,
          height: 890,
        };
      case "row4":
        return {
          aspectClass: "aspect-[697/936]",
          width: 900,
          height: 1210,
        };
      default:
        return {
          aspectClass: "aspect-4/3",
          width: 1200,
          height: 900,
        };
    }
  };

  const getImageAspectRatio = (image: ProjectImage) => {
    const dims = image.asset?.metadata?.dimensions;
    if (!dims || !dims.width || !dims.height) {
      return {
        aspectClass: "aspect-4/3",
        width: 1200,
        height: 900,
      };
    }

    const ar = dims.width / dims.height;

    // Liggend (horizontal): 4:3 ratio
    if (ar > 1.25 && ar < 1.4) {
      return {
        aspectClass: "aspect-[1400/1040]",
        width: 1400,
        height: 1040,
      };
    }
    // Staand (vertical): 0.75:1 ratio
    else if (ar > 0.7 && ar < 0.8) {
      return {
        aspectClass: "aspect-[463/627]",
        width: 800,
        height: 1080,
      };
    }
    // Default
    return {
      aspectClass: "aspect-4/3",
      width: 1200,
      height: 900,
    };
  };

  return (
    <div className="px-2.5 md:px-5">
      {/* Mobile layout */}
      <div className="space-y-1.5 md:hidden">
        {mobileLayout.map((row, rowIndex) => {
          return (
            <div key={rowIndex} className={`grid ${getGridClassMobile(row.type)} gap-1.5`}>
              {row.images.map((image, imageIndex) => {
                const imageConfig = getImageAspectRatio(image);

                return (
                  <div
                    key={image._key || imageIndex}
                    className="relative overflow-hidden rounded-sm"
                  >
                    <div className={`relative ${imageConfig.aspectClass}`}>
                      <Image
                        src={urlFor(image)
                          .width(imageConfig.width)
                          .height(imageConfig.height)
                          .quality(95)
                          .url()}
                        alt={image.alt || `Gallery image ${rowIndex}-${imageIndex}`}
                        fill
                        className="object-cover transition-opacity duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        loading={rowIndex < 2 ? "eager" : "lazy"}
                        quality={95}
                        unoptimized
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Desktop layout */}
      <div className="hidden space-y-1.5 md:block">
        {desktopLayout.map((row, rowIndex) => {
          const imageConfig = getImageConfig(row.type);
          
          return (
            <div key={rowIndex} className={`grid ${getGridClassDesktop(row.type)} gap-1.5`}>
              {row.images.map((image, imageIndex) => (
                <div key={image._key || imageIndex} className="relative overflow-hidden rounded-sm">
                  <div className={`relative ${imageConfig.aspectClass}`}>
                    <Image
                      src={urlFor(image)
                        .width(imageConfig.width)
                        .height(imageConfig.height)
                        .quality(95)
                        .url()}
                      alt={image.alt || `Gallery image ${rowIndex}-${imageIndex}`}
                      fill
                      className="object-cover transition-opacity duration-300"
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      loading={rowIndex < 2 ? "eager" : "lazy"}
                      quality={95}
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
