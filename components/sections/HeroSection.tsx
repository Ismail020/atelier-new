"use client";

import { urlFor, getImageWidth, getImageHeight, hasImageDimensions } from "@/sanity/lib/image";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { SanityImage, SanityImageArray } from "@/types/sanity";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface HeroSectionData {
  _type: "heroSection";
  _key: string;
  images: SanityImageArray;
  logo: SanityImage;
}

interface HeroSectionProps {
  data: HeroSectionData;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data.images && data.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % data.images.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [data.images]);

  useGSAP(
    () => {
      if (!logoRef.current || !heroRef.current) return;

      const logo = logoRef.current;
      const hero = heroRef.current;

      gsap.to(logo, {
        y: "60vh",
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        hero,
        {
          filter: "brightness(1)",
        },
        {
          filter: "brightness(0)",
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [data.logo] },
  );

  if (!data.images || data.images.length === 0) {
    return null;
  }

  function getHeroDimensions() {
    if (typeof window === "undefined") return { w: 1920, h: 1080 };

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    return {
      w: vw,
      h: vh,
    };
  }

  const { w, h } = getHeroDimensions();

  return (
    <div ref={heroRef} className="relative h-[calc(100svh-62px)] w-full overflow-hidden">
      <div className="absolute inset-0">
        {data.images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={urlFor(image).width(w).height(h).url()}
              alt={`Hero image ${index + 1}`}
              width={w}
              height={h}
              className="absolute inset-0 h-full w-full object-cover object-center"
              priority={index === 0}
              fetchPriority={index === 0 ? "high" : "low"}
              unoptimized
              sizes="
                (max-width: 768px) 100vw,
                (max-width: 1200px) 100vw,
                100vw
              "
              placeholder="blur"
              blurDataURL={image.asset?.metadata?.lqip}
            />
          </div>
        ))}
      </div>

      <div className="hero-overlay absolute inset-0" />

      {data.logo && hasImageDimensions(data.logo) && (
        <div
          ref={logoRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
        >
          <Image
            src={urlFor(data.logo)
              .width(getImageWidth(data.logo)!)
              .height(getImageHeight(data.logo)!)
              .quality(100)
              .url()}
            alt="Logo"
            width={getImageWidth(data.logo)!}
            height={getImageHeight(data.logo)!}
            fetchPriority={"high"}
            unoptimized
          />
        </div>
      )}
    </div>
  );
}
