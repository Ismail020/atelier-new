export interface HeadlineSectionData {
  _key: string;
  _type: string;
  headline: Headline[];
}

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
}

function renderHeadlineContent(headline: Headline[]): React.ReactNode {
  if (!headline || headline.length === 0) return null;

  return headline.map((block) => {
    if (block._type !== "block" || !block.children) return null;

    return (
      <span key={block._key}>
        {block.children.map((child) => {
          if (child.marks && child.marks.length > 0) {
            const markDef = block.markDefs?.find((def) => child.marks.includes(def._key));
            if (markDef && markDef._type === "highlight") {
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

export default function HeadlineSection({ data }: { data: HeadlineSectionData }) {
  return (
    <section className="max-w-[970px] px-2.5 md:px-5 pt-44 pb-[50px]">
      <div className="">
        <h2 className="h2-display indent-[2em] text-[#140D01]">
          {renderHeadlineContent(data.headline)}
        </h2>
      </div>
    </section>
  );
}
