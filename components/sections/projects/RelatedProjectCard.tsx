"use client";

import TransitionLink from "@/components/utils/TransitionLink";
import { Language } from "@/types/TranslationsData";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { useState, useEffect } from "react";
import { RELATED_PROJECTS_QUERYResult } from "@/sanity/types";

interface RelatedProjectCardProps {
  project: RELATED_PROJECTS_QUERYResult[0];
  projectsPageSlug: string;
  lng: Language;
}

function calculateImageSize() {
  if (typeof window === "undefined") {
    return { width: 800, height: 1070 };
  }

  const screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    const padding = 20;
    const containerWidth = screenWidth - padding;
    const height = Math.round(containerWidth * (240 / 373));
    return { width: containerWidth, height };
  } else {
    const padding = 40;
    const gaps = 12;
    const availableWidth = screenWidth - padding - gaps;
    const containerWidth = availableWidth / 3;
    const height = Math.round(containerWidth * (619 / 463));
    return { width: Math.round(containerWidth), height };
  }
}

export default function RelatedProjectCard({
  project,
  projectsPageSlug,
  lng,
}: RelatedProjectCardProps) {
  const [imageSize, setImageSize] = useState(() => calculateImageSize());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setImageSize(calculateImageSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Gebruik altijd dezelfde server-side URL voor hydration
  const serverImageUrl = project.mainImage?.asset
    ? urlFor(project.mainImage).width(800).height(1070).fit("crop").crop("center").url()
    : "";

  // Client-side: gebruik berekende grootte
  const clientImageUrl = project.mainImage?.asset
    ? urlFor(project.mainImage)
        .width(imageSize.width)
        .height(imageSize.height)
        .fit("crop")
        .crop("center")
        .quality(100)
        .url()
    : "";

  // Gebruik server URL totdat mounted, dan switch naar client URL
  const imageUrl = isMounted ? clientImageUrl : serverImageUrl;

  return (
    <div className="flex flex-col gap-1.5">
      <TransitionLink
        href={`/${lng === "en" ? "en/" : ""}${projectsPageSlug}/${project.slug?.current || ""}`}
      >
        <div className="relative aspect-373/240 overflow-hidden rounded-sm bg-gray-100 md:aspect-463/619">
          {project.mainImage?.asset && (
            <Image
              src={imageUrl}
              alt={project.name || ""}
              fill
              className="object-cover"
              unoptimized
              suppressHydrationWarning
            />
          )}
        </div>
      </TransitionLink>

      <div className="grid grid-cols-2">
        <TransitionLink
          className="w-fit"
          href={`/${lng === "en" ? "en/" : ""}${projectsPageSlug}/${project.slug?.current || ""}`}
        >
          <h3 className="infos w-fit text-[#140D01]">{project.name || ""}</h3>
        </TransitionLink>

        <p className="infos text-[#CECECE]">{project.shortDescription}</p>
      </div>
    </div>
  );
}
