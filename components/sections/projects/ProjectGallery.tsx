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
  // Early return if gallery or galleryLayout are null or empty
  if (!gallery || !galleryLayout || galleryLayout.length === 0 || gallery.length === 0) {
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

  return (
    <div className="px-2.5 md:px-5">
      <div className="space-y-1.5">
        {galleryLayout.map((row, rowIndex) => {
          // Skip rows without valid type or images
          if (!row.type || !row.images) return null;
          
          const rowImages = row.images.map((imageKey) => imageMap[imageKey]).filter(Boolean);

          if (rowImages.length === 0) return null;

          const getGridClass = () => {
            // Extract number from row type (e.g., "row2" -> 2)
            if (!row.type) return "grid-cols-1";
            const rowNumber = parseInt(row.type.replace("row", ""));

            switch (rowNumber) {
              case 1:
                return "grid-cols-1";
              case 2:
                return "grid-cols-3";
              case 3:
                return "grid-cols-2";
              case 4:
                return "grid-cols-2";
              default:
                // Auto-determine based on number of images
                if (rowImages.length === 1) return "grid-cols-1";
                if (rowImages.length === 2) return "grid-cols-1 md:grid-cols-2";
                if (rowImages.length === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
                return "grid-cols-2 md:grid-cols-4";
            }
          };

          return (
            <div key={rowIndex} className={`grid ${getGridClass()} gap-1.5`}>
              {rowImages.map((image, imageIndex) => {
                const getImageConfig = () => {
                  if (!row.type) return { aspectClass: "aspect-square", width: 800, height: 800 };
                  const rowNumber = parseInt(row.type.replace("row", ""));

                  switch (rowNumber) {
                    case 1:
                      return {
                        aspectClass: "aspect-[1400/1040]",
                        width: 1400,
                        height: 1040,
                      };
                    case 2:
                      return {
                        aspectClass: "aspect-[463/627]",
                        width: 800,
                        height: 1080,
                      };
                    case 3:
                      return {
                        aspectClass: "aspect-[697/518]",
                        width: 1200,
                        height: 890,
                      };
                    case 4:
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

                const imageConfig = getImageConfig();

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
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading={rowIndex < 2 ? "eager" : "lazy"}
                        // placeholder={image.asset?.metadata?.lqip ? "blur" : "empty"}
                        // blurDataURL={image.asset?.metadata?.lqip || undefined}
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
    </div>
  );
}
