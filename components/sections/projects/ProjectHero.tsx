"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { urlFor } from "@/sanity/lib/image";
import Balancer from "react-wrap-balancer";

interface ProjectHeroProps {
  image: {
    asset: {
      _id: string;
      url?: string;
      metadata?: {
        dimensions?: {
          width?: number;
          height?: number;
        };
        lqip?: string;
        blurHash?: string;
      };
    } | null;
    alt?: string;
  } | null;
  projectName: string | null;
  shortDescription?: string | null;
  projectSummary?:
    | Array<{
        _key: string;
        _type: string;
        value?: string;
      }>
    | string
    | null;
}

// Helper function to get localized value from internationalized array
function getLocalizedValue(
  content: Array<{ _key: string; _type: string; value?: string }> | string | null | undefined,
  locale: string,
): string {
  if (!content) return "";
  if (typeof content === "string") return content;

  const localizedItem = content.find((item) => item._key === locale);
  return localizedItem?.value || content[0]?.value || "";
}

export default function ProjectHero({
  image,
  projectName,
  shortDescription,
  projectSummary,
}: ProjectHeroProps) {
  const params = useParams();
  const locale = (params?.slug as string) || "en";

  if (!image?.asset) return null;

  return (
    <div className="relative mt-[-62px] h-screen w-full overflow-hidden">
      <Image
        src={urlFor(image)
          .width(image.asset?.metadata?.dimensions?.width || 1920)
          .height(image.asset?.metadata?.dimensions?.height || 1080)
          .quality(95)
          .url()}
        alt={image.alt || `${projectName || "Project"} hero image`}
        fill
        className="object-cover transition-opacity duration-300"
        priority
        fetchPriority="high"
        placeholder={image.asset?.metadata?.lqip ? "blur" : "empty"}
        blurDataURL={image.asset?.metadata?.lqip || undefined}
        quality={95}
      />

      <div className="hero-overlay absolute inset-0" />

      <div className="absolute bottom-8 left-3.5 flex flex-col gap-1 md:bottom-2 md:left-4">
        <div className="flex gap-1.5">
          <h1 className="h2 text-[#F9F7F6]">{projectName || "Untitled Project"} -</h1>

          <p className="h2 text-[#F9F7F6]">{shortDescription || ""}</p>
        </div>
        <div className="h1-display max-w-[900px] text-[#F9F7F6]">
          <Balancer>{getLocalizedValue(projectSummary, locale)}</Balancer>
        </div>
      </div>
    </div>
  );
}
