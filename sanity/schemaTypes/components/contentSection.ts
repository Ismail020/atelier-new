import { defineField } from "sanity";

export const contentSection = {
  type: "object",
  name: "contentSection",
  title: "Content Section",
  fields: [
    // 5 Images
    defineField({
      name: "images",
      title: "Section Images",
      type: "array",
      description: "Add exactly 5 images for this section",
      validation: (rule) => 
        rule.required().min(5).max(5).error("Please add exactly 5 images"),
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),

    // Section 1: Title and Body
    defineField({
      name: "section1",
      title: "Section 1",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // Section 2: Title and 4 Items
    defineField({
      name: "section2",
      title: "Section 2",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "items",
          title: "Items",
          type: "array",
          description: "Add exactly 4 items",
          validation: (rule) => 
            rule.required().min(4).max(4).error("Please add exactly 4 items"),
          of: [
            {
              type: "object",
              name: "item",
              title: "Item",
              fields: [
                defineField({
                  name: "title",
                  title: "Item Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "body",
                  title: "Item Body",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  body: "body",
                },
                prepare({ title, body }: { title?: string; body?: string }) {
                  return {
                    title: title || "No title",
                    subtitle: body ? (body.length > 50 ? body.substring(0, 50) + "..." : body) : "No body",
                  };
                },
              },
            },
          ],
        }),
      ],
    }),

    // Section 3: Title, Image, Body, Button
    defineField({
      name: "section3",
      title: "Section 3",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          validation: (rule) => rule.required(),
          placeholder: "Learn More",
        }),
        defineField({
          name: "buttonLink",
          title: "Button Link",
          type: "reference",
          to: [{ type: "page" }],
          validation: (rule) => rule.required(),
        }),
      ],
    }),

    // Section 4: Title, Button, Reviews
    defineField({
      name: "section4",
      title: "Section 4",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "buttonText",
          title: "Button Text",
          type: "string",
          validation: (rule) => rule.required(),
          placeholder: "View All Reviews",
        }),
        defineField({
          name: "reviews",
          title: "Reviews",
          type: "array",
          of: [
            {
              type: "object",
              name: "review",
              title: "Review",
              fields: [
                defineField({
                  name: "body",
                  title: "Review Body",
                  type: "text",
                  rows: 3,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "person",
                  title: "Person",
                  type: "string",
                  description: "Format: Name, Month Year (e.g. 'Aude, juillet 2021')",
                  placeholder: "Aude, juillet 2021",
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: {
                  body: "body",
                  person: "person",
                },
                prepare({ body, person }: { body?: string; person?: string }) {
                  return {
                    title: person || "No person",
                    subtitle: body ? (body.length > 50 ? body.substring(0, 50) + "..." : body) : "No review",
                  };
                },
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      section1Title: "section1.title",
      images: "images",
    },
    prepare({ section1Title, images }: { section1Title?: string; images?: Array<unknown> }) {
      const imageCount = images?.length || 0;
      
      return {
        title: "Content Section",
        subtitle: `${section1Title || "No title"} - ${imageCount}/5 images`,
      };
    },
  },
};