import { defineField } from "sanity";

export const heroSection = {
  type: "object",
  name: "heroSection",
  title: "Hero Section",
  fields: [
    defineField({
      name: "images",
      title: "Hero Images",
      type: "array",
      description: "Add exactly 4 images that will loop/rotate",
      validation: (rule) =>
        rule.required().length(4).error("Please add exactly 4 images"),
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
      name: "logo",
      title: "Logo/Brand Image",
      type: "image",
      description: "Logo or brand image to display on the hero",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: `Hero Section`,
      };
    },
  },
};
