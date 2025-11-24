import { defineField } from "sanity";

export const pressCoverageSection = {
  type: "object",
  name: "pressCoverageSection",
  title: "Press Coverage Section",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Title for the press coverage section",
      validation: (rule) => rule.required(),
      placeholder: "Press Coverage",
    }),
    defineField({
      name: "pressSource",
      title: "Press Source",
      type: "boolean",
      readOnly: true,
      initialValue: true,
      description: "All press coverage from the 'press' content type will be displayed here",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title?: string }) {
      return {
        title: "Press Coverage Section",
        subtitle: title || "No title set",
      };
    },
  },
};
