import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";
import { CaseIcon } from "@sanity/icons";
import { GalleryInput } from "./components/galleryInput";
import { ReorderPhotosInput } from "./components/ReorderPhotosInput";
import { PreviewImagesInput } from "./components/previewImagesInput";

export const projectType = defineType({
  name: "project",
  title: "Projects",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "content", title: "Content & Description" },
    { name: "hero", title: "Hero Image" },
    { name: "preview", title: "Preview Images" },
    { name: "gallery", title: "Gallery" },
    { name: "seo", title: "SEO" },
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
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "details",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "string",
      group: "details",
      description: "Brief description for cards, previews, etc. (1-2 sentences)",
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
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description: "Overrides the project title for search engines",
      validation: (rule) => rule.max(60).warning("Keep SEO titles under 60 characters"),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "internationalizedArrayString",
      group: "seo",
      description: "Meta description for search results",
      validation: (rule) => rule.max(160).warning("Keep descriptions under 160 characters"),
    }),
    defineField({
      name: "seoImage",
      title: "SEO Image",
      type: "image",
      group: "seo",
      description: "Open Graph / social share image (overrides the default)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "seo",
      description: "Prevent this project from being indexed",
      initialValue: false,
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
      group: "hero",
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
      group: "preview",
      description:
        "Upload 4+ photos. Select featured for desktop, and choose which ones to show on mobile.",
      validation: (rule) =>
        rule
          .required()
          .min(4)
          .error("At least 4 preview photos are required")
          .custom((images) => {
            if (!images || !Array.isArray(images)) return true;

            const featuredCount = images.filter(
              (img) =>
                img && typeof img === "object" && "isFeatured" in img && img.isFeatured === true,
            ).length;

            const mobileCount = images.filter(
              (img) =>
                img &&
                typeof img === "object" &&
                "showOnMobile" in img &&
                img.showOnMobile === true,
            ).length;

            const featuredMobileCount = images.filter(
              (img) =>
                img &&
                typeof img === "object" &&
                "isFeaturedMobile" in img &&
                img.isFeaturedMobile === true,
            ).length;

            if (featuredCount === 0) {
              return "At least 1 image must be marked as featured for desktop layout";
            }

            if (featuredCount > 1) {
              return "Only 1 image can be marked as featured for desktop";
            }

            if (mobileCount > 3) {
              return "Maximum 3 images recommended for mobile";
            }

            if (featuredMobileCount > 1) {
              return "Only 1 image can be featured on mobile";
            }

            return true;
          }),
      components: {
        input: PreviewImagesInput,
      },
      of: [
        {
          type: "image",
          fields: [
            {
              name: "isFeatured",
              title: "Featured (Desktop)",
              type: "boolean",
              description: "Spans 2 columns on desktop grid",
              initialValue: false,
            },
            {
              name: "showOnMobile",
              title: "Show on Mobile",
              type: "boolean",
              description: "Include in mobile grid (max 3 recommended)",
              initialValue: true,
            },
            {
              name: "isFeaturedMobile",
              title: "Featured (Mobile)",
              type: "boolean",
              description: "Spans 2 columns on mobile grid",
              initialValue: false,
            },
          ],
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
      group: "gallery",
      description: "Complete collection of project photos. Order them logically - our system will auto-layout by image format.",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      components: {
        input: ReorderPhotosInput,
      },
    }),
    defineField({
      name: "galleryLayout",
      title: "Gallery Layout",
      type: "array",
      group: "gallery",
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
