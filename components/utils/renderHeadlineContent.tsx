import TransitionLink from "./TransitionLink";
import { Language } from "@/types/TranslationsData";

export interface Headline {
  _key: string;
  _type: string;
  children: Child[];
  markDefs: MarkDef[];
  style: string;
}

export interface Child {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface MarkDef {
  _key: string;
  _type: string;
  markForStyling?: boolean;
  linkToPage?: {
    _ref: string;
    _type: string;
    slug?: {
      current: string;
    };
  };
}

export function renderHeadlineContent(headline: Headline[], lng: Language): React.ReactNode {
  if (!headline || headline.length === 0) return null;

  return headline.map((block) => {
    if (block._type !== "block" || !block.children) return null;

    return (
      <span key={block._key}>
        {block.children.map((child) => {
          if (child.marks && child.marks.length > 0) {
            const markDef = block.markDefs?.find((def) => child.marks.includes(def._key));
            if (markDef && markDef._type === "highlight") {
              if (markDef.linkToPage?.slug?.current) {
                const href =
                  lng === "en"
                    ? `/en/${markDef.linkToPage.slug.current}`
                    : `/${markDef.linkToPage.slug.current}`;

                return (
                  <TransitionLink key={child._key} href={href} className="text-[#CECECE]">
                    {child.text}
                  </TransitionLink>
                );
              }

              return (
                <span key={child._key} className="text-[#CECECE]">
                  {child.text}
                </span>
              );
            }
          }

          return <span key={child._key}>{child.text}</span>;
        })}
      </span>
    );
  });
}
