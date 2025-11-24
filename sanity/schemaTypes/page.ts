import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";
import { heroSection } from "./components/heroSection";
import { headlineSection } from "./components/headlineSection";
import { projectsSection } from "./components/projectsSection";
import { allProjectsSection } from "./components/allProjectsSection";
import { contentSection } from "./components/contentSection";
import { contactSection } from "./components/contactSection";
import { pressCoverageSection } from "./components/pressCoverageSection";
import { termsConditionsSection } from "./components/termsConditionsSection";

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
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: () => true,
      },
      validation: (rule) => rule.required(),
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
      of: [
        heroSection,
        headlineSection,
        projectsSection,
        allProjectsSection,
        contentSection,
        contactSection,
        pressCoverageSection,
        termsConditionsSection,
      ],
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
        subtitle: language ? `Language: ${language.toUpperCase()}` : "No language set",
      };
    },
  },
});
