import { defineField } from "sanity";

export const headlineSection = {
  type: "object",
  name: "headlineSection",
  title: "Headline Section",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "array",
      description: "Rich text with highlight annotation for frontend styling",
      validation: (rule) => rule.required(),
      of: [
        {
          type: "block",
          styles: [
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Normal", value: "normal" },
          ],
          lists: [],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "highlight",
                type: "object",
                title: "Highlight",
                fields: [
                  {
                    name: "markForStyling",
                    type: "boolean",
                    title: "Mark for styling",
                    description: "This text will be wrapped in a span for custom frontend styling",
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      headline: "headline",
    },
    prepare({
      headline,
    }: {
      headline?: Array<{ _type: string; children?: Array<{ text?: string }> }>;
    }) {
      // Extract plain text from block content for preview
      const plainText =
        headline
          ?.map((block) =>
            block._type === "block" && block.children
              ? block.children.map((child) => child.text || "").join("")
              : "",
          )
          .join(" ") || "No headline";

      return {
        title: "Headline Section",
        subtitle: plainText.length > 60 ? plainText.substring(0, 60) + "..." : plainText,
      };
    },
  },
};
