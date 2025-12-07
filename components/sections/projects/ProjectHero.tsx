"use client";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Balancer from "react-wrap-balancer";
import { Language } from "@/types/TranslationsData";
import { getLocalizedValue } from "@/utils/getLocalizedValue";
import type { PROJECT_QUERYResult } from "@/sanity/types";

interface ProjectHeroProps {
  data: PROJECT_QUERYResult;
  lng: Language;
}

export default function ProjectHero({ data, lng }: ProjectHeroProps) {
  if (!data || !data.mainImage?.asset) return null;

  return (
    <div className="relative mt-[-62px] h-screen w-full overflow-hidden">
      <Image
        src={urlFor(data.mainImage)
          .width(data.mainImage.asset?.metadata?.dimensions?.width || 1920)
          .height(data.mainImage.asset?.metadata?.dimensions?.height || 1080)
          .quality(95)
          .url()}
        alt={data.mainImage.alt || `${data.name || "Project"} hero image`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
        fetchPriority="high"
        // placeholder={data.mainImage.asset?.metadata?.lqip ? "blur" : "empty"}
        // blurDataURL={data.mainImage.asset?.metadata?.lqip || undefined}
        quality={95}
        unoptimized
      />

      <div className="hero-overlay absolute inset-0" />

      <div className="absolute bottom-8 left-2.5 flex flex-col gap-1 md:bottom-2 md:left-4">
        <div className="flex gap-1.5">
          <h1 className="h2 text-[#F9F7F6]">{data.name || "Untitled Project"} -</h1>

          <p className="h2 text-[#F9F7F6]">{data.shortDescription || ""}</p>
        </div>
        <div className="project-hero-title h1-display max-w-[900px] text-[#F9F7F6]">
          <Balancer>{getLocalizedValue(data.projectSummary, lng)}</Balancer>
        </div>
      </div>
    </div>
  );
}
