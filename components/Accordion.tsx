"use client";

import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Balancer from "react-wrap-balancer";

interface AccordionItem {
  title: string;
  body: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const accordionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Initialize all accordions as closed
      contentRefs.current.forEach((ref) => {
        if (ref) {
          gsap.set(ref, { height: 0, paddingBottom: 0 });
        }
      });
    },
    { scope: accordionRef },
  );

  const toggleAccordion = (index: number) => {
    const isOpening = openIndex !== index;
    const previousIndex = openIndex;

    setOpenIndex(isOpening ? index : null);

    // Close previous accordion if exists
    if (previousIndex !== null && previousIndex !== index && contentRefs.current[previousIndex]) {
      gsap.to(contentRefs.current[previousIndex], {
        height: 0,
        paddingBottom: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });

      if (iconRefs.current[previousIndex]) {
        gsap.to(iconRefs.current[previousIndex], {
          rotation: 0,
          duration: 0.3,
          ease: "power2.inOut",
        });
        // Change back to plus when closing
        iconRefs.current[previousIndex]!.textContent = "+";
      }
    }

    // Toggle current accordion
    if (contentRefs.current[index]) {
      if (isOpening) {
        // Open
        gsap.set(contentRefs.current[index], { height: "auto" });
        const fullHeight = contentRefs.current[index]!.offsetHeight;
        gsap.fromTo(
          contentRefs.current[index],
          {
            height: 0,
            paddingBottom: 0,
          },
          {
            height: fullHeight,
            paddingBottom: 16,
            duration: 0.4,
            ease: "power2.inOut",
          },
        );

        if (iconRefs.current[index]) {
          gsap.to(iconRefs.current[index], {
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
          // Change content to minus
          iconRefs.current[index]!.textContent = "−";
        }
      } else {
        // Close
        gsap.to(contentRefs.current[index], {
          height: 0,
          paddingBottom: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

        if (iconRefs.current[index]) {
          gsap.to(iconRefs.current[index], {
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
          // Change content back to plus
          iconRefs.current[index]!.textContent = "+";
        }
      }
    }
  };

  return (
    <div ref={accordionRef} className="flex flex-col">
      {items.map((item, index) => (
        <div key={index} className={`border-b border-[#F3F4EE]/50 py-[25px] ${index === 0 ? 'border-t' : ''}`}>
          <button
            onClick={() => toggleAccordion(index)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <h3 className="h2 text-[#F9F7F6]">{item.title}</h3>
            <span ref={(el) => { iconRefs.current[index] = el; }} className="text-2xl text-[#F9F7F6]">
              +
            </span>
          </button>
          <div ref={(el) => { contentRefs.current[index] = el; }} className="overflow-hidden">
            <p className="body-2 text-[#989898]">
              <Balancer>{item.body}</Balancer>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
