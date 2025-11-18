import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";
import { CaseIcon } from "@sanity/icons";
import { GalleryInput } from "./components/galleryInput";

export const projectType = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "content", title: "Content & Description" },
    { name: "media", title: "Media" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Project Name",
      type: "string",
      group: "details",
      validation: (rule) => rule.required(),
      components: {
        input: SlugPreviewInput,
      },
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      group: "details",
      description:
        "Brief description for cards, previews, etc. (1-2 sentences)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Project Date",
      type: "date",
      group: "details",
      description: "Date when the project was completed or published",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectSummary",
      title: "Project Summary",
      type: "internationalizedArrayString",
      group: "content",
      description: "Medium-length summary of the project (2-3 paragraphs)",
    }),
    defineField({
      name: "projectDescription",
      title: "Project Description",
      type: "internationalizedArrayString",
      group: "content",
      description: "Full detailed description of the project",
    }),
    defineField({
      name: "mainImage",
      title: "Main Photo",
      type: "image",
      group: "media",
      description: "Primary project image used as hero/featured image",
      validation: (rule) => rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "previewImages",
      title: "Preview Photos",
      type: "array",
      group: "media",
      description: "4 photos to display on the projects overview page",
      validation: (rule) =>
        rule
          .required()
          .length(4)
          .error("Exactly 4 preview photos are required"),
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      group: "media",
      description: "Complete collection of project photos",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
    }),
    defineField({
      name: "galleryLayout",
      title: "Gallery Layout",
      type: "array",
      group: "media",
      of: [
        {
          type: "object",
          name: "galleryRow",
          title: "Gallery Row",
          fields: [
            {
              name: "type",
              title: "Row Type",
              type: "string",
              validation: (rule) => rule.required(),
            },
            {
              name: "images",
              title: "Images",
              type: "array",
              of: [{ type: "string" }],
              validation: (rule) => rule.required(),
            },
          ],
        },
      ],
      components: {
        input: GalleryInput,
      },
    }),
    defineField({
      name: "showContactUsButton",
      title: "Show Contact Us Button",
      type: "boolean",
      group: "details",
      description: "Show the contact us button on this project page (configured in Site Settings)",
      initialValue: true,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "name",
      shortDescription: "shortDescription",
      media: "mainImage",
    },
    prepare({ title, shortDescription, media }) {
      return {
        title: title || "Untitled Project",
        subtitle: shortDescription || "No description",
        media: media,
      };
    },
  },
});
