"use client";

import { Language } from "@/types/TranslationsData";
import { renderHeadlineContent, Headline } from "../utils/renderHeadlineContent";

export interface HeadlineSectionData {
  _key: string;
  _type: string;
  headline: Headline[];
}

interface HeadlineSectionProps {
  data: HeadlineSectionData;
  lng: Language;
}

export default function HeadlineSection({ data, lng }: HeadlineSectionProps) {
  return (
    <section className="max-w-[970px] px-2.5 pt-44 pb-[50px] md:px-5">
      <div className="">
        <h2 className="h2-display indent-[2em] text-[#140D01]">
          {renderHeadlineContent(data.headline, lng)}
        </h2>
      </div>
    </section>
  );
}
