import { defineField } from "sanity";

export const allProjectsSection = {
  type: "object",
  name: "allProjectsSection",
  title: "All Projects Section",
  fields: [
    defineField({
      name: "headline",
      title: "Section Headline",
      type: "array",
      description: "Rich text headline with highlight annotation",
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
    defineField({
      name: "projectLinkText",
      title: "Project Button Text",
      type: "string",
      description: "Text for individual project buttons (e.g. 'View Project', 'Learn More')",
      validation: (rule) => rule.required(),
      placeholder: "View Project",
    }),
    defineField({
      name: "projectsSource",
      title: "Projects Source",
      type: "boolean",
      readOnly: true,
      initialValue: true,
      description: "All projects from the 'project' content type will be displayed here",
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
        title: "All Projects Section",
        subtitle: plainText.length > 60 ? plainText.substring(0, 60) + "..." : plainText,
      };
    },
  },
};
