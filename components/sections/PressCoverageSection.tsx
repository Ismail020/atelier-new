"use client";

import { useState, useEffect } from "react";
import { Language } from "@/types/TranslationsData";
import { getLocalizedValue } from "@/utils/getLocalizedValue";
import Balancer from "react-wrap-balancer";
import { NavArrow } from "../Icons";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import VideoPlayer from "../VideoPlayer";

export interface PressCoverageSectionData {
  _type: "pressCoverageSection";
  _key: string;
  title: string;
}

interface PressArticle {
  _id: string;
  magazineName: string;
  media: {
    type: "image" | "video";
    image?: {
      asset: {
        _id: string;
        url: string;
        metadata?: {
          lqip?: string;
          dimensions?: {
            width: number;
            height: number;
          };
        };
      };
      alt?: string;
    };
    video?: string;
  };
  body: Array<{
    _key: string;
    _type: string;
    language: Language;
    value: string;
  }>;
  externalLink: string;
  _createdAt: string;
}

interface PressCoverageSectionProps {
  data: PressCoverageSectionData;
  lng: Language;
}

export default function PressCoverageSection({ data, lng }: PressCoverageSectionProps) {
  const [pressArticles, setPressArticles] = useState<PressArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPressArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/press");
        const result = await response.json();

        if (result.success) {
          setPressArticles(result.data || []);
        } else {
          setError(result.error || "Failed to fetch press articles");
        }
      } catch (err) {
        console.error("Error fetching press articles:", err);
        setError("Failed to fetch press articles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPressArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 px-2.5 pt-20 md:gap-16 md:px-5 md:pt-44">
        <h1 className="h2-display text-[#140D01]">{data.title}</h1>

        <div className="flex flex-col gap-20">
          {/* Skeleton items */}
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex animate-pulse flex-col gap-5 md:flex-row">
              {/* Media skeleton */}
              <div
                className="relative w-full rounded bg-gray-300 md:max-w-[50%]"
                style={{ aspectRatio: "696/410.119" }}
              />

              {/* Content skeleton */}
              <div className="flex flex-col justify-end gap-2 md:gap-[30px]">
                <div className="flex flex-col gap-2 md:gap-4">
                  {/* Title skeleton */}
                  <div className="h-6 w-48 rounded bg-gray-300" />

                  {/* Text skeleton */}
                  <div className="flex flex-col gap-2 md:max-w-[330px]">
                    <div className="h-4 w-full rounded bg-gray-300" />
                    <div className="h-4 w-4/5 rounded bg-gray-300" />
                    <div className="h-4 w-3/4 rounded bg-gray-300" />
                  </div>
                </div>

                {/* Link skeleton */}
                <div className="h-5 w-32 rounded bg-gray-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return;
  }

  return (
    <div className="flex flex-col gap-8 px-2.5 pt-20 md:gap-16 md:px-5 md:pt-44">
      <h1 className="h2-display text-[#140D01]">{data.title}</h1>

      <div className="flex flex-col gap-20">
        {pressArticles.map((article) => {
          return (
            <div key={article._id} className="flex flex-col gap-5 md:flex-row">
              <div
                className="relative w-full md:max-w-[50%]"
                style={{ aspectRatio: "696/410.119", willChange: "auto" }}
              >
                {article.media.type === "image" && article.media.image ? (
                  <Image
                    src={urlFor(article.media.image).width(696).height(410).quality(75).url()}
                    alt={article.media.image.alt || article.magazineName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : article.media.type === "video" && article.media.video ? (
                  <VideoPlayer
                    className="flex justify-end"
                    videoUrl={article.media.video}
                    videoId={article._id}
                  />
                ) : null}
              </div>

              <div className="flex flex-col justify-end gap-2 md:gap-[30px]">
                <div className="flex flex-col gap-2 md:gap-4">
                  <h3 className="h2-desktop text-[#140D01]">{article.magazineName}</h3>

                  <p className="text-[#8E8E8E] md:max-w-[330px]">
                    <Balancer>{getLocalizedValue(article.body, lng)}</Balancer>
                  </p>
                </div>

                {article.externalLink && (
                  <a
                    href={article.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav flex w-fit items-center gap-3 text-[#140D01]"
                  >
                    Read the full article
                    <NavArrow />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
