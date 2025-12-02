import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { SanityImage } from "@/types/sanity";

interface ProjectImageWithFeatured extends SanityImage {
  isFeatured?: boolean;
  showOnMobile?: boolean;
  isFeaturedMobile?: boolean;
}

interface ProjectImageGridProps {
  images: ProjectImageWithFeatured[];
  projectName: string;
}

export default function ProjectImageGrid({ images, projectName }: ProjectImageGridProps) {
  function getImageDimensions() {
    if (typeof window === "undefined") return { w: 285, h: 386 };

    const vw = window.innerWidth;
    const containerPadding = 40;
    const gap = 6;
    const availableWidth = vw - containerPadding;

    // Use different column counts for mobile vs desktop
    const isMobile = vw < 768;
    const columns = isMobile ? 3 : 5;
    const gaps = isMobile ? 2 : 4; // n-1 gaps between columns

    const imageWidth = (availableWidth - gaps * gap) / columns;

    const aspectRatio = 285 / 386;
    const imageHeight = imageWidth / aspectRatio;

    return {
      w: Math.round(imageWidth),
      h: Math.round(imageHeight),
    };
  }

  const { w, h } = getImageDimensions();

  const renderImageGrid = (isMobile: boolean) => {
    // For mobile: filter images that should show on mobile, for desktop: use all images
    const currentImages = isMobile
      ? images.filter((img) => img.showOnMobile !== false).slice(0, 3)
      : images.slice(0, 4);

    return currentImages.map((image: ProjectImageWithFeatured, index: number) => {
      // Get the correct featured status based on screen size
      const isFeatured = isMobile ? image.isFeaturedMobile : image.isFeatured;

      // Calculate dimensions based on whether image is featured and screen size
      const baseWidth = isMobile
        ? typeof window !== "undefined"
          ? (window.innerWidth - 40 - 12) / 3
          : 120
        : w;
      const imageWidth = isFeatured ? baseWidth * 2 + 6 : baseWidth; // 2x width + gap for featured
      const imageHeight = isFeatured
        ? Math.round(imageWidth * 0.6)
        : isMobile
          ? Math.round(baseWidth / 0.74)
          : h;

      return (
        <div
          key={`${isMobile ? "mobile" : "desktop"}-${index}`}
          className={`overflow-hidden ${isFeatured ? "col-span-2" : "col-span-1 aspect-[0.740]"}`}
        >
          <Image
            src={urlFor(image).width(Math.round(imageWidth)).height(Math.round(imageHeight)).url()}
            alt={`${projectName} preview ${index + 1}`}
            width={Math.round(imageWidth)}
            height={Math.round(imageHeight)}
            className="h-full w-full rounded-sm object-cover"
            unoptimized
            loading="lazy"
            // placeholder="blur"
            // blurDataURL={image.asset?.metadata?.lqip}
          />
        </div>
      );
    });
  };

  return (
    <>
      {/* Mobile Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-1.5 md:hidden">{renderImageGrid(true)}</div>

      {/* Desktop Grid - 5 columns */}
      <div className="hidden gap-1.5 md:grid md:grid-cols-5">{renderImageGrid(false)}</div>
    </>
  );
}
