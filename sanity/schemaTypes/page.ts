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
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
      components: {
        input: SlugPreviewInput,
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
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
      group: "content",
      readOnly: true,
    }),
    defineField({
      name: "components",
      title: "Page Components",
      type: "array",
      group: "content",
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
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the page title for search engines",
      validation: (rule) => rule.max(60).warning("Keep SEO titles under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      group: "seo",
      rows: 3,
      description: "Meta description for search results",
      validation: (rule) => rule.max(160).warning("Keep descriptions under 160 characters"),
    }),
    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
      group: "seo",
      description: "Open Graph / social share image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "seo",
      description: "Prevent this page from being indexed",
      initialValue: false,
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
