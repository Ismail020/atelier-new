import { defineField } from "sanity";

export const termsConditionsSection = {
  type: "object",
  name: "termsConditionsSection",
  title: "Terms & Conditions Section",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Title for the terms & conditions section",
      validation: (rule) => rule.required(),
      placeholder: "Terms & Conditions",
    }),
    defineField({
      name: "content",
      title: "Terms & Conditions Content",
      type: "markdown",
      description: "Full terms & conditions text with Markdown formatting support",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      content: "content",
    },
    prepare({ title, content }: { title?: string; content?: string }) {
      // Extract preview from markdown content
      const plainText = content || "No content";

      return {
        title: "Terms & Conditions Section",
        subtitle: `${title || "No title"} - ${plainText.length > 60 ? plainText.substring(0, 60) + "..." : plainText}`,
      };
    },
  },
};