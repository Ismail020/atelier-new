import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";

export const pageType = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      components: {
        input: SlugPreviewInput,
      },
    }),

    defineField({
      name: "language",
      type: "string",
      readOnly: true,
    }),
  ],
});
