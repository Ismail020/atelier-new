import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";
import { heroSection } from "./components/heroSection";
import { headlineSection } from "./components/headlineSection";
import { projectsSection } from "./components/projectsSection";
import { allProjectsSection } from "./components/allProjectsSection";

export const pageType = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
      components: {
        input: SlugPreviewInput,
      },
    }),
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "components",
      title: "Page Components",
      type: "array",
      description: "Add and arrange components for this page",
      of: [heroSection, headlineSection, projectsSection, allProjectsSection] as any,
    }),
  ],
  preview: {
    select: {
      title: "name",
      language: "language",
    },
    prepare({ title, language }) {
      return {
        title: title || "Untitled Page",
        subtitle: language
          ? `Language: ${language.toUpperCase()}`
          : "No language set",
      };
    },
  },
});
