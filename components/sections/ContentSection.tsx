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
import Accordion from "../Accordion";

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
  const [animateLeft, setAnimateLeft] = useState(false);

  useLayoutEffect(() => {
    function updateParallax() {
      if (!leftSideRef.current || !rightSideRef.current || !sectionRef.current) return;

      const leftHeight = leftSideRef.current.offsetHeight;
      const rightHeight = rightSideRef.current.offsetHeight;
      const diff = Math.abs(rightHeight - leftHeight);

      console.log("Left height:", leftHeight);
      console.log("Right height:", rightHeight);
      console.log("Height difference:", diff);

      let y = "0px";
      if (diff > 0) {
        y = `${diff}px`;
        // Determine which side should animate
        setAnimateLeft(leftHeight > rightHeight);
      } else {
        setAnimateLeft(false);
      }
      setParallaxY(y);
    }

    updateParallax();
    window.addEventListener("resize", updateParallax);
    return () => window.removeEventListener("resize", updateParallax);
  }, [data]);

  useGSAP(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      ScrollTrigger.getById("left-parallax")?.kill();
      ScrollTrigger.getById("right-parallax")?.kill();
      return;
    }

    if (!sectionRef.current || parallaxY === "0px") return;

    // Kill existing animations
    ScrollTrigger.getById("left-parallax")?.kill();
    ScrollTrigger.getById("right-parallax")?.kill();

    const targetElement = animateLeft ? leftSideRef.current : rightSideRef.current;
    const animationId = animateLeft ? "left-parallax" : "right-parallax";

    if (!targetElement) return;

    gsap.fromTo(
      targetElement,
      { y: 0 },
      {
        y: `-${parallaxY}`,
        ease: "none",
        scrollTrigger: {
          id: animationId,
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0,
          invalidateOnRefresh: true,
        },
      },
    );

    ScrollTrigger.refresh();
  }, [parallaxY, animateLeft]);

  return (
    <div
      ref={sectionRef}
      className="flex items-start gap-[60px] bg-[#140D01] px-2.5 text-[#F9F7F6] md:px-5"
      style={{
        height:
          Math.min(
            leftSideRef.current?.offsetHeight || 0,
            rightSideRef.current?.offsetHeight || 0,
          ) || undefined,
        overflow: "hidden",
      }}
    >
      <div
        ref={leftSideRef}
        className="flex w-full flex-col gap-[140px] md:w-1/2 md:gap-[254px]"
        style={{ willChange: "transform" }}
      >
        <div className="mt-20 flex flex-col gap-[30px] md:mt-[85px] md:gap-[280px]">
          <h1 className="h1-desktop max-w-[620px]">{data.section1.title}</h1>

          {data.images && data.images.length > 0 && (
            <Image
              src={urlFor(data.images[0])
                .width(getImageWidth(data.images[0])!)
                .height(getImageHeight(data.images[0])!)
                .quality(100)
                .url()}
              alt={data.images[0].alt || "Section image"}
              width={getImageWidth(data.images[0])!}
              height={getImageHeight(data.images[0])!}
              className="flex object-contain md:hidden"
              unoptimized
            />
          )}
          <div>
            <p className="body text-[#8E8E8E] md:max-w-[330px]">
              <Balancer>{data.section1.body}</Balancer>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-[140px] md:gap-44">
          <div className="flex flex-col gap-8 md:gap-20">
            {data.images && data.images.length > 0 && (
              <Image
                src={urlFor(data.images[1])
                  .width(getImageWidth(data.images[1])!)
                  .height(getImageHeight(data.images[1])!)
                  .quality(100)
                  .url()}
                alt={data.images[1].alt || "Section image"}
                width={getImageWidth(data.images[1])!}
                height={getImageHeight(data.images[1])!}
                className="flex object-contain md:hidden"
                unoptimized
              />
            )}
            <h2 className="h1-desktop">{data.section2.title}</h2>
            <div className="hidden grid-cols-2 gap-x-[64px] gap-y-[70px] md:grid">
              {data.section2.items.map((item: any, index: number) => (
                <div key={index} className="flex w-fit flex-col gap-3">
                  <h3 className="h2-desktop">{item.title}</h3>
                  <p className="body-2 max-w-[290px] text-[#989898]">
                    <Balancer>{item.body}</Balancer>
                  </p>
                </div>
              ))}
            </div>
            <div className="md:hidden">
              <Accordion items={data.section2.items} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {data.images && data.images.length > 0 && (
              <Image
                src={urlFor(data.images[2])
                  .width(getImageWidth(data.images[2])!)
                  .height(getImageHeight(data.images[2])!)
                  .quality(100)
                  .url()}
                alt={data.images[2].alt || "Section image"}
                width={getImageWidth(data.images[2])!}
                height={getImageHeight(data.images[2])!}
                className="flex object-contain md:hidden"
                unoptimized
              />
            )}
            <div className="flex flex-col">
              <h2 className="h1-desktop">{data.section3.title}</h2>
              {data.section3.image && (
                <div className="pt-8 md:pt-20">
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

              <p className="body pt-10 pb-5 text-[#989898] md:max-w-[370px] md:pb-8">
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
        </div>

        <div className="flex flex-col gap-8 md:gap-20">
          {data.images && data.images.length > 0 && (
            <Image
              src={urlFor(data.images[3])
                .width(getImageWidth(data.images[3])!)
                .height(getImageHeight(data.images[3])!)
                .quality(100)
                .url()}
              alt={data.images[3].alt || "Section image"}
              width={getImageWidth(data.images[3])!}
              height={getImageHeight(data.images[3])!}
              className="flex object-contain md:hidden"
              unoptimized
            />
          )}

          <h2 className="h1-desktop">{data.section4.title}</h2>

          <div className="flex flex-col gap-11">
            <div className="flex flex-col gap-10">
              {data.section4.reviews.map((review: any, index: number) => (
                <div key={index} className="body flex flex-col md:max-w-[370px]">
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
        className="hidden w-1/2 flex-col gap-4 self-start md:flex"
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
              className="h-auto w-full object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
