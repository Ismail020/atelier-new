import { Language } from "@/types/TranslationsData";
import markdownit from "markdown-it";

export interface TermsConditionsSectionData {
  _type: "termsConditionsSection";
  _key: string;
  title: string;
  content: string;
}

interface TermsConditionsSectionProps {
  data: TermsConditionsSectionData;
  lng: Language;
}

const md = markdownit();

export default function TermsConditionsSection({ data }: TermsConditionsSectionProps) {
  const parsedContent = md.render(data.content);
  return (
    <div className="flex flex-col gap-6 px-2.5 pt-20 md:px-5 md:pt-44">
      <h1 className="h2-display text-[#140D01]">{data.title}</h1>
      <div
        className="rich-text max-w-[580px]"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    </div>
  );
}
