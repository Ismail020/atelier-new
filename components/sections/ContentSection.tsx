"use client";

import { Language } from "@/types/TranslationsData";
import Balancer from "react-wrap-balancer";
import TransitionLink from "../utils/TransitionLink";
import Image from "next/image";
import { getImageHeight, getImageWidth, urlFor } from "@/sanity/lib/image";
import { NavArrowWhite } from "../Icons";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ContentSectionData {
  _key: string;
  _type: string;
  content: any;
}

interface ContentSectionProps {
  data: any;
  lng: Language;
}

export default function ContentSection({ data, lng }: ContentSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftSideRef = useRef<HTMLDivElement>(null);
  const rightSideRef = useRef<HTMLDivElement>(null);

  const [parallaxY, setParallaxY] = useState("0px");

  useLayoutEffect(() => {
    function updateParallax() {
      if (!leftSideRef.current || !rightSideRef.current || !sectionRef.current) return;

      const leftHeight = leftSideRef.current.offsetHeight;
      const rightHeight = rightSideRef.current.offsetHeight;

      // We want the right side to move up just enough so its bottom aligns with the left side's bottom
      // when viewed through the container's viewport
      const diff = rightHeight - leftHeight;

      console.log("Left height:", leftHeight);
      console.log("Right height:", rightHeight);
      console.log("Height difference:", diff);

      let y = "0px";
      if (diff > 0) {
        // Move exactly the difference so both sides end at the same visual point
        y = `${diff}px`;
      }
      setParallaxY(y);
    }

    updateParallax();
    window.addEventListener("resize", updateParallax);
    return () => window.removeEventListener("resize", updateParallax);
  }, [data]);

  useGSAP(() => {
    if (!sectionRef.current || !rightSideRef.current || parallaxY === "0px") return;

    // Kill existing animation
    ScrollTrigger.getById("right-parallax")?.kill();

    gsap.fromTo(
      rightSideRef.current,
      { y: 0 },
      {
        y: `-${parallaxY}`,
        ease: "none",
        scrollTrigger: {
          id: "right-parallax",
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          markers: true,
          invalidateOnRefresh: true,
        },
      },
    );

    ScrollTrigger.refresh();
  }, [parallaxY]);

  return (
    <div
      ref={sectionRef}
      className="flex items-start gap-[60px] bg-[#140D01] px-2.5 text-[#F9F7F6] md:px-5"
      style={{
        height: leftSideRef.current?.offsetHeight || undefined,
        overflow: "hidden",
      }}
    >
      <div ref={leftSideRef} className="flex w-1/2 flex-col gap-[254px]">
        <div className="mt-20 flex flex-col gap-[280px] md:mt-[85px]">
          <h1 className="h1-desktop max-w-[620px]">{data.section1.title}</h1>

          <div>
            <p className="body max-w-[330px]">
              <Balancer>{data.section1.body}</Balancer>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-44">
          <div className="flex flex-col gap-20">
            <h2 className="h1-desktop">{data.section2.title}</h2>

            <div className="grid grid-cols-2 gap-x-[64px] gap-y-[70px]">
              {data.section2.items.map((item: any, index: number) => (
                <div key={index} className="flex w-fit flex-col gap-3">
                  <h3 className="h2-desktop">{item.title}</h3>
                  <p className="body-2 max-w-[290px] text-[#989898]">
                    <Balancer>{item.body}</Balancer>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <h2 className="h1-desktop">{data.section3.title}</h2>
            {data.section3.image && (
              <div className="pt-20">
                <Image
                  src={urlFor(data.section3.image)
                    .width(getImageWidth(data.section3.image)!)
                    .height(getImageHeight(data.section3.image)!)
                    .quality(100)
                    .url()}
                  alt={data.section3.image.alt || "Section image"}
                  width={getImageWidth(data.section3.image)!}
                  height={getImageHeight(data.section3.image)!}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}

            <p className="body max-w-[370px] pt-[42px] pb-8 text-[#989898]">
              <Balancer>{data.section3.body}</Balancer>
            </p>

            <TransitionLink
              href={
                data.section3.buttonLink?.slug?.current
                  ? `/${lng === "en" ? "en/" : ""}${data.section3.buttonLink.slug.current}`
                  : "#"
              }
              className="button-white buttons"
            >
              {data.section3.buttonText}
            </TransitionLink>
          </div>
        </div>

        <div className="flex flex-col gap-20">
          <h2 className="h1-desktop">{data.section4.title}</h2>

          <div className="flex flex-col gap-11">
            <div className="flex flex-col gap-10">
              {data.section4.reviews.map((review: any, index: number) => (
                <div key={index} className="body flex max-w-[370px] flex-col">
                  <p className="text-[#989898]">
                    <Balancer>{review.body}</Balancer>
                  </p>
                  <p className="text-[#F9F7F6]">
                    <Balancer>{review.person}</Balancer>
                  </p>
                </div>
              ))}
            </div>

            <Link
              className="nav hidden items-center gap-3 md:flex"
              href={data.section4.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.section4.buttonText}
              <NavArrowWhite />
            </Link>
          </div>
        </div>
      </div>

      <div
        ref={rightSideRef}
        className="flex w-1/2 flex-col gap-4 self-start"
        style={{ willChange: "transform" }}
      >
        {data.images.map((image: any, index: number) => (
          <div key={index} className="">
            <Image
              src={urlFor(image)
                .width(getImageWidth(image)!)
                .height(getImageHeight(image)!)
                .quality(100)
                .url()}
              alt={image.alt || "Section image"}
              width={getImageWidth(image)!}
              height={getImageHeight(image)!}
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
