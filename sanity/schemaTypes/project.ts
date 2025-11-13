import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";
import { CaseIcon } from "@sanity/icons";

export const projectType = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "name",
      title: "Project Name",
      type: "string",
      validation: (rule) => rule.required(),
      components: {
        input: SlugPreviewInput,
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      description:
        "Brief description for cards, previews, etc. (1-2 sentences)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectSummary",
      title: "Project Summary",
      type: "internationalizedArrayString",
      description: "Medium-length summary of the project (2-3 paragraphs)",
    }),
    defineField({
      name: "projectDescription",
      title: "Project Description",
      type: "internationalizedArrayString",
      description: "Full detailed description of the project",
    }),
  ],
  preview: {
    select: {
      title: "name",
      shortDescription: "shortDescription",
    },
    prepare({ title, shortDescription }) {
      return {
        title: title || "Untitled Project",
        subtitle: shortDescription || "No description",
      };
    },
  },
});
