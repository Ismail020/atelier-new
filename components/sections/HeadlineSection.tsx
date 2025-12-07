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
    <section className="max-w-[970px] px-2.5 pt-20 pb-[50px] md:px-5 md:pt-44">
      <div className="">
        <h2 className="h2-display text-[#140D01] md:indent-[2em]">
          {renderHeadlineContent(data.headline, lng)}
        </h2>
      </div>
    </section>
  );
}
