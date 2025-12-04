import { defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons";

export const pressType = defineType({
  name: "press",
  title: "Press Coverage",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "magazineName",
      title: "Magazine/Publication Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "media",
      title: "Media",
      type: "object",
      description: "Choose either an image or video",
      fields: [
        defineField({
          name: "type",
          title: "Media Type",
          type: "string",
          options: {
            list: [
              { title: "Image", value: "image" },
              { title: "Video", value: "video" },
            ],
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: {
            hotspot: true,
          },
          hidden: ({ parent }) => parent?.type !== "image",
        }),
        defineField({
          name: "video",
          title: "YouTube Video URL",
          type: "url",
          description: "YouTube video URL (e.g., https://www.youtube.com/watch?v=...)",
          validation: (rule) =>
            rule.custom((url) => {
              if (!url) return true; // Allow empty if not required
              
              const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/;
              if (!youtubeRegex.test(url)) {
                return "Please enter a valid YouTube URL";
              }
              return true;
            }),
          hidden: ({ parent }) => parent?.type !== "video",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Article Excerpt/Body",
      type: "internationalizedArrayString",
      description: "Excerpt or main content from the article",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "externalLink",
      title: "Link to Original Article",
      type: "url",
      description: "Link to the original magazine article",
      validation: (rule) => rule.required().uri({ allowRelative: false }),
    }),
  ],
  preview: {
    select: {
      title: "magazineName",
      media: "media.image",
    },
    prepare({ title, media }) {
      return {
        title: title,
        subtitle: "Press Coverage",
        media: media,
      };
    },
  },
});
